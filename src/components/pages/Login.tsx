
import React from 'react';
import AuthForm from '../ui/AuthForm';
import { Container, Paper, Typography, Box } from '@mui/material';

const Login: React.FC = () => {
  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 2, sm: 4 } }}>
        <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, boxShadow: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2 }}>
            ログイン
          </Typography>
          <AuthForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
