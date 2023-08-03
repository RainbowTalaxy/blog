import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from '../styles/layout.module.css';

interface ListProps {
    className?: string;
    children?: ReactNode;
}

export const SideBarList = ({ className, children }: ListProps) => {
    return <ul className={clsx(styles.sidebarList, className)}>{children}</ul>;
};

interface ListItemProps {
    className?: string;
    active?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
    onClick?: () => void;
}

export const SideBarListItem = ({ className, active, icon, children, onClick }: ListItemProps) => {
    return (
        <li className={clsx(styles.sidebarListItem, active && styles.active, className)} onClick={onClick}>
            {icon && <span className={styles.sidebarListItemIcon}>{icon}</span>}
            {children}
        </li>
    );
};

interface SideBarProps {
    className?: string;
    sidebar: ReactNode;
    children?: ReactNode;
    sidebarVisible?: boolean;
}

const ContentWithSideBar = ({ className, sidebar, children, sidebarVisible = true }: SideBarProps) => {
    return (
        <div className={clsx(styles.pageView, !sidebarVisible && styles.noSidebar, className)}>
            {sidebarVisible && <div className={styles.sidebar}>{sidebar}</div>}
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default ContentWithSideBar;
