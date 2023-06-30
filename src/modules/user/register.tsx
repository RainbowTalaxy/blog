import styles from './index.module.css';
import { useEffect, useRef } from 'react';
import API from '@site/src/api';
import useQuery from '@site/src/hooks/useQuery';
import { User } from './config';

const FORM_CONFIG = [
    {
        attr: 'token',
        name: 'Token',
        type: 'text',
        placeholder: '如没有 Token ，请向管理员申请',
    },
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
        placeholder: '请用字母数字或 - 组合，不得少于 4 个字符',
    },
    {
        attr: 'rekey',
        name: '再次输入 API Key',
        type: 'password',
        placeholder: '请用字母数字或 - 组合，不得少于 4 个字符',
    },
];

const RegisterPage = () => {
    const query = useQuery();
    const form = useRef<{
        id?: string;
        key?: string;
        rekey?: string;
        token?: string;
    }>({});

    useEffect(() => {
        const token = query.get('token');
        if (token) {
            form.current.token = token;
            document.querySelector<HTMLInputElement>('#token')!.value = token;
        }
        const id = query.get('id');
        if (id) {
            form.current.id = id;
            document.querySelector<HTMLInputElement>('#id')!.value = id;
        }
    }, [query]);

    return (
        <div className={styles.container}>
            <h1>登记用户</h1>
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
                                form.current[config.attr] = e.target.value;
                            }}
                        />
                    </div>
                ))}
                <button
                    onClick={async () => {
                        if (!form.current.token) return alert('请输入 Token');
                        if (!form.current.id) return alert('请输入 ID');
                        if (!form.current.key) return alert('请输入 API Key');
                        if (!form.current.rekey)
                            return alert('请再次输入 API Key');
                        if (form.current.key !== form.current.rekey)
                            return alert('两次输入的 API Key 不一致');
                        try {
                            await API.user.register(
                                form.current.id,
                                form.current.key,
                                form.current.token,
                            );
                            alert('登记成功');
                            User.config = {
                                ...User.config,
                                id: form.current.id,
                                key: form.current.key,
                            };
                            window.location.href = '/user';
                        } catch (error) {
                            console.error(error);
                            alert(`登记失败：${error.message}`);
                        }
                    }}
                >
                    登记
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
