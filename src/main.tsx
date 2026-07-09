import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service worker registered successfully:', reg.scope))
      .catch((err) => console.warn('Service worker registration failed:', err));
  });
} else if ('serviceWorker' in navigator) {
  // Also register in dev mode if needed, but allow caching to be local
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service worker registered (development):', reg.scope))
      .catch((err) => console.warn('Service worker registration failed in development:', err));
  });
}

