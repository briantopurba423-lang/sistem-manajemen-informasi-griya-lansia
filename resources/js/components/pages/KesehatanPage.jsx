import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '../dashboard/PageLayout';
import Modal from '../ui/Modal';
import Pagination from '../ui/Pagination';
import { api } from '../../lib/api';

const emptyForm = {
    resident_id: '', check_date: new Date().toISOString().slice(0, 10),
    blood_pressure_systolic: '', blood_pressure_diastolic: '',
    heart_rate: '', temperature: '', weight: '', blood_sugar: '',
    diagnosis: '', treatment: '', notes: '',
};

function BPBadge({ sys, dia }) {
    if (!sys || !dia) return <span className="text-gray-400">-</span>;
    const val = Number(sys);
    const color = val >= 140 ? 'text-red-600' : val >= 120 ? 'text-yellow-600' : 'text-green-600';
    return <span className={`font-medium ${color}`}>{sys}/{dia}</span>;
}

export default function KesehatanPage() {
    const [data, setData]           = useState([]);
    const [meta, setMeta]           = useState(null);
    const [page, setPage]           = useState(1);
    const [q, setQ]                 = useState('');
    const [loading, setLoading]     = useState(true);
    const [residents, setResidents] = useState([]);
    const [modal, setModal]         = useState(false);
    const [editing, setEditing]     = useState(null);
    const [form, setForm]           = useState(emptyForm);
    const [errors, setErrors]       = useState({});
    const [saving, setSaving]       = useState(false);
    const [deleteId, setDeleteId]   = useState(null);
    const [viewItem, setViewItem]   = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page, ...(q && { q }) });
        api.get(`/api/kesehatan?${params}`)
            .then(d => { setData(d.data); setMeta(d.meta); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page, q]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        api.get('/api/kesehatan-residents')
            .then(d => setResidents(d))
            .catch(() => {});
    }, []);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setModal(true);
    }

    function openEdit(item) {
        setEditing(item);
        setForm({
            resident_id: item.resident_id,
            check_date: item.check_date?.slice(0, 10) ?? '',
            blood_pressure_systolic: item.blood_pressure_systolic ?? '',
            blood_pressure_diastolic: item.blood_pressure_diastolic ?? '',
            heart_rate: item.heart_rate ?? '',
            temperature: item.temperature ?? '',
            weight: item.weight ?? '',
            blood_sugar: item.blood_sugar ?? '',
            diagnosis: item.diagnosis ?? '',
            treatment: item.treatment ?? '',
            notes: item.notes ?? '',
        });
        setErrors({});
        setModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            if (editing) {
                await api.put(`/api/kesehatan/${editing.id}`, form);
            } else {
                await api.post('/api/kesehatan', form);
            }
            setModal(false);
            load();
        } catch (err) {
            setErrors(err.errors ?? {});
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        await api.delete(`/api/kesehatan/${id}`);
        setDeleteId(null);
        load();
    }

    const inp = (label, name, type = 'text', half = false) => (
        <div className={half ? '' : ''}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {errors[name] && <p className="mt-0.5 text-xs text-red-600">{errors[name][0]}</p>}
        </div>
    );

    const textarea = (label, name) => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <textarea
                rows={2}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
        </div>
    );

    return (
        <PageLayout active="Kesehatan" title="Rekam Kesehatan" subtitle="Pantau dan catat kondisi kesehatan penghuni">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-48">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Cari nama lansia..."
                        value={q}
                        onChange={e => { setQ(e.target.value); setPage(1); }}
                    />
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                    style={{ backgroundColor: '#1e2a3a' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Catat Pemeriksaan
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                {['Tanggal', 'Lansia', 'Kamar', 'TD (mmHg)', 'Nadi', 'Suhu', 'BB (kg)', 'Gula Darah', 'Aksi'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Memuat data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Belum ada rekam kesehatan.</td></tr>
                            ) : data.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {item.check_date ? new Date(item.check_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.resident?.name ?? '-'}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.resident?.room ?? '-'}</td>
                                    <td className="px-4 py-3"><BPBadge sys={item.blood_pressure_systolic} dia={item.blood_pressure_diastolic} /></td>
                                    <td className="px-4 py-3 text-gray-600">{item.heart_rate ? `${item.heart_rate} bpm` : '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.temperature ? `${item.temperature}°C` : '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.weight ?? '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.blood_sugar ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setViewItem(item)} className="text-gray-500 hover:text-gray-800 text-xs font-medium">Detail</button>
                                            <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                                            <button onClick={() => setDeleteId(item.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                    <Pagination meta={meta} onPageChange={setPage} />
                </div>
            </div>

            {/* Form Modal */}
            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Rekam Kesehatan' : 'Catat Pemeriksaan Baru'} size="lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Lansia */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Lansia *</label>
                            <select
                                value={form.resident_id}
                                onChange={e => setForm(f => ({ ...f, resident_id: e.target.value }))}
                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.resident_id ? 'border-red-400' : 'border-gray-300'}`}
                            >
                                <option value="">Pilih lansia...</option>
                                {residents.map(r => <option key={r.id} value={r.id}>{r.name} {r.room ? `(Kamar ${r.room})` : ''}</option>)}
                            </select>
                            {errors.resident_id && <p className="mt-0.5 text-xs text-red-600">{errors.resident_id[0]}</p>}
                        </div>
                        {inp('Tanggal Periksa *', 'check_date', 'date')}

                        {/* Vital Signs section */}
                        <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 pt-2 border-t border-gray-100">Tanda-Tanda Vital</p>
                        </div>
                        {inp('TD Sistolik (mmHg)', 'blood_pressure_systolic', 'number')}
                        {inp('TD Diastolik (mmHg)', 'blood_pressure_diastolic', 'number')}
                        {inp('Denyut Nadi (bpm)', 'heart_rate', 'number')}
                        {inp('Suhu Tubuh (°C)', 'temperature', 'number')}
                        {inp('Berat Badan (kg)', 'weight', 'number')}
                        {inp('Gula Darah (mg/dL)', 'blood_sugar')}

                        {/* Diagnosis */}
                        <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 pt-2 border-t border-gray-100">Diagnosis & Tindakan</p>
                        </div>
                        <div className="sm:col-span-2">{textarea('Diagnosis', 'diagnosis')}</div>
                        <div className="sm:col-span-2">{textarea('Tindakan / Treatment', 'treatment')}</div>
                        <div className="sm:col-span-2">{textarea('Catatan Tambahan', 'notes')}</div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">Batal</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: '#1e2a3a' }}>
                            {saving ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Simpan')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Detail Rekam Kesehatan" size="md">
                {viewItem && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#1e2a3a' }}>
                                {viewItem.resident?.name?.charAt(0) ?? '?'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{viewItem.resident?.name}</p>
                                <p className="text-xs text-gray-500">Kamar {viewItem.resident?.room ?? '-'} · {viewItem.check_date ? new Date(viewItem.check_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ['Tekanan Darah', viewItem.blood_pressure_systolic ? `${viewItem.blood_pressure_systolic}/${viewItem.blood_pressure_diastolic} mmHg` : '-'],
                                ['Denyut Nadi', viewItem.heart_rate ? `${viewItem.heart_rate} bpm` : '-'],
                                ['Suhu Tubuh', viewItem.temperature ? `${viewItem.temperature} °C` : '-'],
                                ['Berat Badan', viewItem.weight ? `${viewItem.weight} kg` : '-'],
                                ['Gula Darah', viewItem.blood_sugar || '-'],
                                ['Dicatat Oleh', viewItem.staff?.name ?? '-'],
                            ].map(([label, val]) => (
                                <div key={label} className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                                    <p className="font-semibold text-gray-800 text-sm">{val}</p>
                                </div>
                            ))}
                        </div>
                        {viewItem.diagnosis && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs font-medium text-blue-600 mb-1">Diagnosis</p>
                                <p className="text-sm text-gray-700">{viewItem.diagnosis}</p>
                            </div>
                        )}
                        {viewItem.treatment && (
                            <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-xs font-medium text-green-600 mb-1">Tindakan</p>
                                <p className="text-sm text-gray-700">{viewItem.treatment}</p>
                            </div>
                        )}
                        {viewItem.notes && (
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <p className="text-xs font-medium text-yellow-600 mb-1">Catatan</p>
                                <p className="text-sm text-gray-700">{viewItem.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Confirm Delete */}
            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
                <p className="text-sm text-gray-600 mb-6">Yakin ingin menghapus rekam kesehatan ini?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition">Batal</button>
                    <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Hapus</button>
                </div>
            </Modal>
        </PageLayout>
    );
}
