import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "leaflet/dist/leaflet.css";
import { createRoot } from 'react-dom/client';
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router";
import App from './App.tsx';
import './index.css';
import { store } from './store/store.ts';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3200,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-charcoal)',
                border: '1px solid var(--color-divider)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-card)',
                fontSize: '14px',
                fontWeight: 500,
              },
              success: {
                iconTheme: { primary: '#26a541', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ff4d4f', secondary: '#fff' },
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
)
