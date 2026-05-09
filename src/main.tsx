import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
    <Toaster
      position="bottom-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: { primary: '#34d399', secondary: '#1e293b' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#1e293b' },
        },
      }}
    />
  </React.StrictMode>
);
