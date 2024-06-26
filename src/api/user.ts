import { SERVER_API } from '../constants/config';
import { rocketV2 } from './utils';

export interface TokenInfo {
    id: string;
    token: string;
    date: number;
}

const UserAPI = {
    generateToken: (userId: string) =>
        rocketV2.post<TokenInfo>(`${SERVER_API}/user/token`, { id: userId }),
    config: () => rocketV2.get(`${SERVER_API}/user/list`),
    register: (id: string, password: string, token: string) =>
        rocketV2.post(`${SERVER_API}/user/register`, {
            id,
            password,
            token,
        }),
    login: (id: string, password: string, expireTime?: number) =>
        rocketV2.post<{ token: string }>(`${SERVER_API}/user/login`, {
            id,
            password,
            expireTime,
        }),
    info: () => rocketV2.get<{ id: string }>(`${SERVER_API}/user`),
    test: () => rocketV2.get<{ id: string }>(`${SERVER_API}/user/test`),
    logout: () => rocketV2.post(`${SERVER_API}/user/logout`),
};

export default UserAPI;
