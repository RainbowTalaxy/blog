import { useContext } from 'react';
import OperatorButton from '../components/OperatorButton';
import { EXTRA_LINKS, LINKS_DATA } from '../constants/links';
import { LIVE_DATA } from '../constants/lives';
import { PageContext } from '../models/context';

const LiveList = () => {
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header-middle">{context.state.router}</header>
            <main className="ow-content-middle">
                <div className="ow-main">
                    <section className="ow-section">
                        <header className="ow-section-header">
                            直播间列表
                        </header>
                        <div className="ow-section-list">
                            {LIVE_DATA.map((live) => (
                                <div
                                    className="ow-section-cell"
                                    onClick={() => window.open(live.link)}
                                >
                                    {live.title}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="ow-section">
                        <header className="ow-section-header">收藏夹</header>
                        <div className="ow-section-list">
                            {LINKS_DATA.concat(EXTRA_LINKS as any).map(
                                (link) => (
                                    <div
                                        className="ow-section-cell"
                                        onClick={() => window.open(link.link)}
                                    >
                                        {link.name}
                                    </div>
                                ),
                            )}
                        </div>
                    </section>
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

export default LiveList;
