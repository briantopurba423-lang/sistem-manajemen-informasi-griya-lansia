import React from 'react';
import { createRoot } from 'react-dom/client';
import PegawaiPage from '../components/pages/PegawaiPage';

const root = document.getElementById('page-root');
if (root) createRoot(root).render(<React.StrictMode><PegawaiPage /></React.StrictMode>);
