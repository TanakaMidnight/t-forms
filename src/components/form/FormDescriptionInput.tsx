import React from 'react';
import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const FormDescriptionInput: React.FC<Props> = ({ value, onChange }) => (
  <TextField
    label="フォーム説明"
    variant="outlined"
    fullWidth
    multiline
    minRows={2}
    value={value}
    onChange={e => onChange(e.target.value)}
    sx={{ mb: 2 }}
  />
);

export default FormDescriptionInput;
