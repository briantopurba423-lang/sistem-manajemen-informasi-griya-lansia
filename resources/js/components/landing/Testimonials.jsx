import React, { useState } from 'react';

const testimonials = [
    {
        name: 'Budi Santoso',
        role: 'Putra dari Ibu Sumiati (Penghuni)',
        initials: 'BS',
        color: 'bg-emerald-600',
        text: 'Saya sangat lega melihat ibu saya dirawat dengan sangat baik di Griya Lansia. Tim perawatnya ramah dan profesional. Sistem pelaporan digitalnya juga memudahkan saya memantau kondisi ibu dari jarak jauh.',
        rating: 5,
    },
    {
        name: 'Siti Rahayu',
        role: 'Putri dari Bapak Wiranto (Penghuni)',
        initials: 'SR',
        color: 'bg-blue-600',
        text: 'Fasilitas yang sangat lengkap dan bersih. Ayah saya sangat menikmati berbagai aktivitas yang disediakan, terutama senam pagi dan kegiatan kesenian. Kondisi beliau jauh lebih baik sejak tinggal di sini.',
        rating: 5,
    },
    {
        name: 'Ahmad Fauzi',
        role: 'Cucu dari Mbah Sarmi (Penghuni)',
        initials: 'AF',
        color: 'bg-purple-600',
        text: 'Portal keluarga yang disediakan sangat membantu. Saya bisa melihat laporan harian dan foto aktivitas nenek saya kapan saja. Terima kasih Griya Lansia sudah menjaga beliau dengan penuh kasih sayang.',
        rating: 5,
    },
    {
        name: 'Dewi Lestari',
        role: 'Keponakan dari Pak Hartono (Penghuni)',
        initials: 'DL',
        color: 'bg-rose-600',
        text: 'Pilihan terbaik yang pernah kami buat untuk om kami. Makanannya bergizi, kamarnya bersih, dan para perawatnya benar-benar peduli. Sistem manajemennya modern dan transparan.',
        rating: 5,
    },
];

function StarIcon() {
    return (
        <svg className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

export default function Testimonials() {
    const [active, setActive] = useState(0);
    const t = testimonials[active];

    return (
        <section id="testimoni" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <span className="inline-block text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
                        Testimoni
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Apa Kata Keluarga Penghuni
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg">
                        Kepercayaan keluarga adalah motivasi terbesar kami untuk terus memberikan pelayanan terbaik.
                    </p>
                </div>

                {/* Active testimonial */}
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 sm:p-10 mb-8 border border-gray-100">
                    <div className="flex gap-0.5 mb-6">
                        {Array(t.rating).fill(0).map((_, i) => <StarIcon key={i} />)}
                    </div>
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                        "{t.text}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold`}>
                            {t.initials}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{t.name}</p>
                            <p className="text-sm text-gray-400">{t.role}</p>
                        </div>
                    </div>
                </div>

                {/* Selector dots */}
                <div className="flex justify-center gap-3">
                    {testimonials.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                active === i
                                    ? 'bg-emerald-600 text-white shadow'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-emerald-300'
                            }`}
                        >
                            <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                {item.initials[0]}
                            </div>
                            {item.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
