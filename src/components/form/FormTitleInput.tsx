import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const FormTitleInput: React.FC<Props> = ({ value, onChange }) => (
  <TextField
    label="フォームタイトル"
    variant="outlined"
    fullWidth
    required
    value={value}
    onChange={e => onChange(e.target.value)}
    sx={{ mb: 2 }}
  />
);

export default FormTitleInput;
