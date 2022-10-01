import Link from '@docusaurus/Link';
import { useContext, useEffect, useState } from 'react';
import Github from '/svg/github-fill.svg';
import Unsplash from '/svg/unsplash-fill.svg';
import Menu from '/svg/menu.svg';
import '../styles/nav-bar.css';
import { PageContext, Router } from '../models/context';
import clsx from 'clsx';
import { Screen } from '@site/src/hooks/useScreen';
import Spacer from '@site/src/components/Spacer';

enum UserStatus {
    Online = '#7cff00',
    Standby = '#f7cc1d',
    Busy = '#bd1d2c',
    Offline = '#7e7e7e',
}

const STATUS_LIST = [
    UserStatus.Online,
    UserStatus.Standby,
    UserStatus.Busy,
    UserStatus.Offline,
];
const OW_USER_STATUS = 'ow-user-status';

const NavBar = () => {
    const { state, screen, history } = useContext(PageContext);
    const [statusIdx, setStatusIdx] = useState<number>();
    const [isMenuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        setStatusIdx(Number(localStorage.getItem(OW_USER_STATUS)) || 0);
    }, []);

    return (
        <>
            <nav
                className={clsx(
                    'ow-nav-bar',
                    state.tabs?.length && 'ow-nav-bar-full',
                )}
            >
                {state.tabs?.length && (
                    <>
                        {screen > Screen.Small ? (
                            state.tabs.map((tab) => (
                                <div
                                    key={tab}
                                    className={clsx(
                                        'ow-nav-bar-tab',
                                        state.router === tab && 'active',
                                    )}
                                    onClick={() =>
                                        history.replace({
                                            ...state,
                                            router: tab,
                                        })
                                    }
                                >
                                    {tab}
                                </div>
                            ))
                        ) : (
                            <div
                                className="ow-nav-button menu"
                                onClick={() => setMenuVisible(true)}
                            >
                                <Menu />
                            </div>
                        )}
                        <Spacer />
                    </>
                )}
                {!(state.tabs?.length && screen <= Screen.Medium) && (
                    <div className="ow-nav-button-group">
                        <Link
                            className="ow-nav-button unsplash"
                            href="https://unsplash.com/@talaxy"
                        >
                            <Unsplash />
                        </Link>
                        <Link
                            className="ow-nav-button github"
                            href="https://github.com/RainbowTalaxy"
                        >
                            <Github />
                        </Link>
                    </div>
                )}
                <div
                    className="ow-nav-user"
                    onClick={() => {
                        setStatusIdx((prev) => {
                            const newIdx = (prev + 1) % STATUS_LIST.length;
                            localStorage.setItem(OW_USER_STATUS, newIdx + '');
                            return newIdx;
                        });
                    }}
                >
                    <div
                        className="ow-nav-user-status"
                        style={{
                            backgroundColor:
                                statusIdx !== undefined &&
                                STATUS_LIST[statusIdx],
                        }}
                    />
                    <img
                        className="ow-nav-avatar"
                        src="/img/mercy.png"
                        alt="avatar"
                        draggable={false}
                    />
                    <span className="ow-nav-nickname">TALAXY</span>
                </div>
            </nav>
            {state.tabs?.length && isMenuVisible && (
                <div className="ow-nav-mask">
                    {state.tabs.map((tab, idx) => (
                        <div
                            key={tab}
                            className="ow-nav-mask-menu-cell"
                            // @ts-ignore
                            style={{ '--i': idx }}
                            onClick={() => {
                                setMenuVisible(false);
                                history.replace({
                                    ...state,
                                    router: tab,
                                });
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                    <div
                        className="ow-nav-mask-menu-cell cancel"
                        // @ts-ignore
                        style={{ '--i': state.tabs.length }}
                        onClick={() => setMenuVisible(false)}
                    >
                        取消
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBar;
