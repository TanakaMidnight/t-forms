
import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, IconButton, Tooltip } from '@mui/material';
import type { ReactElement } from 'react';
import { auth } from './firebase';


const Login = lazy(() => import('./components/pages/Login'));

// ログインしていない場合は/loginにリダイレクトするラッパー
function PrivateRoute({ children }: { children: ReactElement }) {
  const [user, setUser] = useState<typeof auth.currentUser>(auth.currentUser);
  const location = useLocation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: typeof auth.currentUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);
  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Home = lazy(() => import('./components/pages/Home'));
const FormCreate = lazy(() => import('./components/pages/FormCreate'));
const FormRespond = lazy(() => import('./components/pages/FormRespond'));
const FormResult = lazy(() => import('./components/pages/FormResult'));
const FormResponseDetail = lazy(() => import('./components/pages/FormResponseDetail'));

const ThankYouPage = lazy(() => import('./components/pages/ThankYouPage'));
const FormResponseList = lazy(() => import('./components/pages/FormResponseList'));
const PasswordReset = lazy(() => import('./components/pages/PasswordReset'));
const MyPage = lazy(() => import('./components/pages/MyPage'));
const PasswordChange = lazy(() => import('./components/pages/PasswordChange'));


import { withTranslation } from 'react-i18next';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 青系
    },
    secondary: {
      main: '#ffc107',
    },
  },
});


import type { TFunction, i18n as I18nType } from 'i18next';

interface AppProps {
  t: TFunction;
  i18n: I18nType;
}




function App({ t }: AppProps) {
  const [user, setUser] = useState<typeof auth.currentUser>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: typeof auth.currentUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>{t('app_title')}</Link>
            </Typography>
            {user && (
              <Tooltip title="マイページ">
                <IconButton color="inherit" component={Link} to="/mypage">
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
            )}

          </Toolbar>
        </AppBar>
        <Container maxWidth={false} disableGutters sx={{ mt: 4 }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/create" element={<PrivateRoute><FormCreate /></PrivateRoute>} />
              <Route path="/edit/:formId" element={<PrivateRoute><FormCreate /></PrivateRoute>} />
              <Route path="/form/:formId" element={<FormRespond />} />
              <Route path="/form/:formId/results" element={<PrivateRoute><FormResult /></PrivateRoute>} />
              <Route path="/form/:formId/responses/:responseId" element={<PrivateRoute><FormResponseDetail /></PrivateRoute>} />
              <Route path="/form/:formId/responses" element={<PrivateRoute><FormResponseList /></PrivateRoute>} />
              <Route path="/thank-you" element={<PrivateRoute><ThankYouPage /></PrivateRoute>} />
              <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
              <Route path="/password-change" element={<PrivateRoute><PasswordChange /></PrivateRoute>} />
            </Routes>
          </Suspense>
        </Container>
      </Router>
    </ThemeProvider>
  );
}



const TranslatedApp = withTranslation()(App);
export default TranslatedApp;

