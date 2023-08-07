import useQuery from '@site/src/hooks/useQuery';
import styles from './index.module.css';
import { User } from './config';
import useUser from '@site/src/hooks/useUser';
import { useEffect } from 'react';
import API from '@site/src/api';
import { Button, Input } from '@site/src/components/Form';

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
        API.user.test();
    }, []);

    if (!userInfo) return null;

    return (
        <div className={styles.container}>
            <h1>权限设置</h1>
            <div className={styles.form}>
                {userInfo.id ? (
                    <>
                        <p>当前用户：{userInfo.id}</p>
                        <Button
                            onClick={() => {
                                const granted = confirm('确定要退出登录吗？');
                                if (granted) {
                                    User.config = null;
                                    window.location.reload();
                                }
                            }}
                        >
                            退出登录
                        </Button>
                    </>
                ) : (
                    <>
                        {FORM_CONFIG.map((config) => (
                            <div className={styles.field} key={config.attr}>
                                <label htmlFor={config.attr}>
                                    {config.name}
                                </label>
                                <Input
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
                        <div className={styles.buttonGroup}>
                            <Button
                                type="primary"
                                onClick={async () => {
                                    try {
                                        const { token } = await API.user.login(
                                            userInfo.id,
                                            userInfo.key,
                                        );
                                        userInfo.token = token;
                                        User.config = userInfo;
                                        if (nextUrl) {
                                            window.location.href = nextUrl;
                                        } else {
                                            window.location.reload();
                                        }
                                    } catch {
                                        alert('登录失败');
                                    }
                                }}
                            >
                                登录
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserPage;
