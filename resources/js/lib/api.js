const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content ?? '';

async function request(method, url, body = null) {
    const opts = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf(),
        },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = new Error(data.message ?? 'Terjadi kesalahan.');
        err.errors = data.errors ?? {};
        err.status = res.status;
        throw err;
    }
    return data;
}

export const api = {
    get:    (url)          => request('GET', url),
    post:   (url, body)    => request('POST', url, body),
    put:    (url, body)    => request('PUT', url, body),
    delete: (url)          => request('DELETE', url),
};
