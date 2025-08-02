

import LanguageSwitcher from '../ui/LanguageSwitcher';
import React from 'react';
import { auth } from '../../firebase';
import { Button, Typography, Paper, Container, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const MyPage: React.FC = () => {
  const { t } = useTranslation();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f6fa' }}>
        <Typography variant="h6" color="text.secondary">{t('please_login')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 2, sm: 4 } }}>
        <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, boxShadow: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2 }}>
            {t('mypage_title')}
          </Typography>
          <List sx={{ mb: 2 }}>
            <ListItem disablePadding>
              <ListItemText primary={<Typography color="text.secondary" fontWeight={500}>{t('logged_in_as', { email: user.email })}</Typography>} />
            </ListItem>
          </List>
          <LanguageSwitcher />
          <Button component={Link} to="/password-change" variant="outlined" color="primary" fullWidth size="large" sx={{ mt: 3, borderRadius: 3, fontWeight: 700, boxShadow: 2, letterSpacing: 1, minHeight: 44, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 4 } }}>
            {t('change_password')}
          </Button>
          <Button onClick={handleLogout} color="secondary" fullWidth size="large" sx={{ mt: 2, borderRadius: 3, fontWeight: 700, boxShadow: 2, letterSpacing: 1, minHeight: 44, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 4 } }}>
            {t('logout')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyPage;
