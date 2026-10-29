import React, { useEffect, useState } from "react";
import api from "./api.js";
import { PlusIcon, EditIcon, TrashIcon, XIcon } from "./icons.jsx";

const statusOpts = [
    { value: "akan_datang", label: "Akan Datang" },
    { value: "dalam_proses", label: "Dalam Proses" },
    { value: "selesai", label: "Selesai" },
];
const statusCls = {
    selesai: "pw-badge-green",
    dalam_proses: "pw-badge-yellow",
    akan_datang: "pw-badge-blue",
};

function Modal({ data, onClose, onSaved }) {
    const isEdit = !!data?.id;
    const [form, setForm] = useState(isEdit ? {
        ...data, activity_date: data.activity_date?.slice(0,10) ?? "",
        activity_time: data.activity_time?.slice(0,5) ?? "",
    } : {
        name: "", activity_date: new Date().toISOString().slice(0,10),
        activity_time: "08:00", status: "akan_datang", notes: "",
    });
    const [err, setErr] = useState("");
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) await api.put(`/daily-activities/${data.id}`, form);
            else await api.post("/daily-activities", form);
            onSaved();
        } catch (er) {
            setErr(er.response?.data?.message ?? "Gagal menyimpan.");
        }
    };

    return (
        <div className="pw-modal-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-modal-header">
                    {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"}
                    <button className="pw-btn pw-btn-icon" onClick={onClose}><XIcon size={16} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {err && <div className="pw-alert pw-alert-error">{err}</div>}
                        <div className="pw-form-group">
                            <label>Nama Kegiatan *</label>
                            <input value={form.name} onChange={set("name")} required placeholder="cth. Senam Pagi" />
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Tanggal *</label>
                                <input type="date" value={form.activity_date} onChange={set("activity_date")} required />
                            </div>
                            <div className="pw-form-group">
                                <label>Waktu *</label>
                                <input type="time" value={form.activity_time} onChange={set("activity_time")} required />
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

export default function Kegiatan() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    const [filterDate, setFilterDate] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const r = await api.get("/daily-activities", { params: { date: filterDate || undefined, page } });
            setRows(r.data.data);
            setMeta(r.data);
        } catch {}
        setLoading(false);
    };

    useEffect(() => { load(); }, [filterDate, page]);

    const del = async (id) => {
        if (!confirm("Hapus kegiatan ini?")) return;
        await api.delete(`/daily-activities/${id}`);
        load();
    };

    return (
        <div>
            <div className="pw-page-list-header">
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700 }}>Kegiatan Harian</h1>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Jadwal kegiatan lansia</p>
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
                                <tr><th>No</th><th>Kegiatan</th><th>Tanggal</th><th>Waktu</th><th>Status</th><th>Aksi</th></tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                                )}
                                {rows.map((r, i) => (
                                    <tr key={r.id}>
                                        <td>{(page-1)*10+i+1}</td>
                                        <td style={{ fontWeight: 500 }}>{r.name}</td>
                                        <td>{r.activity_date?.slice(0,10)}</td>
                                        <td>{r.activity_time?.slice(0,5)}</td>
                                        <td>
                                            <span className={`pw-badge ${statusCls[r.status] ?? "pw-badge-gray"}`}>
                                                {statusOpts.find((o) => o.value === r.status)?.label ?? r.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button className="pw-btn pw-btn-icon" onClick={() => setModal(r)}><EditIcon size={14} /></button>
                                                <button className="pw-btn pw-btn-icon" style={{ color: "#ef4444" }} onClick={() => del(r.id)}><TrashIcon size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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
                <Modal data={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />
            )}
        </div>
    );
}
