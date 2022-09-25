import useQuery from '@site/src/hooks/useQuery';
import useScreen, { Screen } from '@site/src/hooks/useScreen';
import { useContext } from 'react';
import { PageContext, Router, SceneLevel, TabState } from '../models/context';
import '../styles/home.css';

const WEB_ATTR = '苏 ICP 备 19075978 号';

const SETTING_TAB = [Router.Patch, Router.Todo];

const Home = () => {
    const context = useContext(PageContext);

    const query = useQuery();

    if (query.get('target') === 'links') {
        context.history.push({
            router: Router.Links,
            scene: SceneLevel.One,
        });
    }

    if (query.get('target') === 'gallery') {
        context.history.push({
            router: Router.Gallery,
            scene: SceneLevel.One,
        });
    }

    if (query.get('target') === 'patch') {
        context.history.push({
            router: Router.Patch,
            scene: SceneLevel.Fill,
        });
    }

    return (
        <main className="ow-home-content">
            {context.screen >= Screen.Large && (
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
            {context.screen < Screen.Large ? (
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
                <li className="ow-li-primary">{Router.Docs}</li>
                <li className="ow-li-primary">{Router.Blog}</li>
                <li
                    className="ow-li-primary"
                    onClick={() => {
                        context.history.push({
                            router: Router.Links,
                            scene: SceneLevel.One,
                        });
                    }}
                >
                    {Router.Links}
                </li>
                <li
                    className="ow-li-primary"
                    onClick={() => {
                        context.history.push({
                            router: Router.Gallery,
                            scene: SceneLevel.One,
                        });
                    }}
                >
                    {Router.Gallery}
                </li>
                <li className="ow-li-secondary">主播直播间</li>
                <li className="ow-li-secondary">选项设置</li>
                <li
                    className="ow-li-secondary"
                    onClick={() => {
                        context.history.push({
                            router: Router.Patch,
                            tabs: SETTING_TAB,
                            scene: SceneLevel.Fill,
                        });
                    }}
                >
                    {Router.Patch}
                </li>
                <li
                    className="ow-li-secondary"
                    onClick={() => {
                        context.history.push({
                            router: Router.Todo,
                            tabs: SETTING_TAB,
                            scene: SceneLevel.Fill,
                        });
                    }}
                >
                    {Router.Todo}
                </li>
            </menu>
            <div className="bottom-spacer" />
        </main>
    );
};

export default Home;
