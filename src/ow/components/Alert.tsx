import '../styles/alert.css';
import ConfirmButton from './ConfirmButton';

interface Props {
    onConfirm: () => void;
}

const Alert = ({ onConfirm }: Props) => {
    return (
        <div className="ow-alert-view ow-bg">
            <div className="ow-alert-content">
                <div className="ow-alert-text">
                    <div className="ow-alert-title">温馨提示</div>
                    <div className="ow-alert-desc">
                        为了获得更好的体验，请使用 Safari、Chrome 或 Chromium
                        内核的 Edge 浏览器，并升级到最新版本！
                    </div>
                </div>
                <div className="ow-alert-action">
                    <ConfirmButton onClick={onConfirm}>确定</ConfirmButton>
                </div>
            </div>
        </div>
    );
};

export default Alert;
