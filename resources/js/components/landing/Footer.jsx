import React from 'react';

const links = {
    'Layanan': ['Perawatan Kesehatan', 'Manajemen Penghuni', 'Aktivitas & Terapi', 'Portal Keluarga', 'Laporan Analitik'],
    'Informasi': ['Tentang Kami', 'Fasilitas', 'Program Perawatan', 'Jadwal Kunjungan', 'FAQ'],
    'Kontak': ['(021) 1234-5678', 'info@griyalansia.id', 'Jl. Damai No. 10,', 'Jakarta Selatan 12345', 'Senin–Minggu 08.00–17.00'],
};

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-none">Griya Lansia</p>
                                <p className="text-emerald-400 text-xs mt-0.5">Panti Jompo Terpadu</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-5">
                            Memberikan perawatan terbaik untuk lansia tercinta Anda dengan dukungan teknologi modern dan tenaga profesional berpengalaman.
                        </p>
                        <div className="flex gap-3">
                            {['facebook', 'instagram', 'whatsapp'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    aria-label={social}
                                    className="w-9 h-9 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <span className="text-xs capitalize">{social[0].toUpperCase()}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([heading, items]) => (
                        <div key={heading}>
                            <h4 className="font-semibold text-white mb-4">{heading}</h4>
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Griya Lansia. Semua hak dilindungi.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-300 transition-colors">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Syarat & Ketentuan</a>
                        <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            Login Sistem →
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
