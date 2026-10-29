import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from '../components/auth/LoginPage.jsx';

const root = document.getElementById('login-root');
if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <LoginPage />
        </React.StrictMode>
    );
}
