import Link from '@docusaurus/Link';
import { useContext } from 'react';
import { PageContext } from '../models/context';
import Github from '/svg/github-fill.svg';
import Unsplash from '/svg/unsplash-fill.svg';
import '../styles/nav-bar.css';

const NavBar = () => {
    const context = useContext(PageContext);

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
            <div className="ow-nav-user">
                <div className="ow-nav-user-status" />
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
