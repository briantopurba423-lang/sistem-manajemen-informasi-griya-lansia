import React from 'react';
import { createRoot } from 'react-dom/client';
import KesehatanPage from '../components/pages/KesehatanPage';

const root = document.getElementById('page-root');
if (root) createRoot(root).render(<React.StrictMode><KesehatanPage /></React.StrictMode>);
