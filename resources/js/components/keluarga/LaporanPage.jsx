import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function LaporanPage() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear]   = useState(now.getFullYear());
    const [data, setData]   = useState(null);
    const [loading, setLoading] = useState(true);

    const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    useEffect(() => {
        setLoading(true);
        api.get(`/api/keluarga/health-history?page=1`)
            .then(d => setData(d))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [month, year]);

    return (
        <div className="space-y-4">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📋</span>
                    <h2 className="font-semibold text-gray-800">Laporan Perkembangan Lansia</h2>
                </div>
                <p className="text-sm text-gray-500">
                    Laporan ini menampilkan ringkasan kondisi kesehatan dan partisipasi kegiatan orang terkasih Anda.
                </p>
            </div>

            {/* Month selector */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-gray-700">Periode Laporan:</label>
                    <select
                        value={month}
                        onChange={e => setMonth(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none"
                    >
                        {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <select
                        value={year}
                        onChange={e => setYear(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none"
                    >
                        {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {loading ? (
                    <p className="text-center text-gray-400 py-6">Memuat laporan...</p>
                ) : (
                    <div className="space-y-4">
                        {/* Summary stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { label: 'Pemeriksaan Kesehatan', value: data?.total ?? (data?.data?.length ?? 0), icon: '🩺', color: 'bg-blue-50 border-blue-100' },
                                { label: 'Kondisi Umum', value: 'Stabil', icon: '💚', color: 'bg-green-50 border-green-100' },
                                { label: 'Partisipasi Kegiatan', value: 'Aktif', icon: '⭐', color: 'bg-yellow-50 border-yellow-100' },
                            ].map(s => (
                                <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
                                    <div className="text-2xl mb-1">{s.icon}</div>
                                    <div className="text-xl font-bold text-gray-800">{s.value}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent health records table */}
                        {data?.data?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Rekam Kesehatan Terbaru</h3>
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-sm">
                                        <thead style={{ backgroundColor: '#f8fafc' }}>
                                            <tr>
                                                {['Tanggal', 'Tekanan Darah', 'Gula Darah', 'Suhu', 'BB'].map(h => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.data.slice(0, 5).map(rec => (
                                                <tr key={rec.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-600">
                                                        {rec.check_date ? new Date(rec.check_date).toLocaleDateString('id-ID') : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-red-600">
                                                        {rec.blood_pressure_systolic ? `${rec.blood_pressure_systolic}/${rec.blood_pressure_diastolic}` : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-blue-600">{rec.blood_sugar || '-'}</td>
                                                    <td className="px-4 py-3 text-green-600">{rec.temperature ? `${rec.temperature}°C` : '-'}</td>
                                                    <td className="px-4 py-3 text-purple-600">{rec.weight ? `${rec.weight}kg` : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Print button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Cetak Laporan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
