import React, { useState, useEffect } from 'react';
import PageLayout from '../dashboard/PageLayout';
import { api } from '../../lib/api';

const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const categoryColor = {
    fisik:   '#3b82f6', sosial: '#22c55e',
    rohani:  '#a855f7', edukasi: '#eab308', lainnya: '#6b7280',
};
const categoryLabel = {
    fisik: 'Fisik', sosial: 'Sosial', rohani: 'Rohani', edukasi: 'Edukasi', lainnya: 'Lainnya',
};

export default function LaporanPage() {
    const now = new Date();
    const [month, setMonth]   = useState(now.getMonth() + 1);
    const [year, setYear]     = useState(now.getFullYear());
    const [data, setData]     = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/api/laporan/summary?month=${month}&year=${year}`)
            .then(d => setData(d))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [month, year]);

    const s = data?.summary ?? {};
    const healthMonths = data?.health_per_month ?? [];
    const maxHealth = Math.max(...healthMonths.map(h => h.count), 1);

    return (
        <PageLayout active="Laporan" title="Laporan" subtitle="Ringkasan statistik dan aktivitas Griya Lansia">
            {/* Period selector */}
            <div className="flex items-center gap-3 mb-5">
                <select
                    value={month}
                    onChange={e => setMonth(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none"
                >
                    {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <select
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none"
                >
                    {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="text-sm text-gray-500">
                    Periode: <strong>{monthNames[month - 1]} {year}</strong>
                </span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: 'Total Lansia',      value: s.total_residents ?? 0,     icon: '👥', color: '#1e2a3a' },
                            { label: 'Total Pegawai',     value: s.total_staff ?? 0,          icon: '👩‍⚕️', color: '#2d6a4f' },
                            { label: 'Total Kamar',       value: s.total_rooms ?? 0,          icon: '🛏️', color: '#1d4ed8' },
                            { label: 'Kegiatan Bulan Ini',value: s.activities_month ?? 0,     icon: '📅', color: '#7c3aed' },
                            { label: 'Pemeriksaan Bulan Ini', value: s.health_checks_month ?? 0, icon: '🩺', color: '#b45309' },
                        ].map(c => (
                            <div key={c.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <div className="text-2xl mb-1">{c.icon}</div>
                                <div className="text-2xl font-bold text-gray-800">{c.value}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Pemeriksaan per bulan */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">📊 Pemeriksaan Kesehatan per Bulan ({year})</h3>
                            <div className="flex items-end gap-1 h-36">
                                {healthMonths.map((h, i) => {
                                    const pct = maxHealth > 0 ? (h.count / maxHealth) * 100 : 0;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-xs text-gray-400">{h.count > 0 ? h.count : ''}</span>
                                            <div
                                                className="w-full rounded-t transition-all"
                                                style={{ height: `${Math.max(pct, 4)}%`, backgroundColor: '#3b82f6', minHeight: h.count > 0 ? '4px' : '2px', opacity: h.count > 0 ? 1 : 0.2 }}
                                            />
                                            <span className="text-xs text-gray-400">{h.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Kegiatan per kategori */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">🏃 Kegiatan per Kategori Bulan Ini</h3>
                            {data?.activities_by_category?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.activities_by_category.map(c => {
                                        const total = data.activities_by_category.reduce((a, b) => a + Number(b.total), 0) || 1;
                                        const pct = Math.round((Number(c.total) / total) * 100);
                                        const color = categoryColor[c.category] ?? '#6b7280';
                                        return (
                                            <div key={c.category}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-gray-600">{categoryLabel[c.category] ?? c.category}</span>
                                                    <span className="text-sm font-semibold text-gray-700">{c.total} ({pct}%)</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-6">Tidak ada kegiatan bulan ini.</p>
                            )}
                        </div>

                        {/* Status lansia */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">👤 Status Lansia</h3>
                            {data?.residents_by_status?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.residents_by_status.map(rs => {
                                        const statusColor = { aktif: '#22c55e', tidak_aktif: '#eab308', meninggal: '#ef4444' };
                                        const statusLabel = { aktif: 'Aktif', tidak_aktif: 'Tidak Aktif', meninggal: 'Meninggal' };
                                        return (
                                            <div key={rs.status} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColor[rs.status] ?? '#6b7280' }} />
                                                    <span className="text-sm text-gray-700">{statusLabel[rs.status] ?? rs.status}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">{rs.total}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-4">Tidak ada data.</p>
                            )}
                        </div>

                        {/* Top kegiatan */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">🏆 Kegiatan Terpopuler ({year})</h3>
                            {data?.top_activities?.length > 0 ? (
                                <div className="space-y-2">
                                    {data.top_activities.map((a, i) => (
                                        <div key={a.activity_name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : '#1e2a3a' }}>
                                                {i + 1}
                                            </span>
                                            <span className="flex-1 text-sm text-gray-700">{a.activity_name}</span>
                                            <span className="text-sm font-semibold text-gray-500">{a.total}x</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-4">Belum ada data kegiatan.</p>
                            )}
                        </div>
                    </div>

                    {/* Print */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
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
        </PageLayout>
    );
}
