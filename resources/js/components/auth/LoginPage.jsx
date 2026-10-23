import React, { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [errors, setErrors]     = useState({});
    const [loading, setLoading]   = useState(false);
    const [showPass, setShowPass] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.content ?? '';

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({ email, password, remember }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Laravel validation errors
                setErrors(data.errors ?? { email: [data.message ?? 'Login gagal.'] });
                return;
            }

            // Redirect ke dashboard
            window.location.href = data.redirect ?? '/dashboard';
        } catch {
            setErrors({ email: ['Terjadi kesalahan. Coba lagi.'] });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#f0f4f8' }}>
            {/* Left panel - branding */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
                style={{ backgroundColor: '#1e2a3a' }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#2d3f55' }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg leading-tight">Griya Lansia</div>
                        <div className="text-xs" style={{ color: '#8fa8c8' }}>Sistem Informasi Manajemen</div>
                    </div>
                </div>

                {/* Center illustration text */}
                <div>
                    <h1 className="text-3xl font-bold text-white leading-snug mb-4">
                        Kelola Hunian Lansia<br />dengan Lebih Mudah
                    </h1>
                    <p style={{ color: '#8fa8c8' }} className="text-sm leading-relaxed">
                        Platform manajemen terpadu untuk memantau kesehatan,
                        kegiatan, dan kesejahteraan penghuni Griya Lansia secara
                        real-time dan efisien.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {['Data Lansia', 'Rekam Kesehatan', 'Jadwal Kegiatan', 'Laporan'].map((f) => (
                            <span key={f}
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: '#2d3f55', color: '#8fa8c8' }}>
                                {f}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: '35+', label: 'Penghuni Aktif' },
                        { value: '12', label: 'Tenaga Perawat' },
                        { value: '20', label: 'Kamar Tersedia' },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-2xl font-bold text-white">{s.value}</div>
                            <div className="text-xs mt-0.5" style={{ color: '#8fa8c8' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#1e2a3a' }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-800">Griya Lansia</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h2>
                        <p className="text-sm text-gray-500 mb-7">
                            Masuk ke panel administrasi Griya Lansia
                        </p>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@griyalansia.id"
                                        autoComplete="email"
                                        required
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.email
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300 bg-white focus:border-blue-400'
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd" />
                                        </svg>
                                        {errors.email[0]}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs font-medium" style={{ color: '#4a7fa5' }}>
                                        Lupa password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            errors.password
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300 bg-white focus:border-blue-400'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                        tabIndex={-1}
                                    >
                                        {showPass ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.password[0]}</p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2 mb-6">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                    style={{ accentColor: '#2d3a4a' }}
                                />
                                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                                    Ingat saya
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ backgroundColor: loading ? '#4a6a8a' : '#1e2a3a' }}
                                onMouseOver={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2d3f55'; }}
                                onMouseOut={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#1e2a3a'; }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Back to home */}
                    <p className="text-center mt-5 text-sm text-gray-500">
                        <a href="/" className="hover:text-gray-700 transition flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke halaman utama
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
