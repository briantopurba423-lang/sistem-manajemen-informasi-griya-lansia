import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const categoryColors = {
    fisik:   { bg: 'bg-blue-500',   light: 'bg-blue-50 border-blue-200',   text: 'text-blue-700',   label: 'Fisik' },
    sosial:  { bg: 'bg-green-500',  light: 'bg-green-50 border-green-200',  text: 'text-green-700',  label: 'Sosial' },
    rohani:  { bg: 'bg-purple-500', light: 'bg-purple-50 border-purple-200',text: 'text-purple-700', label: 'Rohani' },
    edukasi: { bg: 'bg-yellow-500', light: 'bg-yellow-50 border-yellow-200',text: 'text-yellow-700', label: 'Edukasi' },
    lainnya: { bg: 'bg-gray-500',   light: 'bg-gray-50 border-gray-200',    text: 'text-gray-700',   label: 'Lainnya' },
};
const participationLabel = { aktif: '✅ Aktif', pasif: '👁️ Pasif', tidak_hadir: '❌ Tidak Hadir' };

export default function KegiatanPage() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear]   = useState(now.getFullYear());
    const [data, setData]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/api/keluarga/activities?month=${month}&year=${year}`)
            .then(d => setData(d.data ?? []))
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    }, [month, year]);

    function prevMonth() {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    }
    function nextMonth() {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                {/* Month nav */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📅</span>
                        <h2 className="font-semibold text-gray-800">Jadwal Kegiatan</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold text-gray-700 w-36 text-center">
                            {monthNames[month - 1]} {year}
                        </span>
                        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-400 py-10">Memuat kegiatan...</p>
                ) : data.length === 0 ? (
                    <div className="py-12 text-center">
                        <span className="text-4xl">📭</span>
                        <p className="text-gray-400 mt-3">Tidak ada kegiatan di bulan ini.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {data.map(a => {
                            const cc = categoryColors[a.category] ?? categoryColors.lainnya;
                            const d = new Date(a.activity_date);
                            return (
                                <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition">
                                    {/* Date box */}
                                    <div className={`w-12 h-12 rounded-xl ${cc.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                                        <span className="text-white font-bold text-base leading-none">{d.getDate()}</span>
                                        <span className="text-white/80 text-xs">{monthNames[d.getMonth()].slice(0, 3)}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-semibold text-gray-800">{a.activity_name}</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cc.light} ${cc.text} flex-shrink-0`}>
                                                {cc.label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            {a.start_time && (
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {a.start_time}{a.end_time ? ` - ${a.end_time}` : ''}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500">{participationLabel[a.participation] ?? a.participation}</span>
                                        </div>
                                        {a.notes && <p className="text-xs text-gray-400 mt-1">{a.notes}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
