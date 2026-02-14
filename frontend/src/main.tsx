import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App.tsx';
import theme from './theme';
import { AuthProvider } from '@/contexts/AuthContext';

console.log('[DEBUG] main.tsx loaded');
console.log('[DEBUG] VITE_API_URL:', import.meta.env.VITE_API_URL);

try {
  const rootElement = document.getElementById('root');
  console.log('[DEBUG] Root element:', rootElement);

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  console.log('[DEBUG] React root created');

  root.render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );

  console.log('[DEBUG] App rendered successfully');
} catch (error) {
  console.error('[ERROR] Failed to initialize app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">Application Error</h1>
      <p>Failed to initialize the application. Please check the console for details.</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error}</pre>
    </div>
  `;
}
