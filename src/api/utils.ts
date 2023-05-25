enum APIKey {
    file = 'fileApiKey',
}

export const rocket = {
    async get<Data>(url: string, query?: any) {
        const res = await fetch(
            url + (query ? `?${new URLSearchParams(query)}` : ''),
        );
        const result: Data = await res.json();
        return result;
    },
    async post<Data>(url: string, data: any, key: APIKey) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `${key}=${localStorage.getItem(key)}`,
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        return result;
    },
};
