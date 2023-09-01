import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/notification.module.css';

const NOTIFICATION_CONTAINER_CLASS = 'notification-container';

export interface NotificationOption {
    text?: ReactNode;
    kill?: boolean;
    onEnd?: () => void;
}

class Notification {
    private static type: string | null = null;
    private static timerId: ReturnType<typeof setTimeout> | null = null;
    private static _container: HTMLDivElement | null = null;

    private static get container() {
        if (this._container) return this._container;
        const root = document.querySelector<HTMLDivElement>('#__docusaurus')!;
        let container = Array.from(root.children).find((ele) =>
            ele.classList.contains(NOTIFICATION_CONTAINER_CLASS),
        ) as HTMLDivElement;
        if (!container) {
            container = document.createElement('div');
            container.classList.add(NOTIFICATION_CONTAINER_CLASS);
            container.classList.add(styles.container);
            root.append(container);
        }
        this._container = container;
        return container;
    }

    static close(name: string) {
        if (name !== this.type) return;
        this.container.style.transform = '';
        setTimeout(() => {
            ReactDOM.unmountComponentAtNode(this.container);
            this.reset();
        }, 550);
    }

    static reset() {
        if (this.timerId) clearTimeout(this.timerId);
        this.timerId = null;
        this.type = null;
    }

    static notify(message: ReactNode, duration: number | false = 2000, options: NotificationOption & { name: string }) {
        this.reset();
        ReactDOM.render(<>{message}</>, this.container);
        setTimeout(() => {
            this.container.style.transform = 'translateY(0)';
            this.type = options.name;
            if (duration) {
                this.timerId = setTimeout(() => {
                    if (options.onEnd) {
                        options.onEnd();
                    } else {
                        this.close(options.name);
                    }
                }, duration);
            }
        }, 10);
    }
}

export default Notification;
