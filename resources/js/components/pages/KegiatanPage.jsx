import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '../dashboard/PageLayout';
import Modal from '../ui/Modal';
import Pagination from '../ui/Pagination';
import { api } from '../../lib/api';

const categoryLabel = { fisik: 'Fisik', sosial: 'Sosial', rohani: 'Rohani', edukasi: 'Edukasi', lainnya: 'Lainnya' };
const categoryColor = {
    fisik:   'bg-blue-100 text-blue-700',
    sosial:  'bg-green-100 text-green-700',
    rohani:  'bg-purple-100 text-purple-700',
    edukasi: 'bg-yellow-100 text-yellow-700',
    lainnya: 'bg-gray-100 text-gray-600',
};
const participasiColor = {
    aktif:       'bg-green-100 text-green-700',
    pasif:       'bg-yellow-100 text-yellow-700',
    tidak_hadir: 'bg-red-100 text-red-600',
};
const participasiLabel = { aktif: 'Aktif', pasif: 'Pasif', tidak_hadir: 'Tidak Hadir' };

const emptyForm = {
    resident_id: '', activity_name: '', category: 'fisik',
    activity_date: new Date().toISOString().slice(0, 10),
    start_time: '', end_time: '', participation: 'aktif', notes: '',
};

export default function KegiatanPage() {
    const [data, setData]           = useState([]);
    const [meta, setMeta]           = useState(null);
    const [page, setPage]           = useState(1);
    const [q, setQ]                 = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [loading, setLoading]     = useState(true);
    const [residents, setResidents] = useState([]);
    const [modal, setModal]         = useState(false);
    const [editing, setEditing]     = useState(null);
    const [form, setForm]           = useState(emptyForm);
    const [errors, setErrors]       = useState({});
    const [saving, setSaving]       = useState(false);
    const [deleteId, setDeleteId]   = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page, ...(q && { q }), ...(catFilter && { category: catFilter }) });
        api.get(`/api/kegiatan?${params}`)
            .then(d => { setData(d.data); setMeta(d.meta); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page, q, catFilter]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        api.get('/api/kegiatan-residents')
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
            resident_id:   item.resident_id,
            activity_name: item.activity_name,
            category:      item.category,
            activity_date: item.activity_date?.slice(0, 10) ?? '',
            start_time:    item.start_time ?? '',
            end_time:      item.end_time ?? '',
            participation: item.participation,
            notes:         item.notes ?? '',
        });
        setErrors({});
        setModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            editing
                ? await api.put(`/api/kegiatan/${editing.id}`, form)
                : await api.post('/api/kegiatan', form);
            setModal(false);
            load();
        } catch (err) {
            setErrors(err.errors ?? {});
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        await api.delete(`/api/kegiatan/${id}`);
        setDeleteId(null);
        load();
    }

    const inp = (label, name, type = 'text') => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors[name] && <p className="mt-0.5 text-xs text-red-600">{errors[name][0]}</p>}
        </div>
    );

    const sel = (label, name, options) => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <select
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
            >
                {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
            {errors[name] && <p className="mt-0.5 text-xs text-red-600">{errors[name][0]}</p>}
        </div>
    );

    return (
        <PageLayout active="Kegiatan" title="Kegiatan" subtitle="Kelola jadwal dan rekap kegiatan lansia">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-48">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Cari nama kegiatan..."
                        value={q}
                        onChange={e => { setQ(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    value={catFilter}
                    onChange={e => { setCatFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none"
                >
                    <option value="">Semua Kategori</option>
                    {Object.entries(categoryLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: '#1e2a3a' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kegiatan
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                {['Tanggal', 'Nama Kegiatan', 'Kategori', 'Waktu', 'Lansia', 'Partisipasi', 'Aksi'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Memuat data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Belum ada data kegiatan.</td></tr>
                            ) : data.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {item.activity_date ? new Date(item.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.activity_name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor[item.category] ?? ''}`}>
                                            {categoryLabel[item.category] ?? item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {item.start_time ? `${item.start_time.slice(0,5)}${item.end_time ? ' - ' + item.end_time.slice(0,5) : ''}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{item.resident?.name ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${participasiColor[item.participation] ?? ''}`}>
                                            {participasiLabel[item.participation] ?? item.participation}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
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
            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Kegiatan' : 'Tambah Kegiatan'} size="lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Lansia *</label>
                            <select
                                value={form.resident_id}
                                onChange={e => setForm(f => ({ ...f, resident_id: e.target.value }))}
                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${errors.resident_id ? 'border-red-400' : 'border-gray-300'}`}
                            >
                                <option value="">Pilih lansia...</option>
                                {residents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            {errors.resident_id && <p className="mt-0.5 text-xs text-red-600">{errors.resident_id[0]}</p>}
                        </div>
                        <div className="sm:col-span-2">{inp('Nama Kegiatan *', 'activity_name')}</div>
                        {sel('Kategori *', 'category', Object.entries(categoryLabel).map(([v, l]) => ({ v, l })))}
                        {inp('Tanggal *', 'activity_date', 'date')}
                        {inp('Jam Mulai', 'start_time', 'time')}
                        {inp('Jam Selesai', 'end_time', 'time')}
                        {sel('Partisipasi *', 'participation', Object.entries(participasiLabel).map(([v, l]) => ({ v, l })))}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Catatan</label>
                            <textarea
                                rows={2}
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">Batal</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: '#1e2a3a' }}>
                            {saving ? 'Menyimpan...' : (editing ? 'Simpan' : 'Tambah')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete */}
            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
                <p className="text-sm text-gray-600 mb-6">Yakin ingin menghapus data kegiatan ini?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100">Batal</button>
                    <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">Hapus</button>
                </div>
            </Modal>
        </PageLayout>
    );
}
