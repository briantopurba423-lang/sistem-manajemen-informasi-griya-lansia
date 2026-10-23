import React from 'react';
import { createRoot } from 'react-dom/client';
import KamarPage from '../components/pages/KamarPage';

const root = document.getElementById('page-root');
if (root) createRoot(root).render(<React.StrictMode><KamarPage /></React.StrictMode>);
