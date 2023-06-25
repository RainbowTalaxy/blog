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
    register: (id: string, key: string, token: string) =>
        rocketV2.post(`${SERVER_API}/user/register`, {
            id,
            key,
            token,
        }),
};

export default UserAPI;
