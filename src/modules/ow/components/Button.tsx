import '../styles/button.css';
import clsx from 'clsx';

interface Props {
    className?: string;
    children: string;
    onClick?: () => void;
}

export const OrangeButton = ({ className, children, onClick }: Props) => {
    return (
        <button
            className={clsx(className, 'ow-button-orange')}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
