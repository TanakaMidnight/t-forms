import React from 'react';
import { Typography, Box, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';


import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

interface ThankYouPageProps {
  t: TFunction;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ t }) => {
  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 2, sm: 4 } }}>
        <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, boxShadow: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h3" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2 }}>
            {t('thank_you_for_your_response')}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', fontSize: { xs: 16, md: 18 } }}>
            {t('your_response_has_been_recorded')}
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary" size="large" sx={{ fontWeight: 700, px: 5, borderRadius: 3, boxShadow: 3, letterSpacing: 1, minHeight: 44, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6, bgcolor: 'primary.dark' } }}>
            {t('back_to_home')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};


const TranslatedThankYouPage = withTranslation()(ThankYouPage);
export default TranslatedThankYouPage;
