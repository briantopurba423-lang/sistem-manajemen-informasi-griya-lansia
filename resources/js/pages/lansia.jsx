import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LansiaPage from '../components/pages/LansiaPage';

const root = document.getElementById('page-root');
if (root) createRoot(root).render(<StrictMode><LansiaPage /></StrictMode>);
