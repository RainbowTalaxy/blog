import '../styles/alert.css';
import ConfirmButton from './ConfirmButton';

interface Props {
    title: string;
    description: string;
    onConfirm: () => void;
}

const Alert = ({ onConfirm, title, description }: Props) => {
    return (
        <div className="ow-alert-view ow-bg">
            <div className="ow-alert-content">
                <div className="ow-alert-text">
                    <div className="ow-alert-title">{title}</div>
                    <div className="ow-alert-desc">{description}</div>
                </div>
                <div className="ow-alert-action">
                    <ConfirmButton onClick={onConfirm}>确定</ConfirmButton>
                </div>
            </div>
        </div>
    );
};

export default Alert;
