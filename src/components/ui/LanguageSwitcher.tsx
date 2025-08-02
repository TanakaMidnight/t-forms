import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language || 'ja');

  const handleChange = (event: SelectChangeEvent<string>) => {
    const lng = event.target.value as string;
    setLang(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 120, my: 2 }}>
      <InputLabel id="language-select-label">言語</InputLabel>
      <Select
        labelId="language-select-label"
        value={lang}
        onChange={handleChange}
        label="言語"
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>{lang.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
