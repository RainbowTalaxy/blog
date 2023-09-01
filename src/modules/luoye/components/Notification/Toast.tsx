import { ReactNode } from 'react';
import Notification from './Notification';
import styles from '../../styles/notification.module.css';

const Toast = {
    name: 'toast',
    preMessage: null as string | null,
    recover: false,

    notify(message: ReactNode, duration: number | false = 2000) {
        Notification.notify(
            typeof message === 'string' ? <div className={styles.toastText}>{message}</div> : message,
            duration,
            {
                name: this.name,
                onEnd: () => {
                    if (this.recover) this.notify(this.preMessage, false);
                },
            },
        );
        if (this.preMessage !== null) this.recover = true;
        if (typeof message === 'string' && duration === false) {
            this.preMessage = message;
            this.recover = false;
        }
    },

    close() {
        Notification.close(this.name);
    },
};

export default Toast;
