import React, { useState } from 'react';
import { auth } from '../../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Box, Button, TextField, Typography, Paper, Alert, Container } from '@mui/material';

const PasswordChange: React.FC = () => {
  const user = auth.currentUser;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user || !user.email) {
      setError('ユーザー情報が取得できません');
      return;
    }
    if (!currentPassword || !newPassword) {
      setError('現在のパスワードと新しいパスワードを入力してください');
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user as User, credential);
      await updatePassword(user, newPassword);
      setSuccess('パスワードを変更しました');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  if (!user) {
    return (
      <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f6fa' }}>
        <Typography variant="h6" color="text.secondary">ログインしてください</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 2, sm: 4 } }}>
        <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, boxShadow: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2 }}>
            パスワード変更
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handlePasswordChange}>
            <TextField
              label="現在のパスワード"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="新しいパスワード"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              パスワードを変更
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PasswordChange;
