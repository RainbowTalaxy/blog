import { ReactNode } from 'react';
import Notification from './Notification';
import styles from '../../styles/notification.module.css';

const Toast = {
    name: 'toast',

    notify(message: ReactNode, duration: number | false = 2000) {
        Notification.notify(
            typeof message === 'string' ? <div className={styles.toastText}>{message}</div> : message,
            duration,
            {
                name: this.name,
            },
        );
    },

    close() {
        Notification.close(this.name);
    },
};

export default Toast;
