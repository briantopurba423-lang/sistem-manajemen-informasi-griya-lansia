import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import KeluargaDashboard from '../components/keluarga/KeluargaDashboard';

const root = document.getElementById('keluarga-root');
if (root) {
    createRoot(root).render(
        <StrictMode>
            <KeluargaDashboard />
        </StrictMode>
    );
}
