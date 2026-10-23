import React from 'react';
import { createRoot } from 'react-dom/client';
import LaporanPage from '../components/pages/LaporanPage';

const root = document.getElementById('page-root');
if (root) createRoot(root).render(<React.StrictMode><LaporanPage /></React.StrictMode>);
