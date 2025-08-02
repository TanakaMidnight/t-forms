import React from 'react';
import { TextField, Select, MenuItem, Button, IconButton, Box, Typography } from '@mui/material';
import RequiredSwitch from '../form/RequiredSwitch';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { Question, Option, QuestionType } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';



import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

type Props = {
  question: Question;
  onChange: (updatedQuestion: Question) => void;
  onDelete: () => void;
  t: TFunction;
};



const QuestionEditor: React.FC<Props> = ({ question, onChange, onDelete, t }) => {

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, text: e.target.value });
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    onChange({ ...question, type: e.target.value as QuestionType, options: [] });
  };

  const handleOptionChange = (optionId: string, text: string) => {
    const newOptions = question.options.map((opt: Option) => 
      opt.id === optionId ? { ...opt, text } : opt
    );
    onChange({ ...question, options: newOptions });
  };

  const addOption = () => {
    const newOption: Option = { id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), text: '' };
    onChange({ ...question, options: [...question.options, newOption] });
  };

  const deleteOption = (optionId: string) => {
    const newOptions = question.options.filter((opt: Option) => opt.id !== optionId);
    onChange({ ...question, options: newOptions });
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('question')}</Typography>
        <RequiredSwitch checked={!!question.isRequired} onChange={checked => onChange({ ...question, isRequired: checked })} />
        <IconButton onClick={onDelete}><DeleteIcon /></IconButton>
      </Box>

      {/* すべての型で設問テキスト欄（type=text, label=question, required）を表示 */}
      <TextField
        label={t('question')}
        variant="outlined"
        fullWidth
        margin="normal"
        value={question.text}
        onChange={handleTextChange}
        type="text"
        required
      />

      <Select
        value={question.type}
        onChange={handleTypeChange}
        fullWidth
      >
        <MenuItem value="text">{t('text_input')}</MenuItem>
        <MenuItem value="email">{t('email_input', { defaultValue: 'メールアドレス' })}</MenuItem>
        <MenuItem value="radio">{t('radio_button')}</MenuItem>
        <MenuItem value="checkbox">{t('checkbox')}</MenuItem>
        <MenuItem value="rating">{t('rating_input', { defaultValue: '評価（星）' })}</MenuItem>
      </Select>

      {/* メールアドレス型の重複TextFieldは削除（上のtext/email型共通欄で対応済み） */}

      {(question.type === 'radio' || question.type === 'checkbox') && (
        <Box sx={{ mt: 2 }}>
          <Typography>{t('options')}</Typography>
          {question.options.map((option: Option) => (
            <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                variant="standard"
                sx={{ flexGrow: 1 }}
              />
              <IconButton onClick={() => deleteOption(option.id)}><DeleteIcon /></IconButton>
            </Box>
          ))}
          <Button onClick={addOption} sx={{ mt: 1 }}>{t('add_option')}</Button>
        </Box>
      )}
      {/* rating型は設問名のみ。オプション欄は非表示 */}
    </Box>
  );
};


const TranslatedQuestionEditor = withTranslation()(QuestionEditor);
export default TranslatedQuestionEditor;
