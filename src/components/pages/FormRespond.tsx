import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Answer, FormResponse, Form, Question, Option } from '../../types';
import { Container, Typography, Button, Box, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox, FormHelperText, Card, CardContent, Fade, Rating } from '@mui/material';


import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import type { Firestore } from 'firebase/firestore';

interface FormRespondProps {
  t: TFunction;
  dbOverride?: Firestore;
  docOverride?: typeof doc;
  getDocOverride?: typeof getDoc;
}

export const FormRespond: React.FC<FormRespondProps> = ({ t, dbOverride, docOverride, getDocOverride }) => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { addResponse } = useFormStore();
  const [form, setForm] = useState<Form | null>(null);

  React.useEffect(() => {
    if (formId) {
      const fetchForm = async () => {
        const docFn = docOverride || doc;
        const getDocFn = getDocOverride || getDoc;
        const dbVal = dbOverride || db;
        const docRef = docFn(dbVal, 'forms', formId);
        const snap = await getDocFn(docRef);
        if (snap.exists()) {
          setForm(snap.data() as Form);
        }
      };
      fetchForm();
    }
  }, [formId, dbOverride, docOverride, getDocOverride]);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string | undefined}>({});

  // text/email型共通のハンドラ
  const handleTextOrEmailChange = (questionId: string, value: string) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, text: value }];
    setAnswers(newAnswers);
  };
  // rating型のハンドラ
  const handleRatingChange = (questionId: string, value: number | null) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, ratingValue: value ?? 0 }];
    setAnswers(newAnswers);
  };

  const handleRadioChange = (questionId: string, value: string) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, selectedOptions: [value] }];
    setAnswers(newAnswers);
  };

  const handleCheckboxChange = (questionId: string, optionId: string, checked: boolean) => {
    const existingAnswer = answers.find(a => a.questionId === questionId);
    let selectedOptions = existingAnswer?.selectedOptions || [];
    if (checked) {
      selectedOptions = [...selectedOptions, optionId];
    } else {
      selectedOptions = selectedOptions.filter(id => id !== optionId);
    }
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, selectedOptions }];
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!form) return;

    const newErrors: { [key: string]: string } = {};
    form.questions.forEach(q => {
      const answer = answers.find(a => a.questionId === q.id);
      if (q.isRequired) {
        if (!answer ||
          ((q.type === 'text' || q.type === 'email') && !answer.text) ||
          ((q.type === 'radio' || q.type === 'checkbox') && (!answer.selectedOptions || answer.selectedOptions.length === 0)) ||
          (q.type === 'rating' && (answer.ratingValue === undefined || answer.ratingValue < 1))
        ) {
          newErrors[q.id] = t('required_question_error');
        }
      }
      // email型のバリデーション
      if (q.type === 'email' && answer && answer.text) {
        // 簡易メールアドレス形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(answer.text)) {
          newErrors[q.id] = t('invalid_email_error') || '有効なメールアドレスを入力してください';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response: FormResponse = {
      id: Date.now().toString(),
      formId: form.id,
      answers,
      formOwnerUid: form.ownerUid,
    };
    addResponse(response);
    navigate('/thank-you');
  };

  if (!form) {
    return <Typography>{t('form_not_found')}</Typography>;
  }
  const questions: Question[] = form.questions || [];

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="md" sx={{ bgcolor: 'white', borderRadius: 4, boxShadow: 4, py: { xs: 5, md: 8 }, px: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2, textAlign: 'center' }}>
          {form.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 5, color: 'text.secondary', textAlign: 'center', fontSize: { xs: 16, md: 18 } }}>
          {form.description}
        </Typography>

        {questions.map((q: Question) => (
          <Card key={q.id} elevation={3} sx={{ mb: 4, width: '100%', borderRadius: 4, boxShadow: 3, transition: 'box-shadow 0.3s', ':hover': { boxShadow: 8 } }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                {q.text}
                {q.isRequired && <span style={{ color: '#e53935', marginLeft: 4 }}>*</span>}
              </Typography>
              {(q.type === 'text' || q.type === 'email') && (
                <Fade in={true}><TextField
                  variant="outlined"
                  fullWidth
                  type={q.type === 'email' ? 'email' : 'text'}
                  onChange={(e) => {
                    handleTextOrEmailChange(q.id, e.target.value);
                    setErrors(prev => ({ ...prev, [q.id]: undefined }));
                  }}
                  error={!!errors[q.id]}
                  helperText={errors[q.id]}
                  sx={{ mt: 1, bgcolor: '#fafafa', borderRadius: 2 }}
                  inputProps={q.type === 'email' ? { autoComplete: 'email' } : {}}
                /></Fade>
              )}
              {q.type === 'rating' && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Rating
                    name={`rating-${q.id}`}
                    value={answers.find(a => a.questionId === q.id)?.ratingValue || 0}
                    onChange={(_, value) => {
                      handleRatingChange(q.id, value);
                      setErrors(prev => ({ ...prev, [q.id]: undefined }));
                    }}
                  />
                  {errors[q.id] && (
                    <FormHelperText sx={{ color: '#e53935', fontWeight: 500, ml: 2 }}>{errors[q.id]}</FormHelperText>
                  )}
                </Box>
              )}
              {q.type === 'radio' && (
                <FormControl component="fieldset" error={!!errors[q.id]} sx={{ mt: 1 }}>
                  <RadioGroup onChange={(e) => {
                    handleRadioChange(q.id, e.target.value);
                    setErrors(prev => ({ ...prev, [q.id]: undefined }));
                  }}>
                    {(q.options as Option[]).map((opt: Option) => (
                      <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.text} />
                    ))}
                  </RadioGroup>
                  <Fade in={!!errors[q.id]}><FormHelperText sx={{ color: '#e53935', fontWeight: 500 }}>{errors[q.id]}</FormHelperText></Fade>
                </FormControl>
              )}
              {q.type === 'checkbox' && (
                <FormControl component="fieldset" error={!!errors[q.id]} sx={{ mt: 1 }}>
                  {(q.options as Option[]).map((opt: Option) => (
                    <FormControlLabel
                      key={opt.id}
                      control={<Checkbox onChange={(e) => {
                        handleCheckboxChange(q.id, opt.id, e.target.checked);
                        setErrors(prev => ({ ...prev, [q.id]: undefined }));
                      }} />}
                      label={opt.text}
                    />
                  ))}
                  <Fade in={!!errors[q.id]}><FormHelperText sx={{ color: '#e53935', fontWeight: 500 }}>{errors[q.id]}</FormHelperText></Fade>
                </FormControl>
              )}
            </CardContent>
          </Card>
        ))}

        <Button variant="contained" color="primary" size="large" onClick={handleSubmit} sx={{ mt: 2, borderRadius: 4, fontWeight: 700, px: 5, py: 1.5, fontSize: '1.1rem', boxShadow: 3, letterSpacing: 1, minHeight: 48, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6, bgcolor: 'primary.dark' } }}>
          {t('submit_answer')}
        </Button>
      </Container>
    </Box>
  );
};


const TranslatedFormRespond = withTranslation()(FormRespond);
export default TranslatedFormRespond;
