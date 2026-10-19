import React from 'react';

const services = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        color: 'bg-rose-100 text-rose-600',
        title: 'Perawatan Kesehatan',
        description: 'Pemantauan kesehatan harian, pengelolaan obat, dan rekam medis digital yang terintegrasi untuk setiap penghuni.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        color: 'bg-blue-100 text-blue-600',
        title: 'Manajemen Penghuni',
        description: 'Pencatatan data penghuni, riwayat kesehatan, informasi keluarga, dan laporan perkembangan yang mudah diakses.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        color: 'bg-amber-100 text-amber-600',
        title: 'Aktivitas & Terapi',
        description: 'Jadwal kegiatan harian, terapi fisik, senam lansia, dan aktivitas sosial untuk menjaga kebugaran jiwa dan raga.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'bg-purple-100 text-purple-600',
        title: 'Manajemen Staf',
        description: 'Pengaturan jadwal shift perawat, pembagian tugas, pemantauan kinerja, dan laporan aktivitas staf secara real-time.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        color: 'bg-teal-100 text-teal-600',
        title: 'Portal Keluarga',
        description: 'Akses informasi penghuni secara online, laporan kondisi harian, dan komunikasi langsung dengan pihak Griya Lansia.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        color: 'bg-emerald-100 text-emerald-600',
        title: 'Laporan & Analitik',
        description: 'Dashboard laporan komprehensif, statistik kesehatan, pengeluaran, dan analitik untuk pengambilan keputusan manajemen.',
    },
];

export default function Services() {
    return (
        <section id="layanan" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
                        Layanan Kami
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Sistem Manajemen Terpadu
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg">
                        Semua kebutuhan manajemen panti jompo dalam satu platform digital yang mudah digunakan.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                        >
                            <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-5`}>
                                {service.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {service.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
