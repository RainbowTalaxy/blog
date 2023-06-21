import useQuery from '@site/src/hooks/useQuery';
import styles from './index.module.css';
import { User } from './config';

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
    {
        attr: 'fileApiKey',
        name: '文件 API Key（即将弃用）',
        type: 'password',
        placeholder: '该 Key 需向管理员申请',
    },
];

const UserPage = () => {
    const query = useQuery();
    const nextUrl = query.get('nextUrl');

    const userInfo = User.config;

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
                            placeholder={config.placeholder}
                            onChange={(e) => {
                                userInfo[config.attr] = e.target.value;
                            }}
                        />
                    </div>
                ))}
                <button
                    onClick={() => {
                        User.config = userInfo;
                        if (nextUrl) window.location.href = nextUrl;
                    }}
                >
                    保存
                </button>
            </div>
        </div>
    );
};

export default UserPage;
