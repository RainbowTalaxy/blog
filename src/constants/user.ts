export interface UserInfo {
    id?: string;
    fileApiKey?: string;
}

export const DEFAULT_USER_INFO: UserInfo = {
    id: 'guest',
    fileApiKey: '',
};
