import Link from '@docusaurus/Link';
import { useContext, useState } from 'react';
import { PageContext } from '../models/context';
import Github from '/svg/github-fill.svg';
import Unsplash from '/svg/unsplash-fill.svg';
import '../styles/nav-bar.css';

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
    const [statusIdx, setStatusIdx] = useState(() => {
        return Number(localStorage.getItem(OW_USER_STATUS)) || 0;
    });

    return (
        <nav className="ow-nav-bar">
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
            <div
                className="ow-nav-user"
                onClick={() => {
                    setStatusIdx((prev) => {
                        const newIdx = (prev + 1) % STATUS_LIST.length;
                        localStorage.setItem(OW_USER_STATUS, newIdx + '');
                        console.log(localStorage);
                        return newIdx;
                    });
                }}
            >
                <div
                    className="ow-nav-user-status"
                    style={{ backgroundColor: STATUS_LIST[statusIdx] }}
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
    );
};

export default NavBar;
