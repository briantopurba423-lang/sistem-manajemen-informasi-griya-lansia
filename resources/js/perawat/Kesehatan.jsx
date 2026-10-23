import React, { useEffect, useState } from "react";
import api from "./api.js";
import { PlusIcon, EditIcon, TrashIcon, XIcon, SearchIcon } from "./icons.jsx";

function Modal({ residents, data, onClose, onSaved }) {
    const isEdit = !!data?.id;
    const [form, setForm] = useState(isEdit ? {
        ...data, check_date: data.check_date?.slice(0,10) ?? "",
    } : {
        resident_id: "", check_date: new Date().toISOString().slice(0,10),
        blood_pressure_systolic: "", blood_pressure_diastolic: "",
        heart_rate: "", temperature: "", weight: "", blood_sugar: "",
        diagnosis: "", treatment: "", notes: "",
    });
    const [err, setErr] = useState("");
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) await api.put(`/health-records/${data.id}`, form);
            else await api.post("/health-records", form);
            onSaved();
        } catch (er) {
            setErr(er.response?.data?.message ?? "Gagal menyimpan.");
        }
    };

    return (
        <div className="pw-modal-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-modal-header">
                    {isEdit ? "Edit Catatan Kesehatan" : "Catat Kondisi Kesehatan"}
                    <button className="pw-btn pw-btn-icon" onClick={onClose}><XIcon size={16} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {err && <div className="pw-alert pw-alert-error">{err}</div>}
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Lansia *</label>
                                <select value={form.resident_id} onChange={set("resident_id")} required>
                                    <option value="">Pilih lansia...</option>
                                    {residents.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="pw-form-group">
                                <label>Tanggal *</label>
                                <input type="date" value={form.check_date} onChange={set("check_date")} required />
                            </div>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>TD Sistolik</label>
                                <input type="number" value={form.blood_pressure_systolic} onChange={set("blood_pressure_systolic")} placeholder="mmHg" />
                            </div>
                            <div className="pw-form-group">
                                <label>TD Diastolik</label>
                                <input type="number" value={form.blood_pressure_diastolic} onChange={set("blood_pressure_diastolic")} placeholder="mmHg" />
                            </div>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Detak Jantung</label>
                                <input type="number" value={form.heart_rate} onChange={set("heart_rate")} placeholder="bpm" />
                            </div>
                            <div className="pw-form-group">
                                <label>Suhu (°C)</label>
                                <input type="number" step="0.1" value={form.temperature} onChange={set("temperature")} />
                            </div>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Berat Badan (kg)</label>
                                <input type="number" step="0.1" value={form.weight} onChange={set("weight")} />
                            </div>
                            <div className="pw-form-group">
                                <label>Gula Darah</label>
                                <input value={form.blood_sugar} onChange={set("blood_sugar")} placeholder="mg/dL" />
                            </div>
                        </div>
                        <div className="pw-form-group">
                            <label>Keluhan / Diagnosis</label>
                            <input value={form.diagnosis} onChange={set("diagnosis")} />
                        </div>
                        <div className="pw-form-group">
                            <label>Tindakan</label>
                            <input value={form.treatment} onChange={set("treatment")} />
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

export default function Kesehatan() {
    const [rows, setRows] = useState([]);
    const [residents, setResidents] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const [r, res] = await Promise.all([
                api.get("/health-records", { params: { page } }),
                api.get("/residents?per_page=100"),
            ]);
            setRows(r.data.data);
            setMeta(r.data);
            setResidents(res.data.data ?? []);
        } catch {}
        setLoading(false);
    };

    useEffect(() => { load(); }, [page]);

    const del = async (id) => {
        if (!confirm("Hapus catatan kesehatan ini?")) return;
        await api.delete(`/health-records/${id}`);
        load();
    };

    return (
        <div>
            <div className="pw-page-list-header">
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700 }}>Kondisi Kesehatan</h1>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Riwayat catatan kesehatan lansia</p>
                </div>
                <button className="pw-btn pw-btn-primary" onClick={() => setModal({})}>
                    <PlusIcon size={15} /> Catat Kesehatan
                </button>
            </div>
            <div className="pw-card">
                <div className="pw-table-wrap">
                    {loading ? <div className="pw-loading">Memuat data...</div> : (
                        <table className="pw-table">
                            <thead>
                                <tr><th>No</th><th>Nama Lansia</th><th>Tanggal</th><th>TD</th><th>Keluhan</th><th>Tindakan</th><th>Aksi</th></tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 && (
                                    <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                                )}
                                {rows.map((r, i) => (
                                    <tr key={r.id}>
                                        <td>{(page-1)*10+i+1}</td>
                                        <td style={{ fontWeight: 500 }}>{r.resident?.name ?? "-"}</td>
                                        <td>{r.check_date?.slice(0,10)}</td>
                                        <td>{r.blood_pressure_systolic && r.blood_pressure_diastolic
                                            ? `${r.blood_pressure_systolic}/${r.blood_pressure_diastolic}`
                                            : "-"}</td>
                                        <td>{r.diagnosis ?? "-"}</td>
                                        <td>{r.treatment ?? "-"}</td>
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
                <Modal residents={residents} data={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />
            )}
        </div>
    );
}
