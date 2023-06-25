export interface UserInfo {
    id?: string;
    key?: string;
    fileApiKey?: string;
}

export class User {
    static get config() {
        const data = localStorage.getItem('user');
        const config: UserInfo = data ? JSON.parse(data) : {};
        return {
            id: config?.id ?? 'guest',
            key: config?.key ?? '',
            fileApiKey: config?.fileApiKey ?? '',
        };
    }

    static set config(config: UserInfo) {
        localStorage.setItem('user', JSON.stringify(config));
    }
}
