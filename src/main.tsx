import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import '@radix-ui/themes/styles.css';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID as string;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <HelmetProvider>
        <App />
        <Toaster position="top-center" />
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
