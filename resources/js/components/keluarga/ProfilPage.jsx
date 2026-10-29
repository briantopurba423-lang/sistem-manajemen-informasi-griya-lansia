import React from 'react';

const statusColor = { aktif: 'bg-green-100 text-green-700', tidak_aktif: 'bg-yellow-100 text-yellow-700', meninggal: 'bg-red-100 text-red-600' };
const genderLabel = { L: 'Laki-laki', P: 'Perempuan' };

export default function ProfilPage({ data }) {
    const r = data?.resident;

    if (!r) {
        return <p className="text-gray-400 text-center py-12">Memuat profil...</p>;
    }

    const rows = [
        ['Nama Lengkap', r.name],
        ['NIK', r.nik || '-'],
        ['Jenis Kelamin', genderLabel[r.gender] || '-'],
        ['Tanggal Lahir', r.birth_date ? new Date(r.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'],
        ['Usia', r.age ? `${r.age} tahun` : '-'],
        ['Nomor Kamar', r.room || '-'],
        ['Alamat Asal', r.address || '-'],
        ['Nama Keluarga', r.family_name || '-'],
        ['Telepon Keluarga', r.family_phone || '-'],
    ];

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 flex items-center gap-5" style={{ background: 'linear-gradient(135deg, #1e2a3a 0%, #2d3f55 100%)' }}>
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{r.name}</h2>
                        <p className="text-sm text-white/70 mt-0.5">Kamar {r.room || '-'}</p>
                        <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status]}`}>
                            {r.status === 'aktif' ? 'Aktif' : r.status}
                        </span>
                    </div>
                </div>

                {/* Detail rows */}
                <div className="divide-y divide-gray-100">
                    {rows.map(([label, val]) => (
                        <div key={label} className="flex items-start px-6 py-3.5">
                            <span className="w-44 text-sm text-gray-500 flex-shrink-0">{label}</span>
                            <span className="text-sm font-medium text-gray-800">{val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            {r.notes && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Catatan
                    </h4>
                    <p className="text-sm text-gray-700">{r.notes}</p>
                </div>
            )}
        </div>
    );
}
