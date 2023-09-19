import API from '@site/src/api';
import { Button, Input } from '@site/src/components/Form';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/form.module.css';
import Toast from '../components/Notification/Toast';

const SHARE_EXPIRE_TIME = 7;

interface Props {
    onClose: (success?: boolean) => Promise<void>;
}

const ShareAccountForm = ({ onClose }: Props) => {
    const idRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            try {
                const { id } = await API.user.test();
                idRef.current!.value = id;
            } catch (error: any) {
                Toast.notify(error.message);
            }
        })();
    }, []);

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>临时账号共享</h2>
                <p className={styles.formDescription}>生成一个7天有效的账号分享链接</p>
                <div className={styles.formItem}>
                    <label>ID：</label>
                    <Input raf={idRef} />
                </div>
                <div className={styles.formItem}>
                    <label>密码：</label>
                    <Input raf={passwordRef} type="password" />
                </div>
                <div className={styles.formItem}>
                    <label></label>
                    <div className={styles.options}>
                        <Button
                            type="primary"
                            onClick={async () => {
                                try {
                                    if (!idRef.current) return Toast.notify('ID 不能为空');
                                    if (!passwordRef.current) return Toast.notify('密码不能为空');
                                    const { token } = await API.user.login(
                                        idRef.current.value,
                                        passwordRef.current.value,
                                        SHARE_EXPIRE_TIME,
                                    );
                                    window.navigator.clipboard?.writeText(
                                        `${window.location.origin}/luoye?token=${token}`,
                                    );
                                    onClose(true);
                                } catch (error: any) {
                                    Toast.notify(error.message);
                                }
                            }}
                        >
                            生成分享链接
                        </Button>
                        <Button onClick={() => onClose()}>取消</Button>
                    </div>
                </div>
            </div>
            <div className={styles.mask} onClick={() => onClose()} />
        </div>,
        document.body,
    );
};

export default ShareAccountForm;
