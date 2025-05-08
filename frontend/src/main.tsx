import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

console.log('main.tsx iniciado');

const root = document.getElementById('root')!
console.log('Elemento root encontrado:', root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 