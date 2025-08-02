
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleLoginButton from '../auth/GoogleLoginButton';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // user状態はHome.tsxで一元管理するため、ここではauth.currentUserのみ参照

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  // useEffect不要: user状態はHome.tsxで管理

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };




  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>{isLogin ? 'ログイン' : '新規登録'}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="メールアドレス"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {isLogin ? 'ログイン' : '新規登録'}
        </Button>
        {isLogin && (
          <Button component={Link} to="/reset-password" color="secondary" fullWidth sx={{ mt: 1 }}>
            パスワードを忘れた方はこちら
          </Button>
        )}
      </Box>
      <GoogleLoginButton onClick={handleGoogleLogin} />
      <Button color="secondary" onClick={() => setIsLogin(v => !v)} sx={{ mt: 2 }}>
        {isLogin ? 'アカウント作成はこちら' : 'ログインはこちら'}
      </Button>
    </Paper>
  );
};

export default AuthForm;
