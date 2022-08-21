import useScreen, { Screen } from '@site/src/hooks/useScreen';
import '../styles/home.css';

const WEB_ATTR = '苏 ICP 备 19075978 号';

const Home = () => {
    const screen = useScreen();

    return (
        <main className="ow-home-content">
            {screen >= Screen.Large && (
                <div className="ow-site">
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
                </div>
            )}
            {screen < Screen.Large ? (
                <div className="ow-site-sm">
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
                </div>
            ) : (
                <div className="top-spacer" />
            )}
            <menu>
                <li>文档</li>
                <li>博客</li>
                <li>画廊</li>
            </menu>
            <div className="bottom-spacer" />
        </main>
    );
};

export default Home;
