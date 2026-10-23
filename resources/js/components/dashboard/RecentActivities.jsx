import React from 'react';

export default function RecentActivities({ activities }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 className="text-base font-semibold text-gray-700">Kegiatan Terbaru</h2>
                </div>
                <a href="/kegiatan" className="text-sm font-medium hover:underline" style={{ color: '#4a7fa5' }}>
                    Lihat Semua
                </a>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-2 text-left font-medium text-gray-500 pr-4">Tanggal</th>
                            <th className="pb-2 text-left font-medium text-gray-500 pr-4">Kegiatan</th>
                            <th className="pb-2 text-left font-medium text-gray-500 pr-4">Peserta</th>
                            <th className="pb-2 text-left font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities && activities.length > 0 ? (
                            activities.map((a, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0">
                                    <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">{a.date}</td>
                                    <td className="py-2.5 pr-4 text-gray-700 font-medium">{a.activity}</td>
                                    <td className="py-2.5 pr-4 text-gray-600">{a.peserta}</td>
                                    <td className="py-2.5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Placeholder rows when no data
                            [
                                { date: '24 Okt 2024', activity: 'Senam Pagi', peserta: '28 lansia', status: 'Selesai' },
                                { date: '23 Okt 2024', activity: 'Pemeriksaan Kesehatan Rutin', peserta: '24 lansia', status: 'Selesai' },
                                { date: '22 Okt 2024', activity: 'Terapi Rekreasi', peserta: '20 lansia', status: 'Selesai' },
                                { date: '21 Okt 2024', activity: 'Penyuluhan Gizi', peserta: '30 lansia', status: 'Selesai' },
                                { date: '20 Okt 2024', activity: 'Ibadah Bersama', peserta: '25 lansia', status: 'Selesai' },
                            ].map((a, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0">
                                    <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">{a.date}</td>
                                    <td className="py-2.5 pr-4 text-gray-700 font-medium">{a.activity}</td>
                                    <td className="py-2.5 pr-4 text-gray-600">{a.peserta}</td>
                                    <td className="py-2.5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
