import { User } from '../modules/user/config';

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

const getAuth = () => {
    const user = User.config;
    return `token=${user.token}`;
};

interface ResponseError {
    error: string;
    message?: string;
}

async function request<Data>(
    url: string,
    method: string,
    data: any = {},
    login: boolean = true,
) {
    const res = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Authorization: login ? getAuth() : '',
        },
        body: JSON.stringify(data || {}),
    });
    const result: Data = await res.json();
    if (!res.ok)
        throw new Error((result as ResponseError).message || '其他错误');
    return result;
}

export const rocketV2 = {
    async get<Data>(url: string, query?: any, login: boolean = true) {
        const res = await fetch(
            url + (query ? `?${new URLSearchParams(query)}` : ''),
            {
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: login ? getAuth() : '',
                },
            },
        );
        const result: Data = await res.json();
        if (!res.ok)
            throw new Error(
                (result as ResponseError).message ||
                    `请求失败：${(result as ResponseError).error}`,
            );
        return result;
    },

    async post<Data>(url: string, data: any = {}, login: boolean = true) {
        return await request<Data>(url, 'POST', data, login);
    },
    async put<Data>(url: string, data: any = {}, login: boolean = true) {
        return await request<Data>(url, 'PUT', data, login);
    },
    async delete<Data>(url: string, data: any = {}, login: boolean = true) {
        return await request<Data>(url, 'DELETE', data, login);
    },
};
