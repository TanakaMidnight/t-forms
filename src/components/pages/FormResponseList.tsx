import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import type { FormResponse } from '../../types';


import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

interface FormResponseListProps {
  t: TFunction;
}

const FormResponseList: React.FC<FormResponseListProps> = ({ t }) => {
  const { formId } = useParams<{ formId: string }>();
  const { forms, responses } = useFormStore();

  const form = forms.find(f => f.id === formId);
  const formResponses = responses.filter((r: FormResponse) => r.formId === formId);

  if (!form) {
    return <Typography>{t('form_not_found')}</Typography>;
  }

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="md" sx={{ bgcolor: 'white', borderRadius: 4, boxShadow: 4, py: { xs: 5, md: 8 }, px: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2, textAlign: 'center' }}>
          {form.title} - {t('response_list')}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', fontSize: { xs: 16, md: 18 } }}>
          {form.description}
        </Typography>

        <Button component={Link} to={`/form/${form.id}/results`} variant="outlined" sx={{ mb: 4, fontWeight: 700, px: 5, borderRadius: 3, boxShadow: 3, letterSpacing: 1, minHeight: 44, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6, bgcolor: 'primary.dark', color: 'white' } }}>
          {t('back_to_results_summary')}
        </Button>

        {formResponses.length === 0 ? (
          <Typography sx={{ mb: 2 }}>{t('no_responses_yet')}</Typography>
        ) : (
          <Paper sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }}>
            <List>
              {formResponses.map((res, index) => (
                <React.Fragment key={res.id}>
                  <ListItem component={Link} to={`/form/${form.id}/responses/${res.id}`} sx={{ transition: 'background 0.2s', borderRadius: 2, ':hover': { bgcolor: '#f0f0f0' } }}>
                    <ListItemText primary={t('response_number', { number: index + 1 })} secondary={t('response_time') + ': ' + new Date(parseInt(res.id)).toLocaleString()} />
                  </ListItem>
                  {index < formResponses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
};


const TranslatedFormResponseList = withTranslation()(FormResponseList);
export default TranslatedFormResponseList;
