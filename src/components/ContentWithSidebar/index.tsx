import { ReactNode } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';

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
            <div className={clsx(styles.content, 'sidebar-content')}>
                {children}
            </div>
        </div>
    );
};

export default ContentWithSidebar;
