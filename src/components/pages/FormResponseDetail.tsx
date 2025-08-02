import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import type { Answer, FormResponse } from '../../types';


import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

interface FormResponseDetailProps {
  t: TFunction;
}

const FormResponseDetail: React.FC<FormResponseDetailProps> = ({ t }) => {
  const { formId, responseId } = useParams<{ formId: string; responseId: string }>();
  const { forms, responses } = useFormStore();

  const form = forms.find(f => f.id === formId);
  const response = responses.find((r: FormResponse) => r.id === responseId && r.formId === formId);

  if (!form || !response) {
    return <Typography>{t('response_or_form_not_found')}</Typography>;
  }

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="md" sx={{ bgcolor: 'white', borderRadius: 4, boxShadow: 4, py: { xs: 5, md: 8 }, px: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2, textAlign: 'center' }}>
          {form.title} - {t('response_detail')}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', fontSize: { xs: 16, md: 18 } }}>
          {form.description}
        </Typography>

        <Paper sx={{ p: { xs: 2.5, sm: 4 }, mb: 5, borderRadius: 4, boxShadow: 3, width: '100%' }}>
          <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>{t('response_content')}</Typography>
          <List>
            {form.questions.map(q => {
              const answer = response.answers.find((a: Answer) => a.questionId === q.id);
              return (
                <Box key={q.id} sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>{q.text}</Typography>
                  {q.type === 'text' && (
                    <ListItem sx={{ bgcolor: '#fafafa', borderRadius: 2, mb: 1 }}>
                      <ListItemText primary={answer?.text || t('unanswered')} />
                    </ListItem>
                  )}
                  {(q.type === 'radio' || q.type === 'checkbox') && (
                    <ListItem sx={{ bgcolor: '#fafafa', borderRadius: 2, mb: 1 }}>
                      <ListItemText
                        primary={
                          answer?.selectedOptions && answer.selectedOptions.length > 0
                            ? answer.selectedOptions
                                .map((optId: string) => q.options.find(opt => opt.id === optId)?.text || t('unknown_option'))
                                .join(', ')
                            : t('unanswered')
                        }
                      />
                    </ListItem>
                  )}
                  <Divider sx={{ my: 1.5 }} />
                </Box>
              );
            })}
          </List>
        </Paper>
        <Button component={Link} to={`/form/${form.id}/responses`} variant="outlined" sx={{ fontWeight: 700, px: 5, borderRadius: 3, boxShadow: 3, letterSpacing: 1, minHeight: 44, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6, bgcolor: 'primary.dark', color: 'white' } }}>
          {t('back_to_results')}
        </Button>
      </Container>
    </Box>
  );
};


const TranslatedFormResponseDetail = withTranslation()(FormResponseDetail);
export default TranslatedFormResponseDetail;
