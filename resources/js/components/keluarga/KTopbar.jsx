import React, { useState } from 'react';

export default function KTopbar({ user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    async function handleLogout() {
        await fetch('/logout', {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
        });
        window.location.href = '/login';
    }

    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Empty left */}
            <div />

            {/* Right */}
            <div className="flex items-center gap-4">
                {/* Date/time badge */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                        <div className="font-medium text-gray-700">{dateStr}</div>
                        <div>{timeStr}</div>
                    </div>
                </div>

                {/* Notification */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg hover:bg-gray-100 transition"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                            {user ? user.name.charAt(0).toUpperCase() : 'K'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">Keluarga</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                            <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-100">
                                {user?.name ?? 'Keluarga'}
                            </div>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
