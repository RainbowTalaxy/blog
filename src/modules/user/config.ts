import API from '@site/src/api';

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
        const { id } = await API.user.test();
        User.config = { id, token };
    }

    static async logout() {
        try {
            await API.user.logout();
            User.config = {};
        } catch (error) {
            console.error(error);
            alert(`登出失败：${error}`);
        }
    }
}
