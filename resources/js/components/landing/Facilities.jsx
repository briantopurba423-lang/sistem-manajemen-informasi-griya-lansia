import React, { useState } from 'react';

const facilities = [
    {
        emoji: '🛏️',
        title: 'Kamar Nyaman',
        description: 'Kamar bersih dan nyaman dengan ventilasi baik, AC, dan perlengkapan tidur berkualitas untuk kenyamanan penghuni.',
    },
    {
        emoji: '🏋️',
        title: 'Ruang Terapi Fisik',
        description: 'Dilengkapi alat terapi fisik modern untuk membantu pemulihan dan menjaga mobilitas lansia.',
    },
    {
        emoji: '🌿',
        title: 'Taman & Area Hijau',
        description: 'Taman luas dengan tanaman hijau yang asri sebagai tempat bersantai dan beraktivitas di udara segar.',
    },
    {
        emoji: '🍽️',
        title: 'Dapur & Ruang Makan',
        description: 'Dapur higienis dengan menu gizi seimbang yang disesuaikan dengan kondisi kesehatan setiap penghuni.',
    },
    {
        emoji: '📺',
        title: 'Ruang Serbaguna',
        description: 'Ruang aktivitas bersama untuk nonton TV, bermain, kegiatan kesenian, dan pertemuan dengan keluarga.',
    },
    {
        emoji: '🚑',
        title: 'Klinik Mini & Apotek',
        description: 'Fasilitas kesehatan onsite dengan tenaga medis siap 24 jam dan stok obat-obatan yang lengkap.',
    },
    {
        emoji: '📹',
        title: 'CCTV 24 Jam',
        description: 'Sistem keamanan CCTV di seluruh area untuk memantau keamanan dan keselamatan penghuni setiap saat.',
    },
    {
        emoji: '🚌',
        title: 'Transportasi',
        description: 'Kendaraan khusus untuk antar-jemput kunjungan medis, kegiatan luar, dan keperluan penghuni lainnya.',
    },
];

export default function Facilities() {
    const [hovered, setHovered] = useState(null);

    return (
        <section id="fasilitas" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <span className="inline-block text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
                        Fasilitas Kami
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Fasilitas Lengkap & Modern
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg">
                        Kami menyediakan fasilitas terlengkap untuk mendukung kenyamanan, kesehatan, dan kebahagiaan penghuni.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {facilities.map((item, i) => (
                        <div
                            key={item.title}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            className={`relative rounded-2xl p-5 border cursor-default transition-all duration-200 ${
                                hovered === i
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 -translate-y-1'
                                    : 'bg-white border-gray-100 hover:border-emerald-200'
                            }`}
                        >
                            <div className="text-3xl mb-3">{item.emoji}</div>
                            <h3 className={`font-semibold text-sm mb-1 ${hovered === i ? 'text-white' : 'text-gray-800'}`}>
                                {item.title}
                            </h3>
                            <p className={`text-xs leading-relaxed ${hovered === i ? 'text-emerald-100' : 'text-gray-400'}`}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
