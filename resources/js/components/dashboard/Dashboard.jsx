import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import StatsCard from './StatsCard';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import RecentActivities from './RecentActivities';
import QuickAccess from './QuickAccess';

// Default / fallback data when API has no records yet
const defaultStats = {
    total_residents: 35,
    resident_diff: 2,
    total_staff: 12,
    staff_diff: 1,
    total_rooms: 20,
    rooms_diff: 0,
    activities_month: 8,
    activities_month_diff: 3,
};

const defaultResidentsPerMonth = [
    { month: 'Jan', count: 20 },
    { month: 'Feb', count: 23 },
    { month: 'Mar', count: 22 },
    { month: 'Apr', count: 25 },
    { month: 'Mei', count: 24 },
    { month: 'Jun', count: 27 },
    { month: 'Jul', count: 28 },
    { month: 'Ags', count: 30 },
    { month: 'Sep', count: 31 },
    { month: 'Okt', count: 33 },
    { month: 'Nov', count: 34 },
    { month: 'Des', count: 35 },
];

const defaultHealthStatus = [
    { label: 'Sehat', value: 18, color: '#2d3a4a' },
    { label: 'Dalam Pemantauan', value: 10, color: '#8fa8c8' },
    { label: 'Perlu Perawatan Intensif', value: 7, color: '#c8d8e8' },
];

const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export default function Dashboard() {
    const [stats, setStats] = useState(defaultStats);
    const [residentsPerMonth, setResidentsPerMonth] = useState(defaultResidentsPerMonth);
    const [healthStatus, setHealthStatus] = useState(defaultHealthStatus);
    const [recentActivities, setRecentActivities] = useState([]);
    const [totalForDonut, setTotalForDonut] = useState(35);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current user
        fetch('/me', {
            headers: { 'Accept': 'application/json' },
        })
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                if (data?.user) setUser(data.user);
            })
            .catch(() => {});

        // Fetch dashboard stats
        fetch('/api/dashboard/stats', {
            headers: { 'Accept': 'application/json' },
        })
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                if (data) {
                    if (data.stats) setStats(data.stats);
                    if (data.residents_per_month?.length) setResidentsPerMonth(data.residents_per_month);
                    if (data.health_status?.length) setHealthStatus(data.health_status);
                    if (data.recent_activities) setRecentActivities(data.recent_activities);
                    if (data.total_for_donut) setTotalForDonut(data.total_for_donut);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const statsCards = [
        {
            label: 'Total Lansia',
            value: stats.total_residents,
            diff: stats.resident_diff,
            icon: (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            label: 'Total Pegawai',
            value: stats.total_staff,
            diff: stats.staff_diff,
            icon: (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            label: 'Total Kamar',
            value: stats.total_rooms,
            diff: stats.rooms_diff,
            icon: (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            label: 'Kegiatan Bulan Ini',
            value: stats.activities_month,
            diff: stats.activities_month_diff,
            icon: (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar active="Dashboard" />

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar user={user} />

                <main className="flex-1 p-6 overflow-auto">
                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Sistem Informasi Manajemen Griya Lansia</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{todayFormatted}</span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        {statsCards.map((card, i) => (
                            <StatsCard key={i} {...card} />
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                        <div className="lg:col-span-3">
                            <BarChart data={residentsPerMonth} />
                        </div>
                        <div className="lg:col-span-2">
                            <DonutChart data={healthStatus} total={totalForDonut} />
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-3">
                            <RecentActivities activities={recentActivities} />
                        </div>
                        <div className="lg:col-span-2">
                            <QuickAccess />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
