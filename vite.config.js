import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/auth/login.jsx',
                'resources/js/landing.jsx',
                'resources/js/dashboard.jsx',
                'resources/js/pages/lansia.jsx',
                'resources/js/pages/pegawai.jsx',
                'resources/js/pages/kamar.jsx',
                'resources/js/pages/kesehatan.jsx',
                'resources/js/pages/kegiatan.jsx',
                'resources/js/pages/laporan.jsx',
                'resources/js/keluarga/dashboard.jsx',
                'resources/js/perawat.jsx',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});