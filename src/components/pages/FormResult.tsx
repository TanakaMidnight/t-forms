import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFormStore, type FormState } from '../../store/formStore';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { auth } from '../../firebase';
import { saveAs } from 'file-saver';
import xlsx from 'node-xlsx';

// CSVエクスポート用ユーティリティ
function exportResponsesToCSV(form: Form, responses: import('../../types').FormResponse[]) {
  if (!form) return;
  const headers = [
    'Id',
    ...form.questions.map(q => q.text)
  ];
  const rows = responses.map(res => {
    const row = [res.id];
    for (const q of form.questions) {
      const ans = res.answers.find(a => a.questionId === q.id);
      if (q.type === 'text') {
        row.push(ans?.text ?? '');
      } else if (q.type === 'radio') {
        row.push(ans?.selectedOptions?.[0] ?? '');
      } else if (q.type === 'checkbox') {
        if (Array.isArray(ans?.selectedOptions)) {
          // 選択肢ID→ラベル変換
          const labels = ans.selectedOptions.map(optId => {
            const opt = q.options?.find(o => o.id === optId);
            return opt ? opt.text : optId;
          });
          row.push(labels.join(','));
        } else {
          row.push('');
        }
      } else {
        row.push('');
      }
    }
    return row;
  });
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${form.title || 'responses'}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

async function exportResponsesToExcel(form: Form, responses: import('../../types').FormResponse[]) {
  if (!form) return;

  const headers = [
    'Id',
    ...form.questions.map(q => q.text)
  ];

  const rows = responses.map(res => {
    const row = [res.id];
    for (const q of form.questions) {
      const ans = res.answers.find(a => a.questionId === q.id);
      if (q.type === 'text' || q.type === 'email') {
        row.push(ans?.text ?? '');
      } else if (q.type === 'radio') {
        row.push(ans?.selectedOptions?.[0] ?? '');
      } else if (q.type === 'checkbox') {
        if (Array.isArray(ans?.selectedOptions)) {
          const labels = ans.selectedOptions.map(optId => {
            const opt = q.options?.find(o => o.id === optId);
            return opt ? opt.text : optId;
          });
          row.push(labels.join(','));
        } else {
          row.push('');
        }
      } else if (q.type === 'rating') {
        row.push(ans?.ratingValue !== undefined ? String(ans.ratingValue) : '');
      } else {
        row.push('');
      }
    }
    return row;
  });

  const buffer = xlsx.build([{ name: 'Responses', data: [headers, ...rows], options: {} }]); // Ensure data is a 2D array of strings or numbers
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${form.title || 'responses'}.xlsx`);
}
// granularチャートコンポーネントを利用
import BarChartResult from '../charts/BarChartResult';
import PieChartResult from '../charts/PieChartResult';
import type { Answer, Form } from '../../types';
import { db } from '../../firebase';


import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';


interface FormResultProps {
  t: TFunction;
}


const FormResult: React.FC<FormResultProps> = ({ t }) => {
  const { formId } = useParams<{ formId: string }>();
  const { forms, responses } = useFormStore();
  const [form, setForm] = React.useState(forms.find(f => f.id === formId) || null);
  React.useEffect(() => {
    let unsubscribeResponses: (() => void) | undefined;
    if (!form && formId) {
      // Firestoreからフォーム情報を取得
      import('firebase/firestore').then(({ doc, getDoc }) => {
        const docRef = doc(db, 'forms', formId);
        getDoc(docRef).then(snap => {
          if (snap.exists()) {
            setForm(snap.data() as Form);
          } else {
            setForm(null);
          }
        });
      });
    }
    if (formId) {
      // responsesをリアルタイム購読
      import('firebase/firestore').then(({ collection, query, where, onSnapshot }) => {
        const user = (window as { firebaseAuth?: { currentUser?: { uid: string } }, auth?: { currentUser?: { uid: string } } }).firebaseAuth?.currentUser ||
          (window as { firebaseAuth?: { currentUser?: { uid: string } }, auth?: { currentUser?: { uid: string } } }).auth?.currentUser || undefined;
        // fallback: auth.currentUser
        const authUser = user || auth.currentUser;
        if (!authUser) return;
        const q = query(
          collection(db, 'responses'),
          where('formId', '==', formId),
          where('formOwnerUid', '==', authUser.uid)
        );
        unsubscribeResponses = onSnapshot(q, (snap) => {
          const responses: import('../../types').FormResponse[] = [];
          snap.forEach((doc) => responses.push(doc.data() as import('../../types').FormResponse));
          // Zustand storeにも反映
          useFormStore.setState((state: FormState) => ({ ...state, responses }));
        });
      });
    }
    return () => {
      if (unsubscribeResponses) unsubscribeResponses();
    };
  }, [form, formId]);
  const formResponses = responses.filter(r => r.formId === formId);
  if (!form) {
    return <Typography>{t('form_not_found')}</Typography>;
  }


  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 6, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="md" sx={{ bgcolor: 'white', borderRadius: 4, boxShadow: 4, py: { xs: 5, md: 8 }, px: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2, textAlign: 'center' }}>
          {form.title} - {t('results')}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', fontSize: { xs: 16, md: 18 } }}>
          {form.description}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
          {t('response_count')}: {formResponses.length}
        </Typography>
        {formResponses.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2.5, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 3, boxShadow: 2, letterSpacing: 1, px: 4, minHeight: 44 }}
              onClick={() => exportResponsesToCSV(form, formResponses)}
            >
              {t('export_csv', { defaultValue: 'CSVエクスポート' })}
            </Button>
            <Button
              variant="outlined"
              color="success"
              sx={{ fontWeight: 600, borderRadius: 3, boxShadow: 2, letterSpacing: 1, px: 4, minHeight: 44 }}
              onClick={() => exportResponsesToExcel(form, formResponses)}
            >
              {t('export_excel', { defaultValue: 'Excelエクスポート' })}
            </Button>
          </Box>
        )}
        {formResponses.length > 0 && (
          <Button component={Link} to={`/form/${formId}/responses`} variant="contained" sx={{ mb: 4, fontWeight: 700, px: 5, borderRadius: 3, boxShadow: 3, letterSpacing: 1, minHeight: 44, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6, bgcolor: 'primary.dark' } }}>
            {t('view_all_responses')}
          </Button>
        )}

        {form.questions.map(q => (
          <Box key={q.id} sx={{ mb: 5, width: '100%' }}>
            <Paper sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 4, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>{q.text}</Typography>
              <Divider sx={{ my: 1.5 }} />
              {(q.type === 'text' || q.type === 'email') && (
                <List sx={{ width: '100%' }}>
                  {formResponses.map((res: import('../../types').FormResponse) => {
                    const answer = res.answers.find((a: Answer) => a.questionId === q.id);
                    if (q.type === 'email') {
                      return answer?.text ? (
                        <ListItem key={res.id} sx={{ width: '100%', bgcolor: '#fafafa', borderRadius: 2, mb: 1 }}>
                          <ListItemText
                            primary={answer.text}
                            style={{ wordWrap: 'break-word' }}
                          />
                        </ListItem>
                      ) : null;
                    }
                    // text型
                    return answer?.text ? (
                      <ListItem key={res.id} sx={{ width: '100%', bgcolor: '#fafafa', borderRadius: 2, mb: 1 }}>
                        <ListItemText
                          primary={answer.text}
                          style={{ wordWrap: 'break-word' }}
                        />
                      </ListItem>
                    ) : null;
                  })}
                </List>
              )}
              {(q.type === 'radio' || q.type === 'checkbox') && (
                <BarChartResult
                  options={q.options}
                  responses={formResponses.map(res => {
                    const answer = res.answers.find((a: Answer) => a.questionId === q.id);
                    return { selectedOptions: answer?.selectedOptions };
                  })}
                />
              )}
              {q.type === 'rating' && (
                <PieChartResult
                  values={Array.from({ length: 5 }, (_, i) =>
                    formResponses.filter(res => {
                      const answer = res.answers.find((a: Answer) => a.questionId === q.id);
                      return answer && answer.ratingValue === i + 1;
                    }).length
                  )}
                />
              )}
            </Paper>
          </Box>
        ))}
      </Container>
    </Box>
  );
};


export { FormResult };
const TranslatedFormResult = withTranslation()(FormResult);
export default TranslatedFormResult;

