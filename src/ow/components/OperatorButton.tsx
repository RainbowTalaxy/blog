import clsx from 'clsx';
import '../styles/operator.css';

interface Props {
    className?: string;
    keyName: string;
    children: string;
    onClick: () => void;
}

const OperatorButton = ({ className, keyName, children, onClick }: Props) => {
    return (
        <div
            className={clsx(className, 'ow-operator-button')}
            onClick={onClick}
        >
            <div className="ow-operator-key">{keyName.toUpperCase()}</div>
            <div className="ow-operator-text">{children}</div>
        </div>
    );
};

export default OperatorButton;
