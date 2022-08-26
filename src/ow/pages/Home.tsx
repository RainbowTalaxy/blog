import useQuery from '@site/src/hooks/useQuery';
import useScreen, { Screen } from '@site/src/hooks/useScreen';
import { useContext } from 'react';
import { PageContext, Router, SceneLevel, TabState } from '../models/context';
import '../styles/home.css';

const WEB_ATTR = '苏 ICP 备 19075978 号';

const Home = () => {
    const screen = useScreen();
    const context = useContext(PageContext);

    const query = useQuery();

    if (query.get('target') === 'links') {
        context.method.push({
            router: Router.Links,
            tab: TabState.Corner,
            scene: SceneLevel.One,
        });
    }

    if (query.get('target') === 'gallery') {
        context.method.push({
            router: Router.Gallery,
            tab: TabState.Corner,
            scene: SceneLevel.One,
        });
    }

    return (
        <main className="ow-home-content">
            {screen >= Screen.Large && (
                <header className="ow-site">
                    <div className="ow-site-title">
                        Talaxy<span>'</span>s Blog
                    </div>
                    <a
                        className="ow-site-description"
                        href="http://beian.miit.gov.cn/"
                        target="_blank"
                    >
                        © {new Date().getFullYear()} Talaxy · {WEB_ATTR}
                    </a>
                </header>
            )}
            {screen < Screen.Large ? (
                <header className="ow-site-sm">
                    <div className="ow-site-sm-title">
                        Talaxy<span>'</span>s Blog
                    </div>
                    <a
                        className="ow-site-description"
                        href="http://beian.miit.gov.cn/"
                        target="_blank"
                    >
                        {WEB_ATTR}
                    </a>
                </header>
            ) : (
                <div className="top-spacer" />
            )}
            <menu>
                <li>文档</li>
                <li>博客</li>
                <li
                    onClick={(e) => {
                        context.method.push({
                            router: Router.Links,
                            tab: TabState.Corner,
                            scene: SceneLevel.One,
                        });
                    }}
                >
                    收藏夹
                </li>
                <li
                    onClick={(e) => {
                        context.method.push({
                            router: Router.Gallery,
                            tab: TabState.Corner,
                            scene: SceneLevel.One,
                        });
                    }}
                >
                    画廊
                </li>
            </menu>
            <div className="bottom-spacer" />
        </main>
    );
};

export default Home;
