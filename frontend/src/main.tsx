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
          <Toaster />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
)
