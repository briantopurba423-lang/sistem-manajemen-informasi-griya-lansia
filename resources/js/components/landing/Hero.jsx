import React from 'react';

export default function Hero() {
    return (
        <section
            id="beranda"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            {/* Decorative circles */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Sistem Informasi Manajemen Terintegrasi
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                    Merawat Lansia dengan{' '}
                    <span className="text-emerald-300">Penuh Kasih</span>
                    <br />& Teknologi Modern
                </h1>

                <p className="text-lg sm:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Griya Lansia hadir sebagai solusi panti jompo modern yang menggabungkan
                    perawatan profesional dengan sistem informasi terpadu untuk menjamin
                    kesejahteraan lansia Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="#layanan"
                        className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                    >
                        Lihat Layanan Kami
                    </a>
                    <a
                        href="/login"
                        className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
                    >
                        Masuk ke Sistem →
                    </a>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
                    <span className="text-xs">Scroll</span>
                    <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
                        <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
}
