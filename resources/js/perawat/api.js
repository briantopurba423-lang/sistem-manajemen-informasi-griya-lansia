// Axios-free fetch wrapper — compatible with Laravel session auth
const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content ?? '';

async function request(method, url, body = null) {
    const fullUrl = url.startsWith('/') ? url : '/api/' + url;
    const opts = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(fullUrl, opts);

    if (res.status === 401) {
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

    return { data };
}

const api = {
    get:    (url)       => request('GET', url),
    post:   (url, body) => request('POST', url, body),
    put:    (url, body) => request('PUT', url, body),
    patch:  (url, body) => request('PATCH', url, body),
    delete: (url)       => request('DELETE', url),
};

export default api;
