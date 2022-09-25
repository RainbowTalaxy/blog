import { useContext } from 'react';
import OperatorButton from '../components/OperatorButton';
import { LINKS_DATA } from '../constants/links';
import { PageContext } from '../models/context';
import '../styles/links.css';

const Links = () => {
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header">收藏夹</header>
            <main className="ow-content">
                <ul className="ow-hero-ul">
                    {LINKS_DATA.map((item, idx) => (
                        <li
                            key={idx}
                            className="ow-hero-li"
                            onClick={() => window.open(item.link)}
                            // @ts-ignore
                            style={{ '--i': idx }}
                        >
                            <img
                                className="ow-hero-li-img"
                                src={item.image}
                                alt={item.name}
                                draggable={false}
                                style={{ backgroundColor: item.primary }}
                            />
                            <span className="ow-hero-li-title">
                                {item.name}
                            </span>
                            <span
                                className="ow-hero-li-desc"
                                style={{ backgroundColor: item.secondary }}
                            >
                                <div>{item.description}</div>
                            </span>
                        </li>
                    ))}
                </ul>
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

export default Links;
