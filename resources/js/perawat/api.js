/**
 * Perawat API — session-based (no Sanctum token).
 * Memetakan URL lama ke web routes yang benar.
 */

const csrf = () =>
    document.querySelector('meta[name="csrf-token"]')?.content ?? '';

// Mapping: path lama → path baru (web routes)
const ROUTE_MAP = {
    '/residents':        '/api/lansia',
    '/examinations':     '/api/examinations',
    '/health-records':   '/api/kesehatan',
    '/daily-activities': '/api/daily-activities',
    '/dashboard':        '/api/dashboard/stats',
    '/laporan/summary':  '/api/laporan/summary',
    '/user':             '/me',
    '/logout':           '/logout',
    '/profile':          '/api/profile',
};

/**
 * Petakan URL ke route web yang benar.
 * Handles: exact match, prefix match, dan URL dengan query string.
 */
function mapUrl(rawUrl) {
    // Pisahkan path dari query string jika ada
    const qIdx     = rawUrl.indexOf('?');
    const path     = qIdx >= 0 ? rawUrl.slice(0, qIdx) : rawUrl;
    const qs       = qIdx >= 0 ? rawUrl.slice(qIdx)    : '';

    // Exact match
    if (ROUTE_MAP[path]) return ROUTE_MAP[path] + qs;

    // Prefix match — contoh: /residents/5 → /api/lansia/5
    for (const [from, to] of Object.entries(ROUTE_MAP)) {
        if (path.startsWith(from + '/')) {
            return to + path.slice(from.length) + qs;
        }
    }

    // Sudah URL absolut atau tidak perlu dipetakan
    return rawUrl;
}

async function request(method, rawUrl, body = null, params = null) {
    let url = mapUrl(rawUrl);

    // Tambahkan query params dari options object (axios compat)
    if (params && Object.keys(params).length > 0) {
        const filtered = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v != null && v !== '')
        );
        if (Object.keys(filtered).length > 0) {
            const qs = new URLSearchParams(filtered).toString();
            url += (url.includes('?') ? '&' : '?') + qs;
        }
    }

    const opts = {
        method,
        headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
    };

    if (body && method !== 'GET') opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);

    if (res.status === 401) {
        window.location.href = '/login';
        return { data: null };
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err    = new Error(data.message ?? 'Terjadi kesalahan.');
        err.response = { data, status: res.status };
        err.errors   = data.errors ?? {};
        throw err;
    }

    // Kembalikan dalam bentuk { data } agar kompatibel dengan kode perawat
    return { data };
}

const api = {
    get:    (url, opts)  => request('GET',    url, null,  opts?.params),
    post:   (url, body)  => request('POST',   url, body),
    put:    (url, body)  => request('PUT',    url, body),
    patch:  (url, body)  => request('PATCH',  url, body),
    delete: (url)        => request('DELETE', url),
};

export default api;
