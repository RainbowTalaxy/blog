import { LOCAL_API, SERVER_API } from '../constants/config';
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
    register: (id: string, key: string, token: string) =>
        rocketV2.post(`${SERVER_API}/user/register`, {
            id,
            key,
            token,
        }),
    login: (id: string, key: string) =>
        rocketV2.post<{ token: string }>(`${LOCAL_API}/user/login`, {
            id,
            key,
        }),
    test: () => rocketV2.get<{ id: string }>(`${LOCAL_API}/user/test`),
};

export default UserAPI;
