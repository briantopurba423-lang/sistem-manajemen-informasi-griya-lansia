import React from 'react';

const categoryColors = {
    fisik:   { bg: 'bg-blue-500',   text: 'Fisik' },
    sosial:  { bg: 'bg-green-500',  text: 'Sosial' },
    rohani:  { bg: 'bg-purple-500', text: 'Rohani' },
    edukasi: { bg: 'bg-yellow-500', text: 'Edukasi' },
    lainnya: { bg: 'bg-gray-500',   text: 'Lainnya' },
};

const serviceIcons = {
    'Layanan Makan': { icon: '🍽️', color: 'bg-red-50 border-red-100', dot: 'bg-red-500' },
    'Layanan Kamar': { icon: '🛏️', color: 'bg-blue-50 border-blue-100', dot: 'bg-blue-500' },
    'Layanan Kesehatan': { icon: '💊', color: 'bg-orange-50 border-orange-100', dot: 'bg-orange-500' },
    'Pendampingan': { icon: '👥', color: 'bg-purple-50 border-purple-100', dot: 'bg-purple-500' },
};

function VitalCard({ value, unit, label, color }) {
    const colors = {
        red:    { text: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-100' },
        blue:   { text: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-100' },
        green:  { text: 'text-green-500',  bg: 'bg-green-50',  border: 'border-green-100' },
        purple: { text: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
    };
    const c = colors[color] ?? colors.blue;

    return (
        <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${c.bg} ${c.border}`}>
            <span className={`text-xl font-bold leading-none ${c.text}`}>{value || '-'}</span>
            <span className={`text-xs mt-0.5 ${c.text}`}>{unit}</span>
            <span className="text-xs text-gray-500 mt-1 text-center leading-tight">{label}</span>
        </div>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatActivityDate(dateStr) {
    if (!dateStr) return { day: '-', month: '' };
    const d = new Date(dateStr);
    return {
        day:   d.getDate(),
        month: d.toLocaleDateString('id-ID', { month: 'short' }),
    };
}

export default function BerandaPage({ data, onNavigate }) {
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3 text-gray-400">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memuat data...
                </div>
            </div>
        );
    }

    const { resident, latest_health, upcoming_activities, announcements, services } = data;
    const h = latest_health;

    return (
        <div className="space-y-5">
            {/* Greeting */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">👋</span>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Halo, Keluarga</h1>
                        <p className="text-sm text-gray-500">Berikut ringkasan informasi tentang orang tercinta Anda di Griya Lansia.</p>
                    </div>
                </div>
            </div>

            {/* Resident profile card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">{resident?.name ?? '-'}</h2>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
                            {[
                                { icon: '👤', label: 'Usia', value: resident?.age ? `${resident.age} tahun` : '-' },
                                { icon: '🛏️', label: 'Kamar', value: resident?.room ?? '-' },
                                { icon: '✅', label: 'Status', value: null, badge: resident?.status },
                                { icon: '👩‍⚕️', label: 'Pengasuh', value: resident?.family_name ?? '-' },
                            ].map(({ icon, label, value, badge }) => (
                                <div key={label} className="flex items-center gap-2 text-gray-600">
                                    <span className="w-5 text-base">{icon}</span>
                                    <span className="text-gray-400 w-16">{label}</span>
                                    <span>:</span>
                                    {badge ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            {badge === 'aktif' ? 'Aktif' : badge}
                                        </span>
                                    ) : (
                                        <span className="font-medium text-gray-700">{value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => onNavigate('profil')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Lihat Profil Lengkap
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Kondisi Kesehatan Terbaru */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">❤️</span>
                            <h3 className="font-semibold text-gray-800">Kondisi Kesehatan Terbaru</h3>
                        </div>
                        <button onClick={() => onNavigate('kesehatan')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            Lihat Riwayat
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {h ? (
                        <>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                <VitalCard
                                    value={h.blood_pressure_systolic && h.blood_pressure_diastolic
                                        ? `${h.blood_pressure_systolic}/${h.blood_pressure_diastolic}` : null}
                                    unit="mmHg" label="Tekanan Darah" color="red" />
                                <VitalCard value={h.blood_sugar} unit="mg/dL" label="Gula Darah" color="blue" />
                                <VitalCard value={h.temperature} unit="°C" label="Suhu Tubuh" color="green" />
                                <VitalCard value={h.weight} unit="kg" label="Berat Badan" color="purple" />
                            </div>
                            {h.notes && (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                                    <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div className="min-w-0">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-medium text-gray-700">Catatan Terbaru</span>
                                            <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(h.check_date)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-0.5">{h.notes}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-6">Belum ada rekam kesehatan.</p>
                    )}
                </div>

                {/* Kegiatan Terdekat */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📅</span>
                            <h3 className="font-semibold text-gray-800">Kegiatan Terdekat</h3>
                        </div>
                        <button onClick={() => onNavigate('kegiatan')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            Lihat Semua
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {upcoming_activities?.length > 0 ? (
                        <div className="space-y-2">
                            {upcoming_activities.map((a) => {
                                const { day, month } = formatActivityDate(a.activity_date);
                                const cc = categoryColors[a.category] ?? categoryColors.lainnya;
                                return (
                                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100">
                                        <div className={`w-10 h-10 rounded-xl ${cc.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                                            <span className="text-white font-bold text-sm leading-none">{day}</span>
                                            <span className="text-white text-xs leading-none">{month}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm">{a.activity_name}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                {a.start_time && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {a.start_time}{a.end_time ? ` - ${a.end_time}` : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-6">Tidak ada kegiatan mendatang.</p>
                    )}
                </div>

                {/* Layanan yang Diterima */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">💙</span>
                        <h3 className="font-semibold text-gray-800">Layanan yang Diterima</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {services?.map((svc) => {
                            const s = serviceIcons[svc.name] ?? { icon: '⭐', color: 'bg-gray-50 border-gray-100', dot: 'bg-gray-400' };
                            return (
                                <div key={svc.name} className={`flex flex-col items-center p-3 rounded-xl border ${s.color}`}>
                                    <span className="text-2xl mb-1">{s.icon}</span>
                                    <span className="text-xs font-medium text-gray-700 text-center leading-tight mb-2">{svc.name}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.dot === 'bg-red-500' ? 'bg-red-100 text-red-700' : s.dot === 'bg-blue-500' ? 'bg-blue-100 text-blue-700' : s.dot === 'bg-orange-500' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {svc.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pengumuman */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📢</span>
                            <h3 className="font-semibold text-gray-800">Pengumuman</h3>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            Lihat Semua
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-3">
                        {announcements?.map((ann) => (
                            <div key={ann.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${ann.color === 'blue' ? 'bg-blue-500' : 'bg-orange-400'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-medium text-gray-800 text-sm">{ann.title}</p>
                                        <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(ann.date)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{ann.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
