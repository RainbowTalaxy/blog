import { useHistory } from '@docusaurus/router';
import { PROJECT_ICON, PROJECT_NAME } from '../constants';
import styles from '../styles/home.module.css';
import useUser from '@site/src/hooks/useUser';
import Spacer from '@site/src/components/Spacer';
import Path from '@site/src/utils/Path';
import clsx from 'clsx';
import SVG from '../components/SVG';
import { revealSidebar } from '../components/SideBar';

interface Props {
    className?: string;
    marginBottom?: number | string;
    owner?: string;
    showInfo?: boolean;
    fold?: boolean;
}

const ProjectTitle = ({ className, marginBottom = 0, owner, fold = false, showInfo = true }: Props) => {
    const user = useUser();
    const history = useHistory();

    return (
        <div className={clsx(styles.projectTitle, className)} style={{ marginBottom }}>
            {fold && (
                <span className={clsx(styles.pageFoldIcon)} onClick={revealSidebar}>
                    <SVG.Hamburger />
                </span>
            )}
            <span className={clsx(styles.pageIcon, !fold && styles.showIcon)} onClick={() => history.push('/luoye')}>
                {PROJECT_ICON}
            </span>
            <h1 className={styles.pageName} onClick={() => history.push('/luoye')}>
                {PROJECT_NAME}
            </h1>
            <Spacer />
            {showInfo && (
                <span
                    className={styles.pageUser}
                    onClick={() => {
                        if (!owner) Path.toUserConfig();
                    }}
                >
                    {(owner ?? user?.id)?.toUpperCase() || '登 录'}
                </span>
            )}
        </div>
    );
};

export default ProjectTitle;
