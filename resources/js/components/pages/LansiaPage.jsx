import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '../dashboard/PageLayout';
import Modal from '../ui/Modal';
import Pagination from '../ui/Pagination';
import { api } from '../../lib/api';

const statusLabel = { aktif: 'Aktif', tidak_aktif: 'Tidak Aktif', meninggal: 'Meninggal' };
const statusColor = {
    aktif: 'bg-green-100 text-green-700',
    tidak_aktif: 'bg-yellow-100 text-yellow-700',
    meninggal: 'bg-red-100 text-red-600',
};
const genderLabel = { L: 'Laki-laki', P: 'Perempuan' };

const emptyForm = {
    name: '', nik: '', gender: 'L', birth_date: '', room: '',
    address: '', family_name: '', family_phone: '', status: 'aktif', notes: '',
};

function calcAge(birthDate) {
    if (!birthDate) return '-';
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' th';
}

export default function LansiaPage() {
    const [data, setData]         = useState([]);
    const [meta, setMeta]         = useState(null);
    const [page, setPage]         = useState(1);
    const [q, setQ]               = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading]   = useState(true);
    const [modal, setModal]       = useState(false);
    const [editing, setEditing]   = useState(null);
    const [form, setForm]         = useState(emptyForm);
    const [errors, setErrors]     = useState({});
    const [saving, setSaving]     = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page, ...(q && { q }), ...(statusFilter && { status: statusFilter }) });
        api.get(`/api/lansia?${params}`)
            .then(d => { setData(d.data); setMeta(d.meta); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page, q, statusFilter]);

    useEffect(() => { load(); }, [load]);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setModal(true);
    }

    function openEdit(item) {
        setEditing(item);
        setForm({ ...emptyForm, ...item, birth_date: item.birth_date ? item.birth_date.slice(0, 10) : '' });
        setErrors({});
        setModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            if (editing) {
                await api.put(`/api/lansia/${editing.id}`, form);
            } else {
                await api.post('/api/lansia', form);
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
        await api.delete(`/api/lansia/${id}`);
        setDeleteId(null);
        load();
    }

    const field = (label, name, type = 'text', opts = {}) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {opts.as === 'select' ? (
                <select
                    value={form[name]}
                    onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
                >
                    {opts.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
            ) : opts.as === 'textarea' ? (
                <textarea
                    value={form[name]}
                    onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    rows={2}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
                />
            ) : (
                <input
                    type={type}
                    value={form[name]}
                    onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
                />
            )}
            {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name][0]}</p>}
        </div>
    );

    return (
        <PageLayout active="Data Lansia" title="Data Lansia" subtitle="Kelola data penghuni Griya Lansia">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-48">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Cari nama, NIK, atau kamar..."
                        value={q}
                        onChange={e => { setQ(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none"
                >
                    <option value="">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                    <option value="meninggal">Meninggal</option>
                </select>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                    style={{ backgroundColor: '#1e2a3a' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Lansia
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                {['Nama', 'NIK', 'Gender', 'Usia', 'Kamar', 'Keluarga', 'Status', 'Aksi'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Memuat data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Belum ada data lansia.</td></tr>
                            ) : data.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{item.nik || '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{genderLabel[item.gender]}</td>
                                    <td className="px-4 py-3 text-gray-600">{calcAge(item.birth_date)}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.room || '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.family_name || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[item.status]}`}>
                                            {statusLabel[item.status]}
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
            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Data Lansia' : 'Tambah Lansia Baru'} size="lg">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {field('Nama Lengkap *', 'name')}
                        {field('NIK', 'nik')}
                        {field('Jenis Kelamin *', 'gender', 'text', {
                            as: 'select',
                            options: [{ v: 'L', l: 'Laki-laki' }, { v: 'P', l: 'Perempuan' }],
                        })}
                        {field('Tanggal Lahir', 'birth_date', 'date')}
                        {field('Nomor Kamar', 'room')}
                        {field('Status *', 'status', 'text', {
                            as: 'select',
                            options: [
                                { v: 'aktif', l: 'Aktif' },
                                { v: 'tidak_aktif', l: 'Tidak Aktif' },
                                { v: 'meninggal', l: 'Meninggal' },
                            ],
                        })}
                        {field('Nama Keluarga', 'family_name')}
                        {field('Telepon Keluarga', 'family_phone', 'tel')}
                        <div className="sm:col-span-2">
                            {field('Alamat', 'address', 'text', { as: 'textarea' })}
                        </div>
                        <div className="sm:col-span-2">
                            {field('Catatan', 'notes', 'text', { as: 'textarea' })}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">Batal</button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                            style={{ backgroundColor: '#1e2a3a' }}
                        >
                            {saving ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Tambah Lansia')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete */}
            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
                <p className="text-sm text-gray-600 mb-6">Yakin ingin menghapus data lansia ini? Tindakan ini tidak bisa dibatalkan.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition">Batal</button>
                    <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Hapus</button>
                </div>
            </Modal>
        </PageLayout>
    );
}
