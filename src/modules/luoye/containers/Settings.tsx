import { Button } from '@site/src/components/Form';
import styles from '../styles/home.module.css';
import { useState } from 'react';
import ShareAccountForm from './ShareAccountForm';
import Toast from '../components/Notification/Toast';

const Settings = () => {
    const [isShareAccountFormVisible, setShareAccountFormVisible] = useState(false);

    return (
        <>
            <div className={styles.titleBar}>
                <h2 className={styles.pageTitle}>设置</h2>
            </div>
            <h2>账号设置</h2>
            <Button onClick={() => setShareAccountFormVisible(true)}>临时共享账号</Button>
            {isShareAccountFormVisible && (
                <ShareAccountForm
                    onClose={async (success) => {
                        if (success) Toast.notify('链接已复制到剪贴板');
                        setShareAccountFormVisible(false);
                    }}
                />
            )}
        </>
    );
};

export default Settings;
