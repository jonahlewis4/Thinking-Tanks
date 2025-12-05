import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';  // Move this BEFORE App import
import App from './App';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);