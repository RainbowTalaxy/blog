import styles from '../index.module.css';
import { ReactNode } from 'react';

const ActionItem = ({
    className,
    children,
    onClick,
}: {
    className?: string;
    children: ReactNode;
    onClick: () => void;
}) => {
    return (
        <div className={styles.word}>
            <a className={className} onClick={onClick}>
                {children}
            </a>
        </div>
    );
};

export default ActionItem;
