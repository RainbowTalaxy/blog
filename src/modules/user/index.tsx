import useQuery from '@site/src/hooks/useQuery';
import styles from './index.module.css';
import { useLocalStorage } from 'usehooks-ts';
import { DEFAULT_USER_INFO, UserInfo } from '@site/src/constants/user';

const FORM_CONFIG = [
    {
        attr: 'id',
        name: 'ID',
        type: 'text',
    },
    {
        attr: 'fileApiKey',
        name: '文件 API Key',
        type: 'password',
    },
];

const User = () => {
    const query = useQuery();
    const nextUrl = query.get('nextUrl');
    const [userInfo, setUserInfo] = useLocalStorage<UserInfo>('user', {
        ...DEFAULT_USER_INFO,
    });

    return (
        <div className={styles.container}>
            <h1>权限设置</h1>
            <div className={styles.form}>
                {FORM_CONFIG.map((config) => (
                    <div className={styles.field} key={config.attr}>
                        <label htmlFor={config.attr}>{config.name}</label>
                        <input
                            type={config.type}
                            name={config.attr}
                            id={config.attr}
                            defaultValue={userInfo[config.attr]}
                            onChange={(e) => {
                                userInfo[config.attr] = e.target.value;
                            }}
                        />
                    </div>
                ))}
                <button
                    onClick={() => {
                        setUserInfo({ ...userInfo });
                        if (nextUrl) window.location.href = nextUrl;
                    }}
                >
                    保存
                </button>
            </div>
        </div>
    );
};

export default User;
