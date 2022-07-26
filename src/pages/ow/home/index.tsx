import Overwatch from '..';
import styles from './index.module.css';

const { info, avatar, label, nickname, topBg, secondary } = styles;

const Page = () => {
    return (
        <Overwatch>
            <div className={info}>
                <div className={avatar}>
                    <img src="/img/mercy.png" alt="avatar" />
                </div>
                <div className={label}>
                    <div className={nickname}>TALAXY</div>
                    <div className={secondary}>
                        <span>@</span>rainbowtalaxy
                    </div>
                </div>
            </div>
            <div className={topBg} />
        </Overwatch>
    );
};

export default Page;
