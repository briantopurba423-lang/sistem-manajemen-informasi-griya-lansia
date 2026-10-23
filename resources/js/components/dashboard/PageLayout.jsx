import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function PageLayout({ active, title, subtitle, children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/me', { headers: { 'Accept': 'application/json' } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.user) setUser(d.user); })
            .catch(() => {});
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar active={active} />
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar user={user} />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
