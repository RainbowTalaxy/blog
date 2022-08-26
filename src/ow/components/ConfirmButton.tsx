import clsx from 'clsx';

interface Props {
    className?: string;
    children: string;
    onClick?: () => void;
}

const ConfirmButton = ({ className, children, onClick }: Props) => {
    return (
        <button
            className={clsx(className, 'ow-button-confirm')}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default ConfirmButton;
