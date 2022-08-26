import { useContext } from 'react';
import OperatorButton from '../components/OperatorButton';
import { GALLERY_DATA } from '../contants/gallery';
import { PageContext } from '../models/context';
import '../styles/gallery.css';

const Gallery = () => {
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header">画廊</header>
            <main>
                <div className="ow-card-content">
                    <ul className="ow-card-list">
                        {GALLERY_DATA.map((card) => (
                            <li
                                className="ow-card-li"
                                onClick={() => window.open(card.link)}
                            >
                                <img className="ow-card-bg" src={card.bg} />
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
                    onClick={context.method.pop}
                >
                    返回
                </OperatorButton>
            </main>
        </>
    );
};

export default Gallery;
