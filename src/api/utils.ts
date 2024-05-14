import { rawFetch } from '../utils/fetch';

/** @deprecated */
export const rocket = {
    async get<Data>(url: string, query?: any) {
        const res = await fetch(
            url + (query ? `?${new URLSearchParams(query)}` : ''),
        );
        const result: Data = await res.json();
        return result;
    },
    async post<Data>(url: string, data?: any) {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        return result;
    },
    async put<Data>(url: string, data?: any) {
        const res = await fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        return result;
    },
    async delete<Data>(url: string, data?: any) {
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        return result;
    },
};

async function request<Data>(url: string, method: string, data: any = {}) {
    return await rawFetch<Data>(url, method, data);
}

export const rocketV2 = {
    async get<Data>(url: string, query?: any) {
        return await rawFetch<Data>(url, 'GET', query);
    },
    async post<Data>(url: string, data: any = {}) {
        return await request<Data>(url, 'POST', data);
    },
    async put<Data>(url: string, data: any = {}) {
        return await request<Data>(url, 'PUT', data);
    },
    async delete<Data>(url: string, data: any = {}) {
        return await request<Data>(url, 'DELETE', data);
    },
};
