import React, { useState } from 'react';

const ROLES = [
    { id: 'admin',    label: 'Admin',          desc: 'Manajemen sistem' },
    { id: 'perawat',  label: 'Perawat / Staff', desc: 'Pelayanan lansia' },
    { id: 'keluarga', label: 'Keluarga',        desc: 'Pantau orang terkasih' },
];

const DESTINATIONS = {
    admin:    '/admin/dashboard',
    perawat:  '/perawat/dashboard',
    keluarga: '/keluarga/dashboard',
};

// SVG icons — tidak ada emoji agar tidak ada masalah encoding
function HouseIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#93c5fd"
            stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
    );
}

export default function LoginPage() {
    const [role, setRole]         = useState('perawat');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    const msgs = Object.values(data.errors).flat();
                    setError(msgs[0] ?? 'Login gagal.');
                } else {
                    setError(data.message ?? 'Login gagal.');
                }
                return;
            }

            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_user', JSON.stringify(data.user));

            window.location.href = DESTINATIONS[data.user.role] ?? '/';
        } catch {
            setError('Tidak dapat terhubung ke server. Coba lagi.');
        } finally {
            setLoading(false);
        }
    }

    const inputStyle = {
        width: '100%', padding: '11px 14px', fontSize: 13,
        border: '1px solid #e2e8f0', borderRadius: 10,
        outline: 'none', boxSizing: 'border-box',
        background: '#fbfcfb', color: '#1e293b',
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

            {/* Panel Kiri */}
            <div style={{
                width: '45%', background: '#1e293b', padding: '48px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', color: '#fff',
            }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, background: '#3b82f6',
                        display: 'grid', placeItems: 'center',
                    }}>
                        <HouseIcon />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 18 }}>Griya Lansia</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Sistem Informasi Manajemen</div>
                    </div>
                </div>

                {/* Hero */}
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>
                        Merawat dengan<br />
                        <span style={{ color: '#93c5fd' }}>sepenuh hati.</span>
                    </h1>
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>
                        Satu ruang digital untuk memberikan pelayanan terbaik,
                        memantau kesehatan, dan menjaga kebahagiaan setiap lansia.
                    </p>
                    <div style={{
                        marginTop: 28, padding: 18, borderRadius: 14,
                        border: '1px solid rgba(255,255,255,.1)',
                        background: 'rgba(255,255,255,.05)',
                        display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: 'rgba(147,197,253,.1)',
                            display: 'grid', placeItems: 'center',
                        }}>
                            <HeartIcon />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>Setiap lansia berarti.</div>
                            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                                Perawatan penuh perhatian, setiap hari.
                            </div>
                        </div>
                    </div>
                </div>

                <p style={{ fontSize: 11, color: '#475569' }}>
                    &copy; 2026 Griya Lansia &middot; Sistem Informasi Manajemen
                </p>
            </div>

            {/* Panel Kanan */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '40px 48px', background: '#f8fafc',
            }}>
                <div style={{ width: '100%', maxWidth: 460 }}>

                    <div style={{ marginBottom: 28 }}>
                        <span style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: 2,
                            color: '#3b82f6', textTransform: 'uppercase',
                        }}>
                            SELAMAT DATANG
                        </span>
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '10px 0 6px' }}>
                            Masuk ke akun Anda
                        </h2>
                        <p style={{ fontSize: 13, color: '#64748b' }}>
                            Silakan masuk untuk mengakses layanan Griya Lansia.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Role Selector */}
                        <div style={{ marginBottom: 22 }}>
                            <label style={{
                                fontSize: 12, fontWeight: 700, color: '#344d46',
                                display: 'block', marginBottom: 8,
                            }}>
                                Masuk sebagai
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {ROLES.map((r) => (
                                    <button
                                        key={r.id} type="button"
                                        onClick={() => setRole(r.id)}
                                        style={{
                                            padding: '12px 10px', borderRadius: 12, textAlign: 'left',
                                            border: role === r.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                            background: role === r.id ? '#eff6ff' : '#fff',
                                            cursor: 'pointer', transition: 'all .15s',
                                        }}
                                    >
                                        <div style={{
                                            fontSize: 12, fontWeight: 700,
                                            color: role === r.id ? '#1d4ed8' : '#344d46',
                                        }}>
                                            {r.label}
                                        </div>
                                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                                            {r.desc}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{
                                fontSize: 12, fontWeight: 700, color: '#344d46',
                                display: 'block', marginBottom: 6,
                            }}>
                                Alamat Email
                            </label>
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com" autoComplete="username"
                                style={inputStyle}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                fontSize: 12, fontWeight: 700, color: '#344d46',
                                display: 'block', marginBottom: 6,
                            }}>
                                Kata Sandi
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPass ? 'text' : 'password'} required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi" autoComplete="current-password"
                                    style={{ ...inputStyle, paddingRight: 42 }}
                                />
                                <button
                                    type="button" onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', color: '#94a3b8', fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                >
                                    {showPass ? 'Sembunyikan' : 'Tampilkan'}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                marginBottom: 16, padding: '10px 14px', borderRadius: 10,
                                background: '#fee2e2', border: '1px solid #fecaca',
                                color: '#b91c1c', fontSize: 13,
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '13px', borderRadius: 10,
                                background: loading ? '#93c5fd' : '#1d4ed8',
                                color: '#fff', fontWeight: 700, fontSize: 14,
                                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background .2s',
                            }}
                        >
                            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
                        </button>
                    </form>

                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 6, marginTop: 22, fontSize: 12, color: '#64748b',
                    }}>
                        <LockIcon /> Akses aman untuk pengguna terdaftar
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#94a3b8' }}>
                        Butuh bantuan masuk? Hubungi administrator sistem.
                    </p>
                </div>
            </div>
        </div>
    );
}
