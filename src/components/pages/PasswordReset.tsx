import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
// ...existing code up to the first export default PasswordReset;

// 2回目以降の重複import・重複コンポーネント・重複exportをすべて削除
import { auth } from '../../firebase';
import { Box, Button, TextField, Typography, Paper, Alert, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    if (!email) {
      setError('パスワードリセットにはメールアドレスを入力してください');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('パスワードリセット用のメールを送信しました');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: { xs: 2, sm: 4 } }}>
        <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, boxShadow: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2 }}>
            パスワードリセット
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {resetMessage && <Alert severity="success" sx={{ mb: 2 }}>{resetMessage}</Alert>}
          <Box component="form" onSubmit={handlePasswordReset}>
            <TextField
              label="メールアドレス"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              パスワードリセットメールを送信
            </Button>
          </Box>
          <Button component={Link} to="/" color="secondary" fullWidth sx={{ mt: 2 }}>
            ログイン画面に戻る
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default PasswordReset;
