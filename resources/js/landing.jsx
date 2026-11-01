import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LandingPage from './components/LandingPage';

const rootElement = document.getElementById('landing-root');

if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <LandingPage />
        </StrictMode>
    );
}
