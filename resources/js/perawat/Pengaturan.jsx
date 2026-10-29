import React, { useState } from "react";
import api from "./api.js";
import { XIcon } from "./icons.jsx";

export default function Pengaturan({ user, onUserUpdate }) {
    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
        password_confirmation: "",
    });
    const [success, setSuccess] = useState("");
    const [error, setError]     = useState("");
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");

        if (form.password && form.password !== form.password_confirmation) {
            setError("Konfirmasi kata sandi tidak cocok.");
            return;
        }

        setLoading(true);
        try {
            const payload = { name: form.name, email: form.email };
            if (form.password) payload.password = form.password;

            const r = await api.put("/profile", payload);
            const updated = r.data;
            localStorage.setItem("auth_user", JSON.stringify(updated));
            if (onUserUpdate) onUserUpdate(updated);
            setSuccess("Profil berhasil diperbarui.");
            setForm((f) => ({ ...f, password: "", password_confirmation: "" }));
        } catch (er) {
            const d = er.response?.data;
            if (d?.errors) setError(Object.values(d.errors)[0][0]);
            else setError(d?.message ?? "Gagal menyimpan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>Pengaturan</h1>
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Kelola informasi akun Anda</p>
            </div>

            <div className="pw-card" style={{ maxWidth: 520 }}>
                <div className="pw-card-header">
                    <div className="pw-card-title">Profil Saya</div>
                </div>
                <form onSubmit={submit}>
                    <div className="pw-modal-body">
                        {error   && <div className="pw-alert pw-alert-error">{error}</div>}
                        {success && (
                            <div style={{
                                padding: "10px 14px", borderRadius: 8, fontSize: 12,
                                background: "#dcfce7", border: "1px solid #bbf7d0", color: "#15803d",
                            }}>{success}</div>
                        )}

                        <div className="pw-form-group">
                            <label>Nama Lengkap</label>
                            <input value={form.name} onChange={set("name")} required />
                        </div>
                        <div className="pw-form-group">
                            <label>Email</label>
                            <input type="email" value={form.email} onChange={set("email")} required />
                        </div>

                        <div style={{ borderTop: "1px solid #f1f5f9", margin: "8px 0", paddingTop: 14 }}>
                            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                                Kosongkan kata sandi jika tidak ingin mengubahnya.
                            </p>
                        </div>

                        <div className="pw-form-group">
                            <label>Kata Sandi Baru</label>
                            <input type="password" value={form.password} onChange={set("password")}
                                placeholder="Min. 8 karakter" autoComplete="new-password" />
                        </div>
                        <div className="pw-form-group">
                            <label>Konfirmasi Kata Sandi</label>
                            <input type="password" value={form.password_confirmation}
                                onChange={set("password_confirmation")}
                                placeholder="Ulangi kata sandi baru" autoComplete="new-password" />
                        </div>
                    </div>
                    <div className="pw-modal-footer">
                        <button type="submit" className="pw-btn pw-btn-primary" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
