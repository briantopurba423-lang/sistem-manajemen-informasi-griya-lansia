import React from 'react';

export default function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1);
    const visible = pages.filter(p => p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 1);

    return (
        <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
                Menampilkan {meta.from}–{meta.to} dari {meta.total} data
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(meta.current_page - 1)}
                    disabled={meta.current_page === 1}
                    className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    ‹
                </button>
                {visible.reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push(<span key={`gap-${p}`} className="px-2 text-gray-400">…</span>);
                    acc.push(
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                p === meta.current_page
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >{p}</button>
                    );
                    return acc;
                }, [])}
                <button
                    onClick={() => onPageChange(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page}
                    className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    ›
                </button>
            </div>
        </div>
    );
}
