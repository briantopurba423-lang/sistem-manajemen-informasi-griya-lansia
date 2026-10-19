import React, { useState } from 'react';

const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Fasilitas', href: '#fasilitas' },
    { label: 'Mengapa Kami', href: '#mengapa-kami' },
    { label: 'Testimoni', href: '#testimoni' },
    { label: 'Kontak', href: '#kontak' },
];

export default function Navbar({ scrolled }) {
    const [open, setOpen] = useState(false);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#beranda" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <p className={`font-bold text-lg leading-none ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            Griya Lansia
                        </p>
                        <p className={`text-xs leading-none mt-0.5 ${scrolled ? 'text-emerald-600' : 'text-emerald-200'}`}>
                            Panti Jompo Terpadu
                        </p>
                    </div>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                                scrolled ? 'text-gray-600' : 'text-white/90'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="/login"
                        className="ml-2 px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow"
                    >
                        Masuk Sistem
                    </a>
                </nav>

                {/* Mobile Hamburger */}
                <button
                    className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 pb-4 pt-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-600 border-b border-gray-50"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="/login"
                        className="mt-3 block text-center px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Masuk Sistem
                    </a>
                </div>
            )}
        </header>
    );
}
