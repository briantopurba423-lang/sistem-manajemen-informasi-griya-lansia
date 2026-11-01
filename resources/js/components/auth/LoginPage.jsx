import React, { useState } from 'react';

const ROLES = [
    { id: 'admin',    label: 'Admin',           desc: 'Manajemen sistem' },
    { id: 'staff',    label: 'Perawat / Staff',  desc: 'Pelayanan lansia' },
    { id: 'keluarga', label: 'Keluarga',         desc: 'Pantau orang terkasih' },
];

export default function LoginPage() {
    const [role, setRole]         = useState('admin');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors]     = useState({});
    const [loading, setLoading]   = useState(false);

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content ?? '';

    // Default email hints per role
    const hints = {
        admin:    'admin@griyalansia.id',
        staff:    'staff@griyalansia.id',
        keluarga: 'keluarga@griyalansia.id',
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                    'X-CSRF-TOKEN': csrf(),
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors(data.errors ?? { email: [data.message ?? 'Login gagal.'] });
                return;
            }

            window.location.href = data.redirect ?? '/dashboard';
        } catch {
            setErrors({ email: ['Tidak dapat terhubung ke server. Coba lagi.'] });
        } finally {
            setLoading(false);
        }
    }

    const hasError = Object.keys(errors).length > 0;
    const firstError = hasError ? Object.values(errors).flat()[0] : null;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            background: '#f1f5f9',
        }}>
            {/* ── Panel Kiri ─────────────────────────────────────── */}
            <div style={{
                width: '42%',
                minWidth: 380,
                background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)',
                padding: '52px 48px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute', top: -80, right: -80,
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'rgba(59,130,246,.08)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: -60, left: -60,
                    width: 250, height: 250, borderRadius: '50%',
                    background: 'rgba(99,102,241,.07)',
                    pointerEvents: 'none',
                }} />

                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: '#3b82f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(59,130,246,.4)',
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.3px' }}>Griya Lansia</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Sistem Informasi Manajemen</div>
                    </div>
                </div>

                {/* Hero text */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        background: 'rgba(59,130,246,.15)',
                        border: '1px solid rgba(59,130,246,.3)',
                        borderRadius: 20, padding: '5px 14px',
                        fontSize: 11, color: '#93c5fd', fontWeight: 600,
                        marginBottom: 20, letterSpacing: '.5px',
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: '#3b82f6', display: 'inline-block',
                        }} />
                        CARE · COMFORT · COMPASSION
                    </div>

                    <h1 style={{
                        fontSize: 34, fontWeight: 800, lineHeight: 1.25,
                        marginBottom: 18, letterSpacing: '-.5px',
                    }}>
                        Merawat dengan<br />
                        <span style={{ color: '#60a5fa' }}>sepenuh hati.</span>
                    </h1>

                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, marginBottom: 32 }}>
                        Satu ruang digital untuk memberikan pelayanan terbaik,
                        memantau kesehatan, dan menjaga kebahagiaan setiap lansia.
                    </p>

                    {/* Card */}
                    <div style={{
                        padding: '18px 20px', borderRadius: 16,
                        border: '1px solid rgba(255,255,255,.08)',
                        background: 'rgba(255,255,255,.04)',
                        display: 'flex', alignItems: 'center', gap: 16,
                    }}>
                        <div style={{
                            width: 46, height: 46, borderRadius: 12,
                            background: 'rgba(147,197,253,.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#93c5fd" stroke="none">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>Setiap lansia berarti.</div>
                            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>
                                Perawatan penuh perhatian, setiap hari.
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 12, marginTop: 24,
                    }}>
                        {[
                            { value: '35+', label: 'Penghuni' },
                            { value: '12',  label: 'Perawat' },
                            { value: '20',  label: 'Kamar' },
                        ].map(s => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <p style={{ fontSize: 11, color: '#334155', position: 'relative' }}>
                    &copy; 2026 Griya Lansia &middot; Sistem Informasi Manajemen
                </p>
            </div>

            {/* ── Panel Kanan ────────────────────────────────────── */}
            <div style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px 48px',
            }}>
                <div style={{ width: '100%', maxWidth: 440 }}>

                    {/* Header */}
                    <div style={{ marginBottom: 32 }}>
                        <span style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '2px',
                            color: '#3b82f6', textTransform: 'uppercase',
                        }}>
                            SELAMAT DATANG
                        </span>
                        <h2 style={{
                            fontSize: 26, fontWeight: 800, color: '#0f172a',
                            margin: '10px 0 6px', letterSpacing: '-.4px',
                        }}>
                            Masuk ke akun Anda
                        </h2>
                        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                            Silakan pilih peran dan masukkan kredensial Anda.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* ── Role Selector ── */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>Masuk sebagai</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {ROLES.map((r) => (
                                    <button
                                        key={r.id} type="button"
                                        onClick={() => { setRole(r.id); setEmail(''); }}
                                        style={{
                                            padding: '12px 10px', borderRadius: 12,
                                            textAlign: 'left', cursor: 'pointer',
                                            border: role === r.id
                                                ? '2px solid #3b82f6'
                                                : '1.5px solid #e2e8f0',
                                            background: role === r.id ? '#eff6ff' : '#fff',
                                            transition: 'all .15s',
                                            boxShadow: role === r.id
                                                ? '0 0 0 3px rgba(59,130,246,.1)'
                                                : 'none',
                                        }}
                                    >
                                        <div style={{
                                            fontSize: 12, fontWeight: 700,
                                            color: role === r.id ? '#1d4ed8' : '#374151',
                                        }}>
                                            {r.label}
                                        </div>
                                        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>
                                            {r.desc}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Email ── */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Alamat Email</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: 13, top: '50%',
                                    transform: 'translateY(-50%)', pointerEvents: 'none',
                                }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                        stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <input
                                    type="email" required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={hints[role]}
                                    autoComplete="username"
                                    style={{
                                        ...inputBase,
                                        paddingLeft: 38,
                                        borderColor: errors.email ? '#f87171' : '#e2e8f0',
                                        background: errors.email ? '#fff5f5' : '#fff',
                                    }}
                                />
                            </div>
                            {errors.email && <p style={errorText}>{errors.email[0]}</p>}
                        </div>

                        {/* ── Password ── */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <label style={labelStyle}>Kata Sandi</label>
                                <span style={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer' }}>
                                    Lupa password?
                                </span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: 13, top: '50%',
                                    transform: 'translateY(-50%)', pointerEvents: 'none',
                                }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                        stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                                    </svg>
                                </div>
                                <input
                                    type={showPass ? 'text' : 'password'} required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi"
                                    autoComplete="current-password"
                                    style={{
                                        ...inputBase,
                                        paddingLeft: 38,
                                        paddingRight: 80,
                                        borderColor: errors.password ? '#f87171' : '#e2e8f0',
                                        background: errors.password ? '#fff5f5' : '#fff',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 11, fontWeight: 700,
                                        color: showPass ? '#3b82f6' : '#9ca3af',
                                        padding: '2px 6px',
                                    }}
                                >
                                    {showPass ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                            {errors.password && <p style={errorText}>{errors.password[0]}</p>}
                        </div>

                        {/* ── Global Error ── */}
                        {firstError && !errors.email && !errors.password && (
                            <div style={{
                                marginBottom: 18, padding: '12px 16px', borderRadius: 10,
                                background: '#fef2f2', border: '1px solid #fecaca',
                                color: '#b91c1c', fontSize: 13, display: 'flex',
                                alignItems: 'center', gap: 8,
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                {firstError}
                            </div>
                        )}

                        {/* ── Submit ── */}
                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '13px 20px',
                                borderRadius: 12, border: 'none',
                                background: loading
                                    ? '#bfdbfe'
                                    : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                                color: '#fff', fontWeight: 700, fontSize: 14,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all .2s',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 8,
                                boxShadow: loading ? 'none' : '0 4px 14px rgba(59,130,246,.35)',
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round" strokeLinejoin="round"
                                        style={{ animation: 'spin 1s linear infinite' }}>
                                        <line x1="12" y1="2" x2="12" y2="6"/>
                                        <line x1="12" y1="18" x2="12" y2="22"/>
                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                                        <line x1="2" y1="12" x2="6" y2="12"/>
                                        <line x1="18" y1="12" x2="22" y2="12"/>
                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Masuk ke Dashboard
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 7, marginTop: 24, fontSize: 12, color: '#94a3b8',
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                        Akses aman untuk pengguna terdaftar
                    </div>

                    {/* Dev hint */}
                    <div style={{
                        marginTop: 20, padding: '12px 16px', borderRadius: 12,
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        fontSize: 11, color: '#64748b', lineHeight: 1.8,
                    }}>
                        <strong style={{ color: '#475569' }}>Akun Demo:</strong>{' '}
                        admin@griyalansia.id &nbsp;|&nbsp;
                        staff@griyalansia.id &nbsp;|&nbsp;
                        keluarga@griyalansia.id
                        <br />
                        <strong style={{ color: '#475569' }}>Password:</strong> password
                    </div>

                    {/* Spin animation */}
                    <style>{`
                        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    fontSize: 12, fontWeight: 700, color: '#374151',
    display: 'block', marginBottom: 6,
};

const inputBase = {
    width: '100%', padding: '11px 14px', fontSize: 13,
    border: '1.5px solid #e2e8f0', borderRadius: 10,
    outline: 'none', boxSizing: 'border-box',
    color: '#1e293b', transition: 'border-color .15s',
};

const errorText = {
    marginTop: 5, fontSize: 11, color: '#ef4444',
    display: 'flex', alignItems: 'center', gap: 4,
};
