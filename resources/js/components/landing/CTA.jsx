import React from 'react';

export default function CTA() {
    return (
        <section id="kontak" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 sm:p-16 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                                Konsultasikan Kebutuhan
                                <br />Lansia Anda Bersama Kami
                            </h2>
                            <p className="text-emerald-100/80 text-lg leading-relaxed mb-6">
                                Tim kami siap membantu Anda memilih program perawatan yang tepat. 
                                Hubungi kami sekarang untuk konsultasi gratis.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center gap-2 text-emerald-100">
                                    <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-medium">(021) 1234-5678</span>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-100">
                                    <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">info@griyalansia.id</span>
                                </div>
                            </div>
                        </div>

                        {/* Right — form */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-900 mb-5">Kirim Pesan</h3>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            placeholder="Nama Anda"
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">No. Telepon</label>
                                        <input
                                            type="tel"
                                            placeholder="08xxxxxxxx"
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="email@contoh.com"
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Pesan</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Ceritakan kebutuhan Anda..."
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
