import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, Container, Typography, Box } from '@mui/material';
import FormTitleInput from '../form/FormTitleInput';
import FormDescriptionInput from '../form/FormDescriptionInput';
import { useFormStore } from '../../store/formStore';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Form, Question } from '../../types';
import DraggableQuestionList from '../ui/DraggableQuestionList';


import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

interface FormCreateProps {
  t: TFunction;
}

const FormCreate: React.FC<FormCreateProps> = ({ t }) => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  const { addForm, updateForm } = useFormStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: '',
      type: 'text',
      options: [],
      isRequired: false,
    },
  ]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (formId) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) return;
        const docRef = doc(db, 'forms', formId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const formToEdit = snap.data() as Form;
          if (formToEdit.ownerUid === user.uid) {
            setTitle(formToEdit.title);
            setDescription(formToEdit.description);
            setQuestions(formToEdit.questions);
          } else {
            alert('このフォームを編集する権限がありません');
            navigate('/');
          }
        }
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [formId, navigate]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: '',
      type: 'text',
      options: [],
      isRequired: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const saveForm = () => {
    const user = auth.currentUser;
    if (!user) {
      alert('ログインが必要です');
      return;
    }
    if (!title.trim()) {
      alert('フォームのタイトルは必須です');
      return;
    }
    if (!questions || questions.length === 0) {
      alert('最低1つは質問を追加してください');
      return;
    }
    if (questions.some(q => !q.text.trim())) {
      alert('すべての質問に名前を入力してください');
      return;
    }
    const form: Form = {
      id: formId || Date.now().toString(),
      title,
      description,
      questions,
      ownerUid: user.uid,
    };
    if (formId) {
      updateForm(form);
    } else {
      addForm(form);
    }
    navigate('/');
  };

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="md" sx={{ bgcolor: 'white', borderRadius: 4, boxShadow: 4, py: { xs: 5, md: 8 }, px: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, mb: 2, textAlign: 'center' }}>
          {formId ? t('edit_form') : t('create_new_form')}
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ width: '100%' }}>
          <FormTitleInput value={title} onChange={setTitle} />
          <FormDescriptionInput value={description} onChange={setDescription} />

          <DraggableQuestionList
            questions={questions}
            onChange={setQuestions}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
          />

          <Box sx={{ display: 'flex', gap: 2.5, mt: 3, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={addQuestion} sx={{ fontWeight: 600, px: 4, borderRadius: 3, minHeight: 44 }}>
              {t('add_question')}
            </Button>
            <Button variant="contained" color="primary" onClick={saveForm} sx={{ fontWeight: 700, px: 5, borderRadius: 3, boxShadow: 3, letterSpacing: 1, minHeight: 44, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6, bgcolor: 'primary.dark' } }}>
              {t('save_form')}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};


const TranslatedFormCreate = withTranslation()(FormCreate);
export default TranslatedFormCreate;

