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
}

export const SideBarListItem = ({
    className,
    active,
    icon,
    children,
}: ListItemProps) => {
    return (
        <li
            className={clsx(
                styles.sidebarListItem,
                active && styles.active,
                className,
            )}
        >
            {icon && <span className={styles.sidebarListItemIcon}>{icon}</span>}
            {children}
        </li>
    );
};

interface SideBarProps {
    className?: string;
    sidebar: ReactNode;
    children?: ReactNode;
}

const ContentWithSideBar = ({ className, sidebar, children }: SideBarProps) => {
    return (
        <div className={clsx(styles.pageView, className)}>
            <div className={styles.sidebar}>{sidebar}</div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default ContentWithSideBar;
