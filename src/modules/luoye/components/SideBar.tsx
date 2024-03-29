import styles from '../styles/layout.module.css';
import clsx from 'clsx';
import { CSSProperties, ForwardedRef, ReactNode, forwardRef } from 'react';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

interface ListProps {
    className?: string;
    children?: ReactNode;
}

export const SideBarList = forwardRef(({ className, children }: ListProps, ref: ForwardedRef<HTMLUListElement>) => {
    return (
        <ul ref={ref} className={clsx(styles.sidebarList, className)}>
            {children}
        </ul>
    );
});

interface ListItemProps {
    className?: string;
    active?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
    style?: CSSProperties;
    onClick?: () => void;
    draggableProps?: DraggableProvidedDraggableProps;
    dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export const SideBarListItem = forwardRef(
    (
        { className, active, icon, children, style, onClick, dragHandleProps, draggableProps }: ListItemProps,
        ref: ForwardedRef<HTMLLIElement>,
    ) => {
        return (
            <li
                ref={ref}
                className={clsx(styles.sidebarListItem, active && styles.active, className)}
                onClick={onClick}
                style={style}
                {...dragHandleProps}
                {...draggableProps}
            >
                {icon && <span className={styles.sidebarListItemIcon}>{icon}</span>}
                {children}
            </li>
        );
    },
);

const SIDE_BAR_ID = 'sidebar';
const REVEAL_CLASS = 'unfold-sidebar';

interface SideBarProps {
    className?: string;
    sidebar: ReactNode;
    navbar?: ReactNode;
    children?: ReactNode;
    sidebarVisible?: boolean;
}

export const revealSidebar = () => {
    const sidebar = document.querySelector<HTMLDivElement>(`#${SIDE_BAR_ID}`);
    sidebar?.classList.add(REVEAL_CLASS);
};

export const hideSidebar = () => {
    const sidebar = document.querySelector<HTMLDivElement>(`#${SIDE_BAR_ID}`);
    sidebar?.classList.remove(REVEAL_CLASS);
};

const ContentWithSideBar = ({ className, sidebar, navbar, children, sidebarVisible = true }: SideBarProps) => {
    return (
        <div id={SIDE_BAR_ID} className={clsx(styles.pageView, !sidebarVisible && styles.noSidebar, className)}>
            {sidebarVisible && (
                <>
                    <nav className={styles.sidebar}>{sidebar}</nav>
                    <div className={styles.sidebarMask} onClick={hideSidebar} />
                </>
            )}
            <div className={clsx(styles.contentView, navbar && styles.showNav)}>
                {navbar && <nav className={styles.navbar}>{navbar}</nav>}
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default ContentWithSideBar;
