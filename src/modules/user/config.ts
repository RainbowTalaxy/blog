import { SERVER_API } from '@site/src/constants/config';
import { rawFetch } from '@site/src/utils/fetch';

export interface UserInfo {
    id?: string;
    token?: string;
}

export class User {
    static get config() {
        const data = localStorage.getItem('user');
        const config: UserInfo = data ? JSON.parse(data) : {};
        return {
            id: config?.id ?? '',
            token: config?.token ?? '',
        };
    }

    static set config(config: UserInfo) {
        localStorage.setItem('user', JSON.stringify(config));
    }

    static async update(token: string) {
        User.config = { token };
        const { id } = await rawFetch<{ id: string }>(
            `${SERVER_API}/user/test`,
            'GET',
            null,
            token,
        );
        console.log(token, id);
        User.config = { id, token };
    }
}
