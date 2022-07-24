import useScreen, { Screen } from '@site/src/hooks/useScreen';
import clsx from 'clsx';
import styles from './index.module.css';
import Github from '/svg/github-fill.svg';
import Unsplash from '/svg/unsplash-fill.svg';
import Menu from '/svg/menu.svg';
import { useState } from 'react';

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
        name: '主页',
        link: '/ow',
        active: true,
    },
    {
        name: '笔记',
        link: '/docs/doc-intro',
    },
    {
        name: '博客',
        link: 'blog',
    },
    {
        name: '画廊',
        link: 'gallery',
    },
];

const Overwatch = () => {
    const screen = useScreen();
    const [isMenuVisible, setMenuVisible] = useState(false);

    return (
        <div className={container}>
            <nav className={navBar}>
                {screen >= Screen.Large ? (
                    TABS.map((tab) => (
                        <a
                            className={clsx(
                                styles.tab,
                                tab.active && styles.active,
                            )}
                            key={tab.name}
                            href={tab.link}
                        >
                            {tab.name}
                        </a>
                    ))
                ) : (
                    <a
                        className={clsx(square, menu, 'mr-[12px]')}
                        onClick={() => setMenuVisible(true)}
                    >
                        <Menu />
                    </a>
                )}
                <div className="grow" />
                {screen >= Screen.Middle && (
                    <>
                        <a
                            className={clsx(square, unsplash, 'mr-[6px]')}
                            href="https://unsplash.com/@talaxy"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Unsplash />
                        </a>
                        <a
                            className={clsx(square, github, 'mr-[12px]')}
                            href="https://github.com/RainbowTalaxy"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github />
                        </a>
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
                        <a className={menuCell} key={tab.name} href={tab.link}>
                            {tab.name}
                        </a>
                    ))}
                    <a
                        className={clsx(menuCell, siteCell)}
                        href="https://unsplash.com/@talaxy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Unsplash
                    </a>
                    <a
                        className={clsx(menuCell, siteCell)}
                        href="https://github.com/RainbowTalaxy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    <div
                        className={mask}
                        onClick={() => setMenuVisible(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default Overwatch;
