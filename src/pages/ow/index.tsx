import useScreen, { Screen } from '@site/src/hooks/useScreen';
import clsx from 'clsx';
import styles from './index.module.css';
import Github from '/svg/github-fill.svg';
import Unsplash from '/svg/unsplash-fill.svg';
import Menu from '/svg/menu.svg';
import { useMemo, useState } from 'react';
import useKeyboard from '@site/src/hooks/useKeyboard';
import useQuery from '@site/src/hooks/useQuery';
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

const TABS = [
    {
        code: '',
        name: '主页',
        link: '/ow',
    },
    {
        code: 'docs',
        name: '笔记',
        link: '/ow?tab=docs',
    },
    {
        code: 'blog',
        name: '博客',
        link: '/ow?tab=blog',
    },
    {
        code: 'gallery',
        name: '画廊',
        link: '/ow?tab=gallery',
    },
];

const Overwatch = () => {
    const currentTab = useQuery().get('tab') ?? '';
    const history = useHistory();
    const screen = useScreen();
    const [isMenuVisible, setMenuVisible] = useState(false);

    const closeMenu = () => setMenuVisible(false);

    useKeyboard('Escape', () => setMenuVisible((prev) => !prev));

    useKeyboard('Tab', () => {
        const idx = TABS.findIndex(
            (tab) =>
                tab.code ===
                (new URLSearchParams(window.location.search).get('tab') ?? ''),
        );
        const newTab = TABS[(idx + 1) % TABS.length];
        if (newTab) history.replace(newTab.link);
    });

    return (
        <div className={container}>
            <nav className={navBar}>
                {screen >= Screen.Large ? (
                    TABS.map((tab) => (
                        <Link
                            className={clsx(
                                styles.tab,
                                tab.code === currentTab && styles.active,
                            )}
                            key={tab.name}
                            to={tab.link}
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
                {screen >= Screen.Middle && (
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
            <img
                className={bg}
                src="http://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1YXgc2/bqQfVz5yrrGYSXMvKr.cqaOObb1ygfTxfj6bQWvWC6EXMACeeba4UvhVubjeBx.mXZx1FYhBNbBdEtjHLL7x7xu7JsY1Pv0ehXf49Bar6*g!/r"
                alt="background"
            />
            {isMenuVisible && (
                <div className={menuPage}>
                    {TABS.map((tab) => (
                        <Link
                            className={menuCell}
                            key={tab.name}
                            href={tab.link}
                            onClick={closeMenu}
                        >
                            {tab.name}
                        </Link>
                    ))}
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
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                    >
                        GitHub
                    </Link>
                    <a className={menuCell} onClick={closeMenu}>
                        取消
                    </a>
                    <div className={mask} />
                </div>
            )}
        </div>
    );
};

export default Overwatch;
