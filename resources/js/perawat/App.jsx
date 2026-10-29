import React, { useEffect, useState } from "react";
import {
    HomeIcon, UsersIcon, HeartIcon, CalIcon,
    StethIcon, SettingsIcon, LogoutIcon, SearchIcon,
    BellIcon, ChevronIcon, ClipIcon,
} from "./icons.jsx";
import Dashboard from "./Dashboard.jsx";
import DataLansia from "./DataLansia.jsx";
import Kesehatan from "./Kesehatan.jsx";
import Kegiatan from "./Kegiatan.jsx";
import Pemeriksaan from "./Pemeriksaan.jsx";
import Laporan from "./Laporan.jsx";
import Pengaturan from "./Pengaturan.jsx";
import api from "./api.js";

// Nav per role
const NAV_PERAWAT = [
    { key: "dashboard",   label: "Dashboard",   icon: HomeIcon },
    { key: "lansia",      label: "Data Lansia", icon: UsersIcon },
    { key: "kesehatan",   label: "Kesehatan",   icon: HeartIcon },
    { key: "pemeriksaan", label: "Pemeriksaan", icon: StethIcon },
    { key: "kegiatan",    label: "Kegiatan",    icon: CalIcon },
    { key: "laporan",     label: "Laporan",     icon: ClipIcon },
];

const NAV_ADMIN = [
    { key: "dashboard",   label: "Dashboard",   icon: HomeIcon },
    { key: "lansia",      label: "Data Lansia", icon: UsersIcon },
    { key: "kesehatan",   label: "Kesehatan",   icon: HeartIcon },
    { key: "pemeriksaan", label: "Pemeriksaan", icon: StethIcon },
    { key: "kegiatan",    label: "Kegiatan",    icon: CalIcon },
    { key: "laporan",     label: "Laporan",     icon: ClipIcon },
];

const NAV_KELUARGA = [
    { key: "dashboard",   label: "Dashboard",   icon: HomeIcon },
    { key: "kesehatan",   label: "Kesehatan",   icon: HeartIcon },
    { key: "kegiatan",    label: "Kegiatan",    icon: CalIcon },
];

const ROLE_LABEL = {
    admin:    "Administrator",
    perawat:  "Perawat/Staff",
    keluarga: "Keluarga",
};

export default function App() {
    const [page, setPage] = useState("dashboard");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        const token  = localStorage.getItem("auth_token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        if (stored) {
            try { setUser(JSON.parse(stored)); } catch {}
        } else {
            // Fetch user dari API
            api.get("/user").then((r) => {
                setUser(r.data);
                localStorage.setItem("auth_user", JSON.stringify(r.data));
            }).catch(() => {
                localStorage.removeItem("auth_token");
                window.location.href = "/login";
            });
        }
    }, []);

    const logout = async () => {
        try { await api.post("/logout"); } catch {}
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
    };

    const role   = user?.role ?? "perawat";
    const navMap = { admin: NAV_ADMIN, perawat: NAV_PERAWAT, keluarga: NAV_KELUARGA };
    const NAV    = navMap[role] ?? NAV_PERAWAT;
    const initials = user?.name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() ?? "U";

    if (!user) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontFamily: "Inter, sans-serif", color: "#64748b",
            }}>
                Memuat...
            </div>
        );
    }

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
                                <div className="pw-user-name">{user?.name ?? "-"}</div>
                                <div className="pw-user-role">{ROLE_LABEL[role]}</div>
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
                    {page === "laporan"     && <Laporan />}
                    {page === "pengaturan"  && <Pengaturan user={user} onUserUpdate={setUser} />}
                </main>
            </div>
        </div>
    );
}
