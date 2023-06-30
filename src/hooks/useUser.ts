import { useEffect, useState } from 'react';
import { User, UserInfo } from '../modules/user/config';

const useUser = () => {
    const [user, setUser] = useState<UserInfo>({});

    useEffect(() => {
        setUser(User.config);
    }, []);

    return user;
};

export default useUser;
