import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '../dashboard/PageLayout';
import Modal from '../ui/Modal';
import { api } from '../../lib/api';

export default function KamarPage() {
    const [rooms, setRooms]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [q, setQ]                   = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [residents, setResidents]   = useState([]);
    const [loadingRes, setLoadingRes] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ ...(q && { q }) });
        api.get(`/api/kamar?${params}`)
            .then(d => setRooms(d.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [q]);

    useEffect(() => { load(); }, [load]);

    function viewRoom(room) {
        setSelectedRoom(room);
        setLoadingRes(true);
        api.get(`/api/kamar/${encodeURIComponent(room)}/residents`)
            .then(d => setResidents(d))
            .catch(() => setResidents([]))
            .finally(() => setLoadingRes(false));
    }

    const occupied = rooms.filter(r => r.penghuni_aktif > 0).length;
    const empty    = rooms.filter(r => r.penghuni_aktif === 0).length;

    return (
        <PageLayout active="Data Kamar" title="Data Kamar" subtitle="Pantau status hunian kamar">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Kamar', value: rooms.length, color: '#1e2a3a' },
                    { label: 'Kamar Terisi', value: occupied, color: '#2d6a4f' },
                    { label: 'Kamar Kosong', value: empty, color: '#9b5917' },
                ].map(c => (
                    <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.color + '20' }}>
                            <svg className="w-5 h-5" fill="none" stroke={c.color} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{c.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{c.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
                        placeholder="Cari nomor kamar..."
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                </div>
            </div>

            {/* Room Grid */}
            {loading ? (
                <p className="text-center text-gray-400 py-12">Memuat data...</p>
            ) : rooms.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-400">Belum ada data kamar. Data kamar otomatis muncul ketika lansia ditambahkan dengan nomor kamar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {rooms.map(room => (
                        <button
                            key={room.room}
                            onClick={() => viewRoom(room.room)}
                            className={`p-4 rounded-xl border-2 text-center transition hover:shadow-md ${
                                room.penghuni_aktif > 0
                                    ? 'border-green-200 bg-green-50 hover:border-green-400'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <div className={`text-2xl font-bold mb-1 ${room.penghuni_aktif > 0 ? 'text-green-800' : 'text-gray-400'}`}>
                                {room.room}
                            </div>
                            <div className="text-xs text-gray-500">{room.penghuni_aktif} penghuni</div>
                            <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                room.penghuni_aktif > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {room.penghuni_aktif > 0 ? 'Terisi' : 'Kosong'}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Room Detail Modal */}
            <Modal open={!!selectedRoom} onClose={() => setSelectedRoom(null)} title={`Kamar ${selectedRoom} — Penghuni Aktif`}>
                {loadingRes ? (
                    <p className="text-center text-gray-400 py-6">Memuat...</p>
                ) : residents.length === 0 ? (
                    <p className="text-center text-gray-400 py-6">Tidak ada penghuni aktif di kamar ini.</p>
                ) : (
                    <div className="space-y-3">
                        {residents.map(r => (
                            <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                                    style={{ backgroundColor: '#2d3a4a' }}>
                                    {r.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{r.name}</p>
                                    <p className="text-xs text-gray-500">{r.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </PageLayout>
    );
}
