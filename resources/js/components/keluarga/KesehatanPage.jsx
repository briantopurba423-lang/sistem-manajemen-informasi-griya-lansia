import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

function BPStatus(sys) {
    if (!sys) return null;
    const v = Number(sys);
    if (v >= 140) return <span className="text-xs text-red-600 font-medium ml-1">(Tinggi)</span>;
    if (v >= 120) return <span className="text-xs text-yellow-600 font-medium ml-1">(Normal Tinggi)</span>;
    return <span className="text-xs text-green-600 font-medium ml-1">(Normal)</span>;
}

export default function KesehatanPage() {
    const [data, setData]   = useState([]);
    const [meta, setMeta]   = useState(null);
    const [page, setPage]   = useState(1);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        api.get(`/api/keluarga/health-history?page=${page}`)
            .then(d => { setData(d.data); setMeta(d.meta); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page]);

    useEffect(() => { load(); }, [load]);

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h2 className="font-semibold text-gray-800">Riwayat Pemeriksaan Kesehatan</h2>
                </div>

                {loading ? (
                    <p className="text-center text-gray-400 py-10">Memuat data...</p>
                ) : data.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">Belum ada riwayat kesehatan.</p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {data.map(rec => (
                            <button
                                key={rec.id}
                                onClick={() => setSelected(selected?.id === rec.id ? null : rec)}
                                className="w-full text-left px-5 py-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {rec.check_date
                                            ? new Date(rec.check_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                            : '-'}
                                    </span>
                                    <span className="text-xs text-gray-400">Dicatat: {rec.staff?.name ?? '-'}</span>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { label: 'Tekanan Darah', val: rec.blood_pressure_systolic ? `${rec.blood_pressure_systolic}/${rec.blood_pressure_diastolic}` : '-', unit: 'mmHg', color: 'text-red-600' },
                                        { label: 'Gula Darah', val: rec.blood_sugar || '-', unit: 'mg/dL', color: 'text-blue-600' },
                                        { label: 'Suhu', val: rec.temperature || '-', unit: '°C', color: 'text-green-600' },
                                        { label: 'Berat Badan', val: rec.weight || '-', unit: 'kg', color: 'text-purple-600' },
                                    ].map(({ label, val, unit, color }) => (
                                        <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                                            <p className={`text-base font-bold ${color}`}>{val}</p>
                                            <p className="text-xs text-gray-400">{unit}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                                        </div>
                                    ))}
                                </div>

                                {selected?.id === rec.id && (rec.diagnosis || rec.treatment || rec.notes) && (
                                    <div className="mt-3 space-y-2">
                                        {rec.diagnosis && (
                                            <div className="p-3 bg-blue-50 rounded-xl text-sm">
                                                <span className="font-medium text-blue-700">Diagnosis: </span>
                                                <span className="text-gray-700">{rec.diagnosis}</span>
                                            </div>
                                        )}
                                        {rec.treatment && (
                                            <div className="p-3 bg-green-50 rounded-xl text-sm">
                                                <span className="font-medium text-green-700">Tindakan: </span>
                                                <span className="text-gray-700">{rec.treatment}</span>
                                            </div>
                                        )}
                                        {rec.notes && (
                                            <div className="p-3 bg-yellow-50 rounded-xl text-sm">
                                                <span className="font-medium text-yellow-700">Catatan: </span>
                                                <span className="text-gray-700">{rec.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Halaman {meta.current_page} dari {meta.last_page}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
                            >‹ Sebelumnya</button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === meta.last_page}
                                className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
                            >Berikutnya ›</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
