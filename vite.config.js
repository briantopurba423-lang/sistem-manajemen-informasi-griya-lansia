import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        laravel({
            input: [
                // CSS
                'resources/css/app.css',

                // Auth
                'resources/js/auth/login.jsx',

                // Landing
                'resources/js/landing.jsx',

                // Dashboard Admin
                'resources/js/dashboard.jsx',

                // Halaman Admin (Data Lansia, Pegawai, Kamar, dst)
                'resources/js/pages/lansia.jsx',
                'resources/js/pages/pegawai.jsx',
                'resources/js/pages/kamar.jsx',
                'resources/js/pages/kesehatan.jsx',
                'resources/js/pages/kegiatan.jsx',
                'resources/js/pages/laporan.jsx',

                // Dashboard Keluarga
                'resources/js/keluarga/dashboard.jsx',

                // Dashboard Perawat
                'resources/js/perawat.jsx',
            ],
            refresh: true,
        }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
