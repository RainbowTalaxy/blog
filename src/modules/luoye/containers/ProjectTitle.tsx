import { useHistory } from '@docusaurus/router';
import { PROJECT_ICON, PROJECT_NAME } from '../constants';
import styles from '../styles/home.module.css';
import useUser from '@site/src/hooks/useUser';
import Spacer from '@site/src/components/Spacer';
import Path from '@site/src/utils/Path';

interface Props {
    marginBottom?: number | string;
    owner?: string;
}

const ProjectTitle = ({ marginBottom = 0, owner }: Props) => {
    const user = useUser();
    const history = useHistory();

    return (
        <div className={styles.projectTitle} style={{ marginBottom }}>
            <span className={styles.pageIcon} onClick={() => history.push('/luoye')}>
                {PROJECT_ICON}
            </span>
            <h1 className={styles.pageName} onClick={() => history.push('/luoye')}>
                {PROJECT_NAME}
            </h1>
            <Spacer />
            <span
                className={styles.pageUser}
                onClick={() => {
                    if (!owner) Path.toUserConfig();
                }}
            >
                {(owner ?? user?.id)?.toUpperCase() || '请先登录'}
            </span>
        </div>
    );
};

export default ProjectTitle;
