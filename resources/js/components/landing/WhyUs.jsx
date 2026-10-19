import React from 'react';

const reasons = [
    {
        icon: '🏥',
        title: 'Tim Medis Profesional',
        description: 'Didukung dokter, perawat, dan fisioterapis berpengalaman yang bertugas 24 jam memastikan kesehatan setiap penghuni.',
    },
    {
        icon: '💻',
        title: 'Sistem Digital Terintegrasi',
        description: 'Sistem manajemen informasi berbasis teknologi modern memungkinkan pemantauan real-time oleh staf maupun keluarga.',
    },
    {
        icon: '🤝',
        title: 'Pendekatan Personal',
        description: 'Setiap penghuni mendapat program perawatan yang disesuaikan dengan kondisi kesehatan dan kebutuhan personalnya.',
    },
    {
        icon: '📊',
        title: 'Laporan Transparan',
        description: 'Keluarga dapat memantau kondisi dan perkembangan penghuni melalui laporan harian yang dikirimkan secara berkala.',
    },
];

export default function WhyUs() {
    return (
        <section id="mengapa-kami" className="py-24 bg-gradient-to-br from-emerald-900 to-teal-900 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div>
                        <span className="inline-block text-emerald-300 text-sm font-semibold uppercase tracking-wider mb-3">
                            Mengapa Memilih Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                            Kepercayaan Ribuan Keluarga Sejak 2009
                        </h2>
                        <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
                            Kami bukan sekadar panti jompo biasa. Griya Lansia adalah rumah kedua bagi lansia Anda, 
                            tempat mereka dirawat dengan penuh cinta, profesionalisme, dan dukungan teknologi terkini.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#kontak"
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors text-center"
                            >
                                Hubungi Kami
                            </a>
                            <a
                                href="#layanan"
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors text-center"
                            >
                                Lihat Layanan
                            </a>
                        </div>
                    </div>

                    {/* Right — cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {reasons.map((r) => (
                            <div
                                key={r.title}
                                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors"
                            >
                                <div className="text-3xl mb-3">{r.icon}</div>
                                <h3 className="text-white font-semibold mb-2">{r.title}</h3>
                                <p className="text-emerald-100/60 text-sm leading-relaxed">{r.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
