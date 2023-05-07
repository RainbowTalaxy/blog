import { useContext, useState } from 'react';
import Alert from '../components/Alert';
import OperatorButton from '../components/OperatorButton';
import { GALLERY_DATA } from '../constants/gallery';
import { PageContext } from '../models/context';
import '../styles/gallery.css';

const Gallery = () => {
    const [isAlertVisible, setAlertVisible] = useState(false);
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header">{context.state.router}</header>
            <main>
                <div className="ow-card-content">
                    <ul className="ow-card-list">
                        {GALLERY_DATA.map((card) => (
                            <li
                                key={card.title}
                                className="ow-card-li"
                                onClick={() => {
                                    window.open(card.link);
                                    // setAlertVisible(true);
                                }}
                            >
                                <img
                                    referrerPolicy="no-referrer"
                                    className="ow-card-bg"
                                    src={card.bg}
                                />
                                <div className="ow-card-primary">
                                    {card.primary}
                                </div>
                                <div className="ow-card-title">
                                    {card.title}
                                </div>
                                <div className="ow-card-subtitle">
                                    {card.subtitle}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <OperatorButton
                    className="ow-right-bottom-button"
                    keyName="ESC"
                    onClick={context.history.pop}
                >
                    返回
                </OperatorButton>
            </main>
            {isAlertVisible && (
                <Alert
                    title="暂时关闭"
                    description="因技术问题暂时关闭访问"
                    onConfirm={() => setAlertVisible(false)}
                />
            )}
        </>
    );
};

export default Gallery;
