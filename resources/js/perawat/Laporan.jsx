import React, { useEffect, useState } from "react";
import api from "./api.js";
import { CalIcon, UsersIcon, HeartIcon, ClipIcon } from "./icons.jsx";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni",
                 "Juli","Agustus","September","Oktober","November","Desember"];

function StatBox({ icon: Icon, label, value, color }) {
    return (
        <div className="pw-stat-card">
            <div className="pw-stat-icon" style={{ background: color + "20" }}>
                <Icon size={24} color={color} />
            </div>
            <div>
                <div className="pw-stat-label">{label}</div>
                <div className="pw-stat-value">{value ?? "-"}</div>
            </div>
        </div>
    );
}

export default function Laporan() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear]   = useState(now.getFullYear());
    const [data, setData]   = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const r = await api.get("/laporan/summary", { params: { month, year } });
            setData(r.data);
        } catch {}
        setLoading(false);
    };

    useEffect(() => { load(); }, [month, year]);

    const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

    return (
        <div>
            {/* Header */}
            <div className="pw-page-list-header">
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700 }}>Laporan</h1>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
                        Ringkasan data bulan {MONTHS[month - 1]} {year}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <select value={month} onChange={(e) => setMonth(+e.target.value)}
                        style={{ padding: "7px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13 }}>
                        {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                    </select>
                    <select value={year} onChange={(e) => setYear(+e.target.value)}
                        style={{ padding: "7px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13 }}>
                        {years.map((y) => <option key={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="pw-loading">Memuat laporan...</div>
            ) : data && (
                <>
                    {/* Stats */}
                    <div className="pw-stats" style={{ marginBottom: 20 }}>
                        <StatBox icon={UsersIcon} label="Total Lansia Aktif"
                            value={data.summary.total_residents} color="#3b82f6" />
                        <StatBox icon={HeartIcon} label={`Pemeriksaan Bulan Ini`}
                            value={data.summary.health_checks_month} color="#ef4444" />
                        <StatBox icon={CalIcon} label={`Kegiatan Bulan Ini`}
                            value={data.summary.activities_month} color="#16a34a" />
                    </div>

                    <div className="pw-grid-2">
                        {/* Status Lansia */}
                        <div className="pw-card">
                            <div className="pw-card-header">
                                <div className="pw-card-title"><UsersIcon size={16} />Status Lansia</div>
                            </div>
                            <table className="pw-table">
                                <thead>
                                    <tr><th>Status</th><th>Jumlah</th></tr>
                                </thead>
                                <tbody>
                                    {data.residents_by_status.map((r) => (
                                        <tr key={r.status}>
                                            <td style={{ textTransform: "capitalize" }}>{r.status.replace("_", " ")}</td>
                                            <td style={{ fontWeight: 600 }}>{r.total}</td>
                                        </tr>
                                    ))}
                                    {data.residents_by_status.length === 0 && (
                                        <tr><td colSpan={2} style={{ textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Kegiatan per Kategori */}
                        <div className="pw-card">
                            <div className="pw-card-header">
                                <div className="pw-card-title"><CalIcon size={16} />Kegiatan per Kategori</div>
                            </div>
                            <table className="pw-table">
                                <thead>
                                    <tr><th>Kategori</th><th>Jumlah</th></tr>
                                </thead>
                                <tbody>
                                    {data.activities_by_category.map((a) => (
                                        <tr key={a.category}>
                                            <td style={{ textTransform: "capitalize" }}>{a.category}</td>
                                            <td style={{ fontWeight: 600 }}>{a.total}</td>
                                        </tr>
                                    ))}
                                    {data.activities_by_category.length === 0 && (
                                        <tr><td colSpan={2} style={{ textAlign: "center", color: "#94a3b8" }}>Tidak ada kegiatan bulan ini</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grafik pemeriksaan per bulan (bar sederhana) */}
                    <div className="pw-card" style={{ marginTop: 16 }}>
                        <div className="pw-card-header">
                            <div className="pw-card-title"><HeartIcon size={16} />Pemeriksaan Kesehatan Sepanjang Tahun {year}</div>
                        </div>
                        <div style={{ padding: "20px 24px" }}>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                                {data.health_per_month.map((m) => {
                                    const max = Math.max(...data.health_per_month.map((x) => x.count), 1);
                                    const h = Math.max((m.count / max) * 100, m.count > 0 ? 8 : 0);
                                    return (
                                        <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                            <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{m.count || ""}</span>
                                            <div style={{
                                                width: "100%", height: `${h}px`,
                                                background: m.month === MONTHS[month-1].slice(0,3) ? "#3b82f6" : "#bfdbfe",
                                                borderRadius: "4px 4px 0 0", minHeight: m.count > 0 ? 4 : 0,
                                            }} />
                                            <span style={{ fontSize: 10, color: "#94a3b8" }}>{m.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Top Kegiatan */}
                    {data.top_activities.length > 0 && (
                        <div className="pw-card" style={{ marginTop: 16 }}>
                            <div className="pw-card-header">
                                <div className="pw-card-title"><ClipIcon size={16} />5 Kegiatan Terbanyak Tahun {year}</div>
                            </div>
                            <table className="pw-table">
                                <thead>
                                    <tr><th>No</th><th>Nama Kegiatan</th><th>Total</th></tr>
                                </thead>
                                <tbody>
                                    {data.top_activities.map((a, i) => (
                                        <tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{a.activity_name}</td>
                                            <td style={{ fontWeight: 600 }}>{a.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
