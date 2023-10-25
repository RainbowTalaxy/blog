import '../styles/gallery.css';
import { useContext } from 'react';
import OperatorButton from '../components/OperatorButton';
import { DOCS_DATA } from '../constants/docs';
import { PageContext } from '../models/context';

const Docs = () => {
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header">{context.state.router}</header>
            <main>
                <div className="ow-card-content">
                    <ul className="ow-card-list">
                        {DOCS_DATA.map((card) => (
                            <li
                                key={card.title}
                                className="ow-card-li"
                                onClick={() => window.open(card.link)}
                            >
                                <img
                                    referrerPolicy="no-referrer"
                                    className="ow-card-bg"
                                    src={card.bg}
                                    style={card.style}
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
        </>
    );
};

export default Docs;
