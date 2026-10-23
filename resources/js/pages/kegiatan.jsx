import React from 'react';
import { createRoot } from 'react-dom/client';
import KegiatanPage from '../components/pages/KegiatanPage';

const root = document.getElementById('page-root');
if (root) createRoot(root).render(<React.StrictMode><KegiatanPage /></React.StrictMode>);
