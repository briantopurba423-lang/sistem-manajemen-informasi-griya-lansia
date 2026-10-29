import React, { useEffect, useState } from "react";
import api from "./api.js";
import {
    UsersIcon, StethIcon, CalIcon, HeartIcon,
    PlusIcon, EditIcon, TrashIcon, XIcon, ClipIcon,
} from "./icons.jsx";

const today = new Date();
const fmtDate = (d) =>
    d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const statusLabel = {
    selesai: { label: "Selesai", cls: "pw-badge-green" },
    dalam_proses: { label: "Dalam Proses", cls: "pw-badge-yellow" },
    belum_mulai: { label: "Belum Mulai", cls: "pw-badge-gray" },
    akan_datang: { label: "Akan Datang", cls: "pw-badge-blue" },
};

function Badge({ status }) {
    const s = statusLabel[status] ?? { label: status, cls: "pw-badge-gray" };
    return <span className={`pw-badge ${s.cls}`}>{s.label}</span>;
}

/* ── Modal Tambah Pemeriksaan ── */
function ExamModal({ residents, onClose, onSaved }) {
    const [form, setForm] = useState({
        resident_id: "", type: "Pemeriksaan Rutin",
        exam_date: today.toISOString().slice(0, 10),
        exam_time: "08:00", status: "belum_mulai", notes: "",
    });
    const [err, setErr] = useState("");
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/examinations", form);
            onSaved();
        } catch (er) {
            setErr(er.response?.data?.message ?? "Gagal menyimpan.");
        }
    };

    return (
        <div className="pw-modal-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-modal-header">
                    Catat Pemeriksaan
                    <button className="pw-btn pw-btn-icon" onClick={onClose}><XIcon size={16} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {err && <div className="pw-alert pw-alert-error">{err}</div>}
                        <div className="pw-form-group">
                            <label>Lansia</label>
                            <select value={form.resident_id} onChange={set("resident_id")} required>
                                <option value="">Pilih lansia...</option>
                                {residents.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                        <div className="pw-form-group">
                            <label>Jenis Pemeriksaan</label>
                            <select value={form.type} onChange={set("type")}>
                                {["Pemeriksaan Rutin","Cek Tekanan Darah","Cek Gula Darah","Cek Kolesterol","Pemeriksaan Lainnya"]
                                    .map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Tanggal</label>
                                <input type="date" value={form.exam_date} onChange={set("exam_date")} required />
                            </div>
                            <div className="pw-form-group">
                                <label>Waktu</label>
                                <input type="time" value={form.exam_time} onChange={set("exam_time")} required />
                            </div>
                        </div>
                        <div className="pw-form-group">
                            <label>Status</label>
                            <select value={form.status} onChange={set("status")}>
                                <option value="belum_mulai">Belum Mulai</option>
                                <option value="dalam_proses">Dalam Proses</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>
                        <div className="pw-form-group">
                            <label>Catatan</label>
                            <textarea rows={3} value={form.notes} onChange={set("notes")} />
                        </div>
                    </div>
                    <div className="pw-modal-footer">
                        <button type="button" className="pw-btn pw-btn-secondary" onClick={onClose}>Batal</button>
                        <button type="submit" className="pw-btn pw-btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Modal Tambah Kegiatan ── */
function ActivityModal({ onClose, onSaved }) {
    const [form, setForm] = useState({
        name: "", activity_date: today.toISOString().slice(0, 10),
        activity_time: "08:00", status: "akan_datang", notes: "",
    });
    const [err, setErr] = useState("");
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/daily-activities", form);
            onSaved();
        } catch (er) {
            setErr(er.response?.data?.message ?? "Gagal menyimpan.");
        }
    };

    return (
        <div className="pw-modal-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-modal-header">
                    Tambah Kegiatan
                    <button className="pw-btn pw-btn-icon" onClick={onClose}><XIcon size={16} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {err && <div className="pw-alert pw-alert-error">{err}</div>}
                        <div className="pw-form-group">
                            <label>Nama Kegiatan</label>
                            <input value={form.name} onChange={set("name")} required placeholder="cth. Senam Pagi" />
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Tanggal</label>
                                <input type="date" value={form.activity_date} onChange={set("activity_date")} required />
                            </div>
                            <div className="pw-form-group">
                                <label>Waktu</label>
                                <input type="time" value={form.activity_time} onChange={set("activity_time")} required />
                            </div>
                        </div>
                        <div className="pw-form-group">
                            <label>Status</label>
                            <select value={form.status} onChange={set("status")}>
                                <option value="akan_datang">Akan Datang</option>
                                <option value="dalam_proses">Dalam Proses</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>
                        <div className="pw-form-group">
                            <label>Catatan</label>
                            <textarea rows={2} value={form.notes} onChange={set("notes")} />
                        </div>
                    </div>
                    <div className="pw-modal-footer">
                        <button type="button" className="pw-btn pw-btn-secondary" onClick={onClose}>Batal</button>
                        <button type="submit" className="pw-btn pw-btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Modal Catat Kesehatan ── */
function HealthModal({ residents, onClose, onSaved }) {
    const [form, setForm] = useState({
        resident_id: "", check_date: today.toISOString().slice(0, 10),
        diagnosis: "", treatment: "", notes: "",
        blood_pressure_systolic: "", blood_pressure_diastolic: "",
        heart_rate: "", temperature: "", weight: "", blood_sugar: "",
    });
    const [err, setErr] = useState("");
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/health-records", form);
            onSaved();
        } catch (er) {
            setErr(er.response?.data?.message ?? "Gagal menyimpan.");
        }
    };

    return (
        <div className="pw-modal-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-modal-header">
                    Catat Kondisi Kesehatan
                    <button className="pw-btn pw-btn-icon" onClick={onClose}><XIcon size={16} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {err && <div className="pw-alert pw-alert-error">{err}</div>}
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Lansia</label>
                                <select value={form.resident_id} onChange={set("resident_id")} required>
                                    <option value="">Pilih lansia...</option>
                                    {residents.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="pw-form-group">
                                <label>Tanggal</label>
                                <input type="date" value={form.check_date} onChange={set("check_date")} required />
                            </div>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Tekanan Darah Sistolik</label>
                                <input type="number" value={form.blood_pressure_systolic} onChange={set("blood_pressure_systolic")} placeholder="cth. 120" />
                            </div>
                            <div className="pw-form-group">
                                <label>Diastolik</label>
                                <input type="number" value={form.blood_pressure_diastolic} onChange={set("blood_pressure_diastolic")} placeholder="cth. 80" />
                            </div>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Detak Jantung</label>
                                <input type="number" value={form.heart_rate} onChange={set("heart_rate")} placeholder="bpm" />
                            </div>
                            <div className="pw-form-group">
                                <label>Suhu (°C)</label>
                                <input type="number" step="0.1" value={form.temperature} onChange={set("temperature")} placeholder="cth. 36.5" />
                            </div>
                        </div>
                        <div className="pw-form-group">
                            <label>Keluhan / Diagnosis</label>
                            <input value={form.diagnosis} onChange={set("diagnosis")} placeholder="cth. Nyeri lutut" />
                        </div>
                        <div className="pw-form-group">
                            <label>Tindakan</label>
                            <input value={form.treatment} onChange={set("treatment")} placeholder="cth. Pemberian obat" />
                        </div>
                        <div className="pw-form-group">
                            <label>Catatan Tambahan</label>
                            <textarea rows={2} value={form.notes} onChange={set("notes")} />
                        </div>
                    </div>
                    <div className="pw-modal-footer">
                        <button type="button" className="pw-btn pw-btn-secondary" onClick={onClose}>Batal</button>
                        <button type="submit" className="pw-btn pw-btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Main Dashboard ── */
export default function Dashboard({ user, onNavigate }) {
    const [data, setData] = useState(null);
    const [residents, setResidents] = useState([]);
    const [modal, setModal] = useState(null); // "exam" | "activity" | "health"

    const load = async () => {
        try {
            const [dash, res] = await Promise.all([
                api.get("/dashboard"),
                api.get("/residents?per_page=100"),
            ]);
            setData(dash.data);
            setResidents(res.data.data ?? []);
        } catch {}
    };

    useEffect(() => { load(); }, []);

    const handleSaved = () => { setModal(null); load(); };

    if (!data) return <div className="pw-loading">Memuat data dashboard...</div>;

    const { stats, examinations, activities, health_conditions } = data;

    return (
        <div>
            {/* Header */}
            <div className="pw-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Selamat datang, {user?.name}! Berikut ringkasan informasi hari ini.</p>
                </div>
                <div className="pw-date-badge">
                    <CalIcon size={15} />
                    {fmtDate(today)}
                </div>
            </div>

            {/* Stats */}
            <div className="pw-stats">
                <div className="pw-stat-card">
                    <div className="pw-stat-icon"><UsersIcon size={24} /></div>
                    <div>
                        <div className="pw-stat-label">Total Lansia</div>
                        <div className="pw-stat-value">{stats.total_residents}</div>
                        <div className="pw-stat-sub"><span className="pw-stat-sub-dot" />{stats.total_residents} hadir hari ini</div>
                    </div>
                </div>
                <div className="pw-stat-card">
                    <div className="pw-stat-icon"><StethIcon size={24} /></div>
                    <div>
                        <div className="pw-stat-label">Pemeriksaan Hari Ini</div>
                        <div className="pw-stat-value">{stats.today_exams}</div>
                        <div className="pw-stat-sub"><span className="pw-stat-sub-dot" />Selesai: {stats.today_exams_done}</div>
                    </div>
                </div>
                <div className="pw-stat-card">
                    <div className="pw-stat-icon"><CalIcon size={24} /></div>
                    <div>
                        <div className="pw-stat-label">Kegiatan Hari Ini</div>
                        <div className="pw-stat-value">{stats.today_activities}</div>
                        <div className="pw-stat-sub"><span className="pw-stat-sub-dot" />Selesai: {stats.today_activities_done}</div>
                    </div>
                </div>
            </div>

            {/* Pemeriksaan & Kegiatan */}
            <div className="pw-grid-2">
                {/* Jadwal Pemeriksaan */}
                <div className="pw-card">
                    <div className="pw-card-header">
                        <div className="pw-card-title"><StethIcon size={16} />Jadwal Pemeriksaan Hari Ini</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="pw-btn pw-btn-primary pw-btn-sm" onClick={() => setModal("exam")}>
                                <PlusIcon size={13} /> Tambah
                            </button>
                            <span className="pw-card-link" onClick={() => onNavigate("pemeriksaan")}>Lihat Semua →</span>
                        </div>
                    </div>
                    <div className="pw-table-wrap">
                        <table className="pw-table">
                            <thead>
                                <tr>
                                    <th>No</th><th>Nama Lansia</th><th>Jenis Pemeriksaan</th>
                                    <th>Waktu</th><th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examinations.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>Belum ada pemeriksaan hari ini</td></tr>
                                )}
                                {examinations.map((e, i) => (
                                    <tr key={e.id}>
                                        <td>{i + 1}</td>
                                        <td>{e.resident}</td>
                                        <td>{e.type}</td>
                                        <td>{e.time}</td>
                                        <td><Badge status={e.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Kegiatan Hari Ini */}
                <div className="pw-card">
                    <div className="pw-card-header">
                        <div className="pw-card-title"><CalIcon size={16} />Kegiatan Hari Ini</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="pw-btn pw-btn-primary pw-btn-sm" onClick={() => setModal("activity")}>
                                <PlusIcon size={13} /> Tambah
                            </button>
                            <span className="pw-card-link" onClick={() => onNavigate("kegiatan")}>Lihat Semua →</span>
                        </div>
                    </div>
                    <div className="pw-table-wrap">
                        <table className="pw-table">
                            <thead>
                                <tr><th>No</th><th>Kegiatan</th><th>Waktu</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {activities.length === 0 && (
                                    <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8" }}>Belum ada kegiatan hari ini</td></tr>
                                )}
                                {activities.map((a, i) => (
                                    <tr key={a.id}>
                                        <td>{i + 1}</td>
                                        <td>{a.name}</td>
                                        <td>{a.time}</td>
                                        <td><Badge status={a.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Kondisi Kesehatan & Akses Cepat */}
            <div className="pw-grid-2">
                {/* Kondisi Kesehatan */}
                <div className="pw-card">
                    <div className="pw-card-header">
                        <div className="pw-card-title"><HeartIcon size={16} />Kondisi Kesehatan Lansia</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="pw-btn pw-btn-primary pw-btn-sm" onClick={() => setModal("health")}>
                                <PlusIcon size={13} /> Catat
                            </button>
                            <span className="pw-card-link" onClick={() => onNavigate("kesehatan")}>Lihat Semua →</span>
                        </div>
                    </div>
                    <div className="pw-table-wrap">
                        <table className="pw-table">
                            <thead>
                                <tr><th>No</th><th>Nama Lansia</th><th>Keluhan</th><th>Tindakan</th><th>Tanggal</th></tr>
                            </thead>
                            <tbody>
                                {health_conditions.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>Belum ada data kesehatan</td></tr>
                                )}
                                {health_conditions.map((h, i) => (
                                    <tr key={h.id}>
                                        <td>{i + 1}</td>
                                        <td>{h.resident}</td>
                                        <td>{h.complaint}</td>
                                        <td>{h.treatment}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>{h.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Akses Cepat */}
                <div className="pw-card">
                    <div className="pw-card-header">
                        <div className="pw-card-title"><UsersIcon size={16} />Akses Cepat</div>
                    </div>
                    <div className="pw-quick-grid">
                        <button className="pw-quick-btn" onClick={() => onNavigate("lansia")}>
                            <UsersIcon size={28} />Lihat Data Lansia
                        </button>
                        <button className="pw-quick-btn" onClick={() => setModal("exam")}>
                            <StethIcon size={28} />Catat Pemeriksaan
                        </button>
                        <button className="pw-quick-btn" onClick={() => onNavigate("kegiatan")}>
                            <CalIcon size={28} />Lihat Jadwal Kegiatan
                        </button>
                        <button className="pw-quick-btn" onClick={() => onNavigate("laporan")}>
                            <ClipIcon size={28} />Laporan Kegiatan
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {modal === "exam" && (
                <ExamModal residents={residents} onClose={() => setModal(null)} onSaved={handleSaved} />
            )}
            {modal === "activity" && (
                <ActivityModal onClose={() => setModal(null)} onSaved={handleSaved} />
            )}
            {modal === "health" && (
                <HealthModal residents={residents} onClose={() => setModal(null)} onSaved={handleSaved} />
            )}
        </div>
    );
}
