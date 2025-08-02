import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const RequiredSwitch: React.FC<Props> = ({ checked, onChange }) => (
  <FormControlLabel
    control={<Switch checked={checked} onChange={e => onChange(e.target.checked)} color="primary" />}
    label="必須"
  />
);

export default RequiredSwitch;
