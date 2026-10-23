import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '../dashboard/PageLayout';
import Modal from '../ui/Modal';
import Pagination from '../ui/Pagination';
import { api } from '../../lib/api';

const roleLabel = { admin: 'Admin', staff: 'Staff' };
const roleColor = { admin: 'bg-purple-100 text-purple-700', staff: 'bg-blue-100 text-blue-700' };
const emptyForm = { name: '', email: '', password: '', role: 'staff' };

export default function PegawaiPage() {
    const [data, setData]         = useState([]);
    const [meta, setMeta]         = useState(null);
    const [page, setPage]         = useState(1);
    const [q, setQ]               = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading]   = useState(true);
    const [modal, setModal]       = useState(false);
    const [editing, setEditing]   = useState(null);
    const [form, setForm]         = useState(emptyForm);
    const [errors, setErrors]     = useState({});
    const [saving, setSaving]     = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ page, ...(q && { q }), ...(roleFilter && { role: roleFilter }) });
        api.get(`/api/pegawai?${params}`)
            .then(d => { setData(d.data); setMeta(d.meta); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page, q, roleFilter]);

    useEffect(() => { load(); }, [load]);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setErrors({});
        setModal(true);
    }

    function openEdit(item) {
        setEditing(item);
        setForm({ name: item.name, email: item.email, password: '', role: item.role });
        setErrors({});
        setModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            if (editing) {
                await api.put(`/api/pegawai/${editing.id}`, form);
            } else {
                await api.post('/api/pegawai', form);
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
        await api.delete(`/api/pegawai/${id}`);
        setDeleteId(null);
        load();
    }

    const inp = (label, name, type = 'text', hint = '') => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                placeholder={hint}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name][0]}</p>}
        </div>
    );

    return (
        <PageLayout active="Data Pegawai" title="Data Pegawai" subtitle="Kelola akun dan peran pegawai">
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-48">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Cari nama atau email..."
                        value={q}
                        onChange={e => { setQ(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none"
                >
                    <option value="">Semua Peran</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                </select>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                    style={{ backgroundColor: '#1e2a3a' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Pegawai
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                {['Nama', 'Email', 'Peran', 'Bergabung', 'Aksi'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Memuat data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Belum ada data pegawai.</td></tr>
                            ) : data.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                                                style={{ backgroundColor: '#2d3a4a' }}>
                                                {item.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{item.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor[item.role]}`}>
                                            {roleLabel[item.role]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString('id-ID')}
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

            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {inp('Nama Lengkap *', 'name')}
                        {inp('Email *', 'email', 'email')}
                        {inp(editing ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *', 'password', 'password', '••••••••')}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peran *</label>
                            <select
                                value={form.role}
                                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none"
                            >
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
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

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
                <p className="text-sm text-gray-600 mb-6">Yakin ingin menghapus data pegawai ini?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition">Batal</button>
                    <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Hapus</button>
                </div>
            </Modal>
        </PageLayout>
    );
}
