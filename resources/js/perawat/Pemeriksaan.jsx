import React, { useEffect, useState } from "react";
import api from "./api.js";
import { PlusIcon, EditIcon, TrashIcon, XIcon } from "./icons.jsx";

const statusOpts = [
    { value: "belum_mulai", label: "Belum Mulai", cls: "pw-badge-gray" },
    { value: "dalam_proses", label: "Dalam Proses", cls: "pw-badge-yellow" },
    { value: "selesai", label: "Selesai", cls: "pw-badge-green" },
];
const examTypes = [
    "Pemeriksaan Rutin","Cek Tekanan Darah","Cek Gula Darah","Cek Kolesterol","Pemeriksaan Lainnya",
];

function Modal({ residents, data, onClose, onSaved }) {
    const isEdit = !!data?.id;
    const [form, setForm] = useState(isEdit ? {
        ...data,
        exam_date: data.exam_date?.slice(0,10) ?? "",
        exam_time: data.exam_time?.slice(0,5) ?? "",
    } : {
        resident_id: "", type: "Pemeriksaan Rutin",
        exam_date: new Date().toISOString().slice(0,10),
        exam_time: "08:00", status: "belum_mulai", notes: "",
    });
    const [err, setErr] = useState("");
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) await api.put(`/examinations/${data.id}`, form);
            else await api.post("/examinations", form);
            onSaved();
        } catch (er) {
            setErr(er.response?.data?.message ?? "Gagal menyimpan.");
        }
    };

    return (
        <div className="pw-modal-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-modal-header">
                    {isEdit ? "Edit Pemeriksaan" : "Catat Pemeriksaan"}
                    <button className="pw-btn pw-btn-icon" onClick={onClose}><XIcon size={16} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {err && <div className="pw-alert pw-alert-error">{err}</div>}
                        <div className="pw-form-group">
                            <label>Lansia *</label>
                            <select value={form.resident_id} onChange={set("resident_id")} required>
                                <option value="">Pilih lansia...</option>
                                {residents.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                        <div className="pw-form-group">
                            <label>Jenis Pemeriksaan *</label>
                            <select value={form.type} onChange={set("type")}>
                                {examTypes.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Tanggal *</label>
                                <input type="date" value={form.exam_date} onChange={set("exam_date")} required />
                            </div>
                            <div className="pw-form-group">
                                <label>Waktu *</label>
                                <input type="time" value={form.exam_time} onChange={set("exam_time")} required />
                            </div>
                        </div>
                        <div className="pw-form-group">
                            <label>Status</label>
                            <select value={form.status} onChange={set("status")}>
                                {statusOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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

export default function Pemeriksaan() {
    const [rows, setRows] = useState([]);
    const [residents, setResidents] = useState([]);
    const [meta, setMeta] = useState(null);
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const [r, res] = await Promise.all([
                api.get("/examinations", { params: { date: filterDate || undefined, page } }),
                api.get("/residents?per_page=100"),
            ]);
            setRows(r.data.data);
            setMeta(r.data);
            setResidents(res.data.data ?? []);
        } catch {}
        setLoading(false);
    };

    useEffect(() => { load(); }, [filterDate, page]);

    const del = async (id) => {
        if (!confirm("Hapus pemeriksaan ini?")) return;
        await api.delete(`/examinations/${id}`);
        load();
    };

    return (
        <div>
            <div className="pw-page-list-header">
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700 }}>Jadwal Pemeriksaan</h1>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Daftar pemeriksaan lansia</p>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
                        style={{ padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13 }} />
                    <button className="pw-btn pw-btn-primary" onClick={() => setModal({})}>
                        <PlusIcon size={15} /> Tambah
                    </button>
                </div>
            </div>
            <div className="pw-card">
                <div className="pw-table-wrap">
                    {loading ? <div className="pw-loading">Memuat data...</div> : (
                        <table className="pw-table">
                            <thead>
                                <tr><th>No</th><th>Nama Lansia</th><th>Jenis</th><th>Tanggal</th><th>Waktu</th><th>Status</th><th>Aksi</th></tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 && (
                                    <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                                )}
                                {rows.map((r, i) => {
                                    const s = statusOpts.find((o) => o.value === r.status);
                                    return (
                                        <tr key={r.id}>
                                            <td>{(page-1)*10+i+1}</td>
                                            <td style={{ fontWeight: 500 }}>{r.resident?.name ?? "-"}</td>
                                            <td>{r.type}</td>
                                            <td>{r.exam_date?.slice(0,10)}</td>
                                            <td>{r.exam_time?.slice(0,5)}</td>
                                            <td><span className={`pw-badge ${s?.cls ?? "pw-badge-gray"}`}>{s?.label ?? r.status}</span></td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button className="pw-btn pw-btn-icon" onClick={() => setModal(r)}><EditIcon size={14} /></button>
                                                    <button className="pw-btn pw-btn-icon" style={{ color: "#ef4444" }} onClick={() => del(r.id)}><TrashIcon size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                {meta && meta.last_page > 1 && (
                    <div style={{ display: "flex", gap: 6, padding: "12px 20px", justifyContent: "flex-end" }}>
                        {Array.from({ length: meta.last_page }, (_, i) => i+1).map((p) => (
                            <button key={p} className={`pw-btn pw-btn-sm ${p===page?"pw-btn-primary":"pw-btn-secondary"}`}
                                onClick={() => setPage(p)}>{p}</button>
                        ))}
                    </div>
                )}
            </div>
            {modal !== null && (
                <Modal residents={residents} data={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />
            )}
        </div>
    );
}
