export interface UserInfo {
    id?: string;
    key?: string;
    fileApiKey?: string;
}

export const DEFAULT_USER_INFO: UserInfo = {
    id: 'guest',
    key: '',
    fileApiKey: '',
};
