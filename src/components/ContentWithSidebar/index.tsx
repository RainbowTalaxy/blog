import { ReactNode } from 'react';
import styles from './index.module.css';

interface Props {
    title?: ReactNode;
    sidebar: ReactNode;
    children: ReactNode;
    sidebarWidth?: number;
}

const ContentWithSidebar = ({
    title,
    sidebar,
    children,
    sidebarWidth,
}: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar} style={{ width: sidebarWidth }}>
                <div className={styles.sidebarInner}>
                    {title && <div className={styles.header}>{title}</div>}
                    {sidebar}
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default ContentWithSidebar;
