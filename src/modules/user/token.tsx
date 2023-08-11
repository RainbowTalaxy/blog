import styles from './index.module.css';
import { useEffect, useRef, useState } from 'react';
import API from '@site/src/api';
import { TokenInfo } from '@site/src/api/user';

const FORM_CONFIG = [
    {
        attr: 'id',
        name: 'ID',
        type: 'text',
        placeholder: '请用字母数字或 - 组合，不得少于 4 个字符',
    },
];

const TokenGenerate = () => {
    const form = useRef<{
        id?: string;
    }>({});
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>();

    useEffect(() => {
        API.user.config().then((data) => {
            console.log(data);
        });
    }, []);

    return (
        <div className={styles.container}>
            <h1>Token 生成</h1>
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
                    onClick={() => {
                        if (!form.current.id) return alert('请输入 ID');
                        API.user
                            .generateToken(form.current.id)
                            .then((data) => setTokenInfo(data))
                            .catch((err) => {
                                console.error(err);
                                alert(`生成失败：${err.message}`);
                            });
                    }}
                >
                    生成
                </button>
                {tokenInfo && (
                    <>
                        <div className={styles.tokenInfo}>
                            <span>Token：</span>
                            <span>{tokenInfo.token}</span>
                        </div>
                        <button
                            onClick={() => {
                                window.navigator.clipboard?.writeText(
                                    tokenInfo.token,
                                );
                            }}
                        >
                            复制 Token
                        </button>
                        <button
                            onClick={() => {
                                window.navigator.clipboard?.writeText(
                                    `${window.location.origin}/user/register?id=${tokenInfo.id}&token=${tokenInfo.token}`,
                                );
                            }}
                        >
                            复制使用链接
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TokenGenerate;
