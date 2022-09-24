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

    if (query.get('target') === 'patch') {
        context.method.push({
            router: Router.Patch,
            tab: TabState.Corner,
            scene: SceneLevel.Fill,
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
                <li className="ow-li-primary">文档</li>
                <li className="ow-li-primary">博客</li>
                <li
                    className="ow-li-primary"
                    onClick={() => {
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
                    className="ow-li-primary"
                    onClick={() => {
                        context.method.push({
                            router: Router.Gallery,
                            tab: TabState.Corner,
                            scene: SceneLevel.One,
                        });
                    }}
                >
                    画廊
                </li>
                <li className="ow-li-secondary">主播直播间</li>
                <li className="ow-li-secondary">选项设置</li>
                <li
                    className="ow-li-secondary"
                    onClick={() => {
                        context.method.push({
                            router: Router.Patch,
                            tab: TabState.Corner,
                            scene: SceneLevel.Fill,
                        });
                    }}
                >
                    更新说明
                </li>
                <li
                    className="ow-li-secondary"
                    onClick={() => {
                        context.method.push({
                            router: Router.Todo,
                            tab: TabState.Corner,
                            scene: SceneLevel.Fill,
                        });
                    }}
                >
                    待办计划
                </li>
            </menu>
            <div className="bottom-spacer" />
        </main>
    );
};

export default Home;
