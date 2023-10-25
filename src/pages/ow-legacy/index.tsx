import styles from './index.module.css';
import useScreen, { Screen } from '@site/src/hooks/useScreen';
import clsx from 'clsx';
import Github from '/svg/github-fill.svg';
import Unsplash from '/svg/unsplash-fill.svg';
import Menu from '/svg/menu.svg';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import useKeyboard from '@site/src/hooks/useKeyboard';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';

const {
    container,
    square,
    navBar,
    info,
    online,
    name,
    unsplash,
    github,
    bg,
    menu,
    menuPage,
    mask,
    menuCell,
    siteCell,
} = styles;

interface Tab {
    name: string;
    path: string;
}

const TABS = [
    {
        name: '主页',
        path: '/ow-legacy/home',
    },
    {
        name: '笔记',
        path: '/ow-legacy/docs',
    },
    {
        name: '博客',
        path: '/ow-legacy/blog',
    },
    {
        name: '画廊',
        path: '/ow-legacy/gallery',
    },
];

interface Props {
    children?: ReactNode;
}

const Overwatch = ({ children }: Props) => {
    const location = useLocation();
    const history = useHistory();
    const screen = useScreen();
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [currentTab, setCurretTab] = useState<Tab>();

    const closeMenu = () => setMenuVisible(false);

    const toNextTab = useCallback(() => {
        const idx = TABS.findIndex((tab) => tab.path === currentTab?.path);
        const newTab = TABS[(idx + 1) % TABS.length];
        if (newTab) history.replace(newTab.path);
    }, [currentTab, location, history]);

    useKeyboard('Tab', toNextTab);
    useKeyboard('Escape', () => setMenuVisible((prev) => !prev));

    useEffect(() => {
        const tab = TABS.find((tab) => tab.path == location.pathname);
        setCurretTab(tab);
    }, [location]);

    if (!screen) return null;

    return (
        <div className={container}>
            <nav className={navBar}>
                {screen >= Screen.Large ? (
                    TABS.map((tab) => (
                        <Link
                            key={tab.name}
                            className={clsx(
                                styles.tab,
                                tab.path === currentTab?.path && styles.active,
                            )}
                            to={tab.path}
                        >
                            {tab.name}
                        </Link>
                    ))
                ) : (
                    <a
                        className={clsx(square, menu)}
                        onClick={() => setMenuVisible(true)}
                    >
                        <Menu />
                    </a>
                )}
                <div className="grow" />
                {screen >= Screen.Medium && (
                    <>
                        <Link
                            className={clsx(square, unsplash, 'mr-[6px]')}
                            href="https://unsplash.com/@talaxy"
                        >
                            <Unsplash />
                        </Link>
                        <Link
                            className={clsx(square, github, 'mr-[12px]')}
                            href="https://github.com/RainbowTalaxy"
                        >
                            <Github />
                        </Link>
                    </>
                )}
                <div className={info}>
                    <div className={online} />
                    <img className={square} src="/img/mercy.png" />
                    <span className={name}>TALAXY</span>
                </div>
            </nav>
            <main>{children}</main>
            <img
                referrerPolicy="no-referrer"
                className={bg}
                src="http://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1YXgc2/bqQfVz5yrrGYSXMvKr.cqaOObb1ygfTxfj6bQWvWC6EXMACeeba4UvhVubjeBx.mXZx1FYhBNbBdEtjHLL7x7xu7JsY1Pv0ehXf49Bar6*g!/r"
                alt="background"
            />
            {isMenuVisible && (
                <div className={menuPage}>
                    {TABS.map(
                        (tab) =>
                            tab.path !== currentTab?.path && (
                                <Link
                                    className={menuCell}
                                    key={tab.name}
                                    to={tab.path}
                                    onClick={closeMenu}
                                >
                                    {tab.name}
                                </Link>
                            ),
                    )}
                    <Link
                        className={clsx(menuCell, siteCell)}
                        href="https://unsplash.com/@talaxy"
                        onClick={closeMenu}
                    >
                        Unsplash
                    </Link>
                    <Link
                        className={clsx(menuCell, siteCell)}
                        href="https://github.com/RainbowTalaxy"
                        onClick={closeMenu}
                    >
                        GitHub
                    </Link>
                    <a className={menuCell} onClick={closeMenu}>
                        取消
                    </a>
                    <div className={mask} onClick={closeMenu} />
                </div>
            )}
        </div>
    );
};

export default Overwatch;
