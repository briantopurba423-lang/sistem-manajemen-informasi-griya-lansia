import React, { useEffect, useState } from "react";
import api from "./api.js";
import { PlusIcon, EditIcon, TrashIcon, XIcon, SearchIcon } from "./icons.jsx";

const EMPTY = {
    name: "", nik: "", gender: "L", birth_date: "",
    room: "", address: "", family_name: "", family_phone: "",
    status: "aktif", notes: "",
};

function Modal({ data, onClose, onSaved }) {
    const isEdit = !!data?.id;
    const [form, setForm] = useState(isEdit ? { ...data, birth_date: data.birth_date?.slice(0,10) ?? "" } : EMPTY);
    const [err, setErr] = useState("");
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) await api.put(`/residents/${data.id}`, form);
            else await api.post("/residents", form);
            onSaved();
        } catch (er) {
            const msg = er.response?.data;
            if (msg?.errors) setErr(Object.values(msg.errors)[0][0]);
            else setErr(msg?.message ?? "Gagal menyimpan.");
        }
    };

    return (
        <div className="pw-modal-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-modal-header">
                    {isEdit ? "Edit Data Lansia" : "Tambah Data Lansia"}
                    <button className="pw-btn pw-btn-icon" onClick={onClose}><XIcon size={16} /></button>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {err && <div className="pw-alert pw-alert-error">{err}</div>}
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Nama Lengkap *</label>
                                <input value={form.name} onChange={set("name")} required />
                            </div>
                            <div className="pw-form-group">
                                <label>NIK</label>
                                <input value={form.nik} onChange={set("nik")} />
                            </div>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Jenis Kelamin</label>
                                <select value={form.gender} onChange={set("gender")}>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div className="pw-form-group">
                                <label>Tanggal Lahir</label>
                                <input type="date" value={form.birth_date} onChange={set("birth_date")} />
                            </div>
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>No. Kamar</label>
                                <input value={form.room} onChange={set("room")} placeholder="cth. A1" />
                            </div>
                            <div className="pw-form-group">
                                <label>Status</label>
                                <select value={form.status} onChange={set("status")}>
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak_aktif">Tidak Aktif</option>
                                    <option value="meninggal">Meninggal</option>
                                </select>
                            </div>
                        </div>
                        <div className="pw-form-group">
                            <label>Alamat</label>
                            <textarea rows={2} value={form.address} onChange={set("address")} />
                        </div>
                        <div className="pw-form-row">
                            <div className="pw-form-group">
                                <label>Nama Keluarga</label>
                                <input value={form.family_name} onChange={set("family_name")} />
                            </div>
                            <div className="pw-form-group">
                                <label>No. Telepon Keluarga</label>
                                <input value={form.family_phone} onChange={set("family_phone")} />
                            </div>
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

export default function DataLansia() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const r = await api.get("/residents", { params: { search, page } });
            setRows(r.data.data);
            setMeta(r.data);
        } catch {}
        setLoading(false);
    };

    useEffect(() => { load(); }, [search, page]);

    const del = async (id) => {
        if (!confirm("Hapus data lansia ini?")) return;
        await api.delete(`/residents/${id}`);
        load();
    };

    return (
        <div>
            <div className="pw-page-list-header">
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700 }}>Data Lansia</h1>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
                        Total {meta?.total ?? 0} lansia terdaftar
                    </p>
                </div>
                <button className="pw-btn pw-btn-primary" onClick={() => setModal({})}>
                    <PlusIcon size={15} /> Tambah Lansia
                </button>
            </div>

            <div className="pw-card">
                <div className="pw-card-header">
                    <div className="pw-search-bar">
                        <SearchIcon size={15} color="#94a3b8" />
                        <input
                            placeholder="Cari nama atau NIK..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
                <div className="pw-table-wrap">
                    {loading ? (
                        <div className="pw-loading">Memuat data...</div>
                    ) : (
                        <table className="pw-table">
                            <thead>
                                <tr>
                                    <th>No</th><th>Nama</th><th>Gender</th>
                                    <th>Kamar</th><th>Keluarga</th><th>Status</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 && (
                                    <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>Tidak ada data</td></tr>
                                )}
                                {rows.map((r, i) => (
                                    <tr key={r.id}>
                                        <td>{(page - 1) * 10 + i + 1}</td>
                                        <td style={{ fontWeight: 500 }}>{r.name}</td>
                                        <td>{r.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
                                        <td>{r.room ?? "-"}</td>
                                        <td>{r.family_name ?? "-"}</td>
                                        <td>
                                            <span className={`pw-badge ${r.status === "aktif" ? "pw-badge-green" : "pw-badge-gray"}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button className="pw-btn pw-btn-icon" title="Edit" onClick={() => setModal(r)}>
                                                    <EditIcon size={14} />
                                                </button>
                                                <button className="pw-btn pw-btn-icon" title="Hapus" onClick={() => del(r.id)}
                                                    style={{ color: "#ef4444" }}>
                                                    <TrashIcon size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div style={{ display: "flex", gap: 6, padding: "12px 20px", justifyContent: "flex-end" }}>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                            <button key={p}
                                className={`pw-btn pw-btn-sm ${p === page ? "pw-btn-primary" : "pw-btn-secondary"}`}
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
