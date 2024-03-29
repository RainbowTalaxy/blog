import { UserInfo } from '../constants/user';

export const getUser = (): UserInfo => {
    const userData = localStorage.getItem('user');
    if (!userData || userData === 'null') return {};
    return JSON.parse(userData);
};
