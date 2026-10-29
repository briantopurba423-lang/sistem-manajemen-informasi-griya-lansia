import React from 'react';

const services = [
    {
        name: 'Layanan Makan',
        icon: '🍽️',
        description: 'Tiga kali makan sehari dengan menu bergizi dan seimbang sesuai kebutuhan lansia.',
        schedule: 'Pagi 07:00 · Siang 12:00 · Malam 18:00',
        status: 'Tersedia',
        color: 'red',
    },
    {
        name: 'Layanan Kamar',
        icon: '🛏️',
        description: 'Kebersihan kamar, penggantian linen, dan kenyamanan tempat tinggal dijaga setiap hari.',
        schedule: 'Setiap hari 08:00 - 10:00',
        status: 'Tersedia',
        color: 'blue',
    },
    {
        name: 'Layanan Kesehatan',
        icon: '💊',
        description: 'Pemeriksaan kesehatan rutin, pemberian obat, dan pemantauan kondisi medis.',
        schedule: 'Senin & Kamis 09:00 - 11:00',
        status: 'Tersedia',
        color: 'green',
    },
    {
        name: 'Pendampingan',
        icon: '👥',
        description: 'Pendampingan personal oleh perawat terlatih untuk aktivitas sehari-hari.',
        schedule: '24 Jam setiap hari',
        status: 'Tersedia',
        color: 'purple',
    },
    {
        name: 'Kegiatan Sosial',
        icon: '🎉',
        description: 'Kegiatan sosial, rekreasi, dan hiburan untuk menjaga kesehatan mental dan sosial.',
        schedule: 'Sesuai jadwal bulanan',
        status: 'Tersedia',
        color: 'yellow',
    },
    {
        name: 'Layanan Kerohanian',
        icon: '🕌',
        description: 'Bimbingan rohani, pengajian, dan kegiatan keagamaan sesuai kepercayaan masing-masing.',
        schedule: 'Minggu 08:00 - 09:00',
        status: 'Tersedia',
        color: 'orange',
    },
];

const colorMap = {
    red:    { badge: 'bg-red-100 text-red-700',     card: 'border-red-100',     icon: 'bg-red-50' },
    blue:   { badge: 'bg-blue-100 text-blue-700',   card: 'border-blue-100',    icon: 'bg-blue-50' },
    green:  { badge: 'bg-green-100 text-green-700', card: 'border-green-100',   icon: 'bg-green-50' },
    purple: { badge: 'bg-purple-100 text-purple-700',card: 'border-purple-100', icon: 'bg-purple-50' },
    yellow: { badge: 'bg-yellow-100 text-yellow-700',card: 'border-yellow-100', icon: 'bg-yellow-50' },
    orange: { badge: 'bg-orange-100 text-orange-700',card: 'border-orange-100', icon: 'bg-orange-50' },
};

export default function LayananPage() {
    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">ℹ️</span>
                <p className="text-sm text-blue-800">
                    Semua layanan di bawah ini tersedia untuk orang terkasih Anda di Griya Lansia.
                    Hubungi kami jika ada pertanyaan mengenai layanan yang diterima.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(svc => {
                    const c = colorMap[svc.color] ?? colorMap.blue;
                    return (
                        <div key={svc.name} className={`bg-white rounded-2xl border ${c.card} shadow-sm p-5`}>
                            <div className="flex items-start gap-3 mb-3">
                                <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center text-2xl flex-shrink-0`}>
                                    {svc.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{svc.name}</h3>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${c.badge}`}>
                                        {svc.status}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{svc.description}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {svc.schedule}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
