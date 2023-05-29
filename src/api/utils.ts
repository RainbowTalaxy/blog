import { getUser } from '../utils/user';

export enum APIKey {
    file = 'fileApiKey',
}

const getKey = (key: APIKey) => {
    const user = getUser();
    return user[key] ?? '';
};

export const rocket = {
    async get<Data>(url: string, query?: any) {
        const res = await fetch(
            url + (query ? `?${new URLSearchParams(query)}` : ''),
        );
        const result: Data = await res.json();
        return result;
    },
    async post<Data>(url: string, data: any, key?: APIKey) {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Authorization: key && `${key}=${getKey(key)}`,
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        return result;
    },
    async put<Data>(url: string, data: any, key?: APIKey) {
        const res = await fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Authorization: key && `${key}=${getKey(key)}`,
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        return result;
    },
};
