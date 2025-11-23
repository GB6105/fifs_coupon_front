// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css'; 

// index.html의 <div id="app-root">에 React 앱을 렌더링합니다.
ReactDOM.createRoot(document.getElementById('app-root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);