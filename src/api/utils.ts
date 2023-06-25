import { User } from '../modules/user/config';
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
    async post<Data>(url: string, data?: any, key?: APIKey) {
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
    async put<Data>(url: string, data?: any, key?: APIKey) {
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
    async delete<Data>(url: string, data?: any, key?: APIKey) {
        const res = await fetch(url, {
            method: 'DELETE',
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

const getAuth = () => {
    const user = User.config;
    return `id=${user.id};key=${user.key}`;
};

export const rocketV2 = {
    async get<Data>(url: string, query?: any, login: boolean = true) {
        const res = await fetch(
            url + (query ? `?${new URLSearchParams(query)}` : ''),
            {
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: login && getAuth(),
                },
            },
        );
        const result: Data = await res.json();
        if (!res.ok) throw new Error((result as any).error);
        return result;
    },
    async post<Data>(url: string, data: any = {}, login: boolean = true) {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Authorization: login && getAuth(),
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        if (!res.ok) throw new Error((result as any).error);
        return result;
    },
    async put<Data>(url: string, data: any = {}, login: boolean = true) {
        const res = await fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Authorization: login && getAuth(),
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        if (!res.ok) throw new Error((result as any).error);
        return result;
    },
    async delete<Data>(url: string, data: any = {}, login: boolean = true) {
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Authorization: login && getAuth(),
            },
            body: JSON.stringify(data || {}),
        });
        const result: Data = await res.json();
        if (!res.ok) throw new Error((result as any).error);
        return result;
    },
};
