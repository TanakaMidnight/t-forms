import React from 'react';
import AuthForm from '../ui/AuthForm';
import { Box, Typography, List, Card, CardContent, ListItemText, Button, Container, Paper } from '@mui/material';
import QRCodeDialog from '../ui/QRCodeDialog';
import { Link, useLocation } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { auth } from '../../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const forms = useFormStore((state) => state.forms);
  const fetchForms = useFormStore((state) => state.fetchForms);
  const deleteForm = useFormStore((state) => state.deleteForm);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const [qrOpen, setQROpen] = useState(false);
  const [qrUrl, setQRUrl] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchForms(firebaseUser.uid);
      }
    });
    return () => unsubscribe();
  }, [fetchForms, location.pathname]);
  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: { xs: 6, md: 8 }, bgcolor: '#f5f6fa' }}>
      <Container maxWidth="md" sx={{ bgcolor: 'white', borderRadius: 4, boxShadow: 4, py: { xs: 5, md: 8 }, px: { xs: 2, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" fontWeight={700} color="primary.main" gutterBottom sx={{ letterSpacing: 1, textAlign: 'center', mb: 2 }}>
          {t('welcome_title')}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 5, color: 'text.secondary', textAlign: 'center', fontSize: { xs: 16, md: 18 } }}>
          {t('welcome_message')}
        </Typography>
        {!user && <AuthForm />}
        {user && (
          <Button component={Link} to="/create" variant="contained" color="primary" sx={{ mb: 4, fontWeight: 700, borderRadius: 3, alignSelf: 'center', px: 5, py: 1.5, boxShadow: 3, letterSpacing: 1, minHeight: 48, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6, bgcolor: 'primary.dark' } }}>
            {t('create_form')}
          </Button>
        )}
        <Paper sx={{ width: '100%', mt: 2, p: { xs: 2.5, sm: 4 }, borderRadius: 4, boxShadow: 3, bgcolor: '#f8fafc' }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'primary.main', textAlign: 'center', letterSpacing: 1 }}>
            {t('created_forms')}
          </Typography>
          {forms.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>{t('no_forms_yet')}</Typography>
          ) : (
            <List>
              {forms.map(form => (
                <Card key={form.id} sx={{ mb: 2.5, borderRadius: 4, boxShadow: 2, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <ListItemText 
                      primary={<Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>{form.title}</Typography>} 
                      secondary={<Typography variant="body2" color="text.secondary">{form.description}</Typography>} 
                    />
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                      <Button component={Link} to={`/form/${form.id}`} variant="outlined" sx={{ fontWeight: 600, borderRadius: 3, px: 3, minHeight: 40 }}>
                        {t('answer')}
                      </Button>
                      {user && form.ownerUid === user.uid && (
                        <>
                          <Button component={Link} to={`/edit/${form.id}`} variant="contained" color="primary" sx={{ fontWeight: 600, borderRadius: 3, px: 3, minHeight: 40 }}>
                            {t('edit')}
                          </Button>
                          <Button component={Link} to={`/form/${form.id}/results`} variant="outlined" color="secondary" sx={{ fontWeight: 600, borderRadius: 3, px: 3, minHeight: 40 }}>
                            {t('view_results')}
                          </Button>
                          <Button
                            variant="outlined"
                            color="info"
                            sx={{ fontWeight: 600, borderRadius: 3, px: 3, minHeight: 40 }}
                            onClick={() => {
                              setQRUrl(`${window.location.origin}/form/${form.id}`);
                              setQROpen(true);
                            }}
                          >
                            QRコード
                          </Button>
                          <Button variant="outlined" color="error" sx={{ fontWeight: 600, borderRadius: 2 }}
                            onClick={async () => {
                              if (window.confirm('本当に削除しますか？')) {
                                await deleteForm(form.id);
                                if (user) fetchForms(user.uid);
                              }
                            }}
                          >
                            削除
                          </Button>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    <QRCodeDialog open={qrOpen} url={qrUrl} onClose={() => setQROpen(false)} />
  </Box>
  );
};

export default Home;
