import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

interface Props {
  onClick: () => void;
}

const GoogleLoginButton: React.FC<Props> = ({ onClick }) => (
  <Button variant="outlined" startIcon={<GoogleIcon />} onClick={onClick} fullWidth sx={{ mb: 2 }}>
    Googleでログイン
  </Button>
);

export default GoogleLoginButton;
