import React, { Suspense } from 'react'  
import ReactDOM from 'react-dom/client'  
import i18n from './i18n'; // i18nインスタンスをインポート
import { I18nextProvider } from 'react-i18next'; // I18nextProviderをインポート
import App from './App'
import './index.css'  
  
ReactDOM.createRoot(document.getElementById('root')!).render(  
  <React.StrictMode>  
    <Suspense fallback={<div>Loading...</div>}>  
      <I18nextProvider i18n={i18n}>  
        <App />  
      </I18nextProvider>  
    </Suspense>  
  </React.StrictMode>,  
) 
 
