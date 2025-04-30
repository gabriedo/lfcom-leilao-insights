import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { handleApiRequest } from './api';

// Configurar o handler da API
if (import.meta.env.DEV) {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : input.toString();
    
    // Log da requisição
    console.log('Interceptando requisição:', {
      url,
      method: init?.method || 'GET',
      headers: init?.headers
    });

    if (url.includes('/api/extraction-callback')) {
      console.log('Requisição para extraction-callback detectada:', url);
      const request = new Request(input, init);
      return handleApiRequest(request);
    }

    // Se não for uma requisição para API, usa o fetch original
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
