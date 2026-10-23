
import React from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Login.jsx';

const rootElement = document.getElementById('landing-root');

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <Login />
        </React.StrictMode>
    );
}
