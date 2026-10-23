import React, { useEffect, useState } from "react";
import {
    HomeIcon, UsersIcon, HeartIcon, CalIcon,
    StethIcon, SettingsIcon, LogoutIcon, SearchIcon,
    BellIcon, ChevronIcon,
} from "./icons.jsx";
import Dashboard from "./Dashboard.jsx";
import DataLansia from "./DataLansia.jsx";
import Kesehatan from "./Kesehatan.jsx";
import Kegiatan from "./Kegiatan.jsx";
import Pemeriksaan from "./Pemeriksaan.jsx";
import api from "./api.js";

const NAV = [
    { key: "dashboard",    label: "Dashboard",    icon: HomeIcon },
    { key: "lansia",       label: "Data Lansia",  icon: UsersIcon },
    { key: "kesehatan",    label: "Kesehatan",    icon: HeartIcon },
    { key: "pemeriksaan",  label: "Pemeriksaan",  icon: StethIcon },
    { key: "kegiatan",     label: "Kegiatan",     icon: CalIcon },
];

export default function App() {
    const [page, setPage] = useState("dashboard");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch {}
        } else {
            // redirect ke login jika tidak ada token
            if (!localStorage.getItem("auth_token")) {
                window.location.href = "/";
            }
        }
    }, []);

    const logout = async () => {
        try { await api.post("/logout"); } catch {}
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/";
    };

    const initials = user?.name?.split(" ").map((w) => w[0]).slice(0,2).join("").toUpperCase() ?? "P";

    return (
        <div className="pw-layout">
            {/* Sidebar */}
            <aside className="pw-sidebar">
                <div className="pw-sidebar-brand">
                    <div className="pw-sidebar-brand-icon">🏠</div>
                    <div>
                        <h2>Griya Lansia</h2>
                        <p>Sistem Informasi Manajemen</p>
                    </div>
                </div>

                <nav className="pw-nav">
                    {NAV.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            className={`pw-nav-item${page === key ? " active" : ""}`}
                            onClick={() => setPage(key)}
                        >
                            <Icon size={17} />
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="pw-sidebar-footer">
                    <button className="pw-nav-item" onClick={() => setPage("pengaturan")}>
                        <SettingsIcon size={17} /> Pengaturan
                    </button>
                    <button className="pw-nav-item" onClick={logout}>
                        <LogoutIcon size={17} /> Keluar
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="pw-main">
                {/* Topbar */}
                <header className="pw-topbar">
                    <div className="pw-search">
                        <SearchIcon size={15} color="#94a3b8" />
                        <input placeholder="Cari data lansia, kegiatan, atau pemeriksaan..." />
                    </div>
                    <div className="pw-topbar-right">
                        <button className="pw-notif-btn">
                            <BellIcon size={16} />
                            <span className="pw-notif-badge" />
                        </button>
                        <div className="pw-user">
                            <div className="pw-user-avatar">{initials}</div>
                            <div className="pw-user-info">
                                <div className="pw-user-name">{user?.name ?? "Perawat"}</div>
                                <div className="pw-user-role">Perawat/Staff</div>
                            </div>
                            <ChevronIcon size={14} color="#94a3b8" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="pw-content">
                    {page === "dashboard"   && <Dashboard user={user} onNavigate={setPage} />}
                    {page === "lansia"      && <DataLansia />}
                    {page === "kesehatan"   && <Kesehatan />}
                    {page === "pemeriksaan" && <Pemeriksaan />}
                    {page === "kegiatan"    && <Kegiatan />}
                    {page === "pengaturan"  && (
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Pengaturan</h1>
                            <p style={{ color: "#64748b", fontSize: 13 }}>Fitur pengaturan akan segera tersedia.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
