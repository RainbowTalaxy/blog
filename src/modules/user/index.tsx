import styles from './index.module.css';
import useQuery from '@site/src/hooks/useQuery';
import { User } from './config';
import API from '@site/src/api';
import { Button, Input } from '@site/src/components/Form';
import { useEffect, useState } from 'react';

const FORM_CONFIG = [
    {
        attr: 'id',
        name: 'ID',
        type: 'text',
        placeholder: '请用字母数字或 _ 组合',
    },
    {
        attr: 'password',
        name: '密码',
        type: 'password',
        placeholder: '需向管理员申请，且由个人保管',
    },
];

const UserPage = () => {
    const query = useQuery();
    const nextUrl = query.get('nextUrl');
    const [userId, setUserId] = useState<string | null>();
    const form = {
        id: '',
        password: '',
        token: '',
    };

    useEffect(() => {
        (async () => {
            try {
                const data = await API.user.test();
                setUserId(data.id);
            } catch {
                setUserId(null);
            }
        })();
    }, []);

    if (userId === undefined) return null;

    return (
        <div className={styles.container}>
            <h1>权限设置</h1>
            <div className={styles.form}>
                {userId ? (
                    <>
                        <p>当前用户：{userId}</p>
                        <Button
                            onClick={async () => {
                                const granted = confirm('确定要退出登录吗？');
                                if (granted) {
                                    await User.logout();
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
                                        form[config.attr] = e.target.value;
                                    }}
                                />
                            </div>
                        ))}
                        <div
                            className={styles.buttonGroup}
                            style={{ marginTop: 24 }}
                        >
                            <Button
                                type="primary"
                                onClick={async () => {
                                    try {
                                        if (!form.id) return alert('请输入 ID');
                                        if (!form.password)
                                            return alert('请输入密码');
                                        const { token } = await API.user.login(
                                            form.id,
                                            form.password,
                                        );
                                        form.token = token;
                                        User.config = {
                                            id: form.id,
                                            token,
                                        };
                                        if (nextUrl) {
                                            window.location.href = nextUrl;
                                        } else {
                                            window.location.reload();
                                        }
                                    } catch (error: any) {
                                        alert(
                                            `登录失败：${
                                                error?.message ?? '未知错误'
                                            }`,
                                        );
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
