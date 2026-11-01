/**
 * Perawat API — session-based (no token needed).
 * Maps old Sanctum endpoint names to the correct web routes.
 */

const csrf = () =>
    document.querySelector('meta[name="csrf-token"]')?.content ?? '';

// Map old Sanctum paths → actual web API paths
const ROUTE_MAP = {
    '/residents':       '/api/lansia',
    '/examinations':    '/api/examinations',
    '/health-records':  '/api/kesehatan',
    '/daily-activities':'/api/daily-activities',
    '/dashboard':       '/api/dashboard/stats',
    '/laporan/summary': '/api/laporan/summary',
    '/user':            '/me',
    '/logout':          '/logout',
    '/profile':         '/api/profile',
};

function mapUrl(url) {
    // Exact match first
    if (ROUTE_MAP[url]) return ROUTE_MAP[url];

    // Prefix match (e.g. /residents/5 → /api/lansia/5)
    for (const [from, to] of Object.entries(ROUTE_MAP)) {
        if (url.startsWith(from + '/')) {
            return to + url.slice(from.length);
        }
    }

    // Already absolute or unmapped — use as-is with /api prefix if needed
    if (url.startsWith('/')) return url;
    return '/api/' + url;
}

async function request(method, url, body = null, params = null) {
    let fullUrl = mapUrl(url);

    // Append query params
    if (params) {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
        ).toString();
        if (qs) fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
    }

    const opts = {
        method,
        headers: {
            'Accept':        'application/json',
            'Content-Type':  'application/json',
            'X-CSRF-TOKEN':  csrf(),
        },
        credentials: 'same-origin',
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(fullUrl, opts);

    if (res.status === 401 || res.status === 403) {
        window.location.href = '/login';
        return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = new Error(data.message ?? 'Terjadi kesalahan.');
        err.response = { data, status: res.status };
        err.errors = data.errors ?? {};
        throw err;
    }

    // Normalise to { data: ... } shape that perawat components expect
    return { data };
}

// Support second argument as options object (for axios compat: api.get(url, { params }))
const api = {
    get:    (url, opts)       => request('GET',    url, null, opts?.params),
    post:   (url, body)       => request('POST',   url, body),
    put:    (url, body)       => request('PUT',    url, body),
    patch:  (url, body)       => request('PATCH',  url, body),
    delete: (url)             => request('DELETE', url),
};

export default api;
