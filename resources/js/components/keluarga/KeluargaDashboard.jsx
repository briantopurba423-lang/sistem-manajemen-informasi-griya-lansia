import React, { useState, useEffect } from 'react';
import KSidebar from './KSidebar';
import KTopbar from './KTopbar';
import BerandaPage from './BerandaPage';
import ProfilPage from './ProfilPage';
import KesehatanPage from './KesehatanPage';
import KegiatanPage from './KegiatanPage';
import LayananPage from './LayananPage';
import LaporanPage from './LaporanPage';
import { api } from '../../lib/api';

const pageTitles = {
    beranda:  { title: 'Beranda',             subtitle: 'Ringkasan informasi orang terkasih Anda' },
    profil:   { title: 'Profil Lansia',       subtitle: 'Data lengkap penghuni Griya Lansia' },
    kesehatan:{ title: 'Riwayat Kesehatan',   subtitle: 'Rekam medis dan pemeriksaan kesehatan' },
    kegiatan: { title: 'Jadwal Kegiatan',     subtitle: 'Kegiatan harian dan bulanan' },
    layanan:  { title: 'Layanan',             subtitle: 'Layanan yang tersedia di Griya Lansia' },
    laporan:  { title: 'Laporan',             subtitle: 'Laporan perkembangan lansia' },
};

export default function KeluargaDashboard() {
    const [activePage, setActivePage] = useState('beranda');
    const [user, setUser]             = useState(null);
    const [homeData, setHomeData]     = useState(null);
    const [profilData, setProfilData] = useState(null);
    const [homeError, setHomeError]   = useState(false);

    // Load current user
    useEffect(() => {
        fetch('/me', { headers: { Accept: 'application/json' } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.user) setUser(d.user); })
            .catch(() => {});
    }, []);

    // Load home data on mount
    useEffect(() => {
        api.get('/api/keluarga/home')
            .then(d => setHomeData(d))
            .catch(() => setHomeError(true));
    }, []);

    // Load profile when navigating to profil
    useEffect(() => {
        if (activePage === 'profil' && !profilData) {
            api.get('/api/keluarga/profile')
                .then(d => setProfilData(d))
                .catch(() => {});
        }
    }, [activePage]);

    const { title, subtitle } = pageTitles[activePage] ?? pageTitles.beranda;

    function renderPage() {
        switch (activePage) {
            case 'beranda':
                return homeError
                    ? (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                            <span className="text-3xl">⚠️</span>
                            <p className="mt-2 text-red-700 font-medium">Akun belum terhubung ke data lansia.</p>
                            <p className="text-sm text-red-500 mt-1">Hubungi administrator untuk menghubungkan akun Anda.</p>
                        </div>
                    )
                    : <BerandaPage data={homeData} onNavigate={setActivePage} />;
            case 'profil':
                return <ProfilPage data={profilData} />;
            case 'kesehatan':
                return <KesehatanPage />;
            case 'kegiatan':
                return <KegiatanPage />;
            case 'layanan':
                return <LayananPage />;
            case 'laporan':
                return <LaporanPage />;
            default:
                return null;
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <KSidebar active={activePage} onNavigate={setActivePage} />

            <div className="flex-1 flex flex-col min-w-0">
                <KTopbar user={user} />

                <main className="flex-1 p-6 overflow-auto">
                    {/* Page header — only shown on non-beranda pages */}
                    {activePage !== 'beranda' && (
                        <div className="mb-5">
                            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                        </div>
                    )}

                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
