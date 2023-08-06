import useQuery from '@site/src/hooks/useQuery';
import styles from './index.module.css';
import { User } from './config';
import useUser from '@site/src/hooks/useUser';
import { useEffect } from 'react';
import API from '@site/src/api';

const FORM_CONFIG = [
    {
        attr: 'id',
        name: 'ID',
        type: 'text',
        placeholder: '请用字母数字或 - 组合，不得少于 4 个字符',
    },
    {
        attr: 'key',
        name: 'API Key',
        type: 'password',
        placeholder: '该 Key 需向管理员申请，且由个人保管',
    },
];

const UserPage = () => {
    const query = useQuery();
    const nextUrl = query.get('nextUrl');
    const userInfo = useUser();

    useEffect(() => {
        document.querySelector<HTMLInputElement>('#id')!.value = userInfo.id;
        document.querySelector<HTMLInputElement>('#key')!.value = userInfo.key;
    }, [userInfo]);

    useEffect(() => {
        API.user.test();
    }, []);

    if (!userInfo) return null;

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
                            placeholder={config.placeholder}
                            onChange={(e) => {
                                userInfo[config.attr] = e.target.value;
                            }}
                        />
                    </div>
                ))}
                <button
                    onClick={async () => {
                        try {
                            const { token } = await API.user.login(
                                userInfo.id,
                                userInfo.key,
                            );
                            userInfo.token = token;
                            User.config = userInfo;
                            if (nextUrl) window.location.href = nextUrl;
                        } catch {
                            alert('登录失败');
                        }
                    }}
                >
                    保存
                </button>
            </div>
        </div>
    );
};

export default UserPage;
