import { useHistory } from '@docusaurus/router';
import { PROJECT_ICON, PROJECT_NAME } from '../constants';
import styles from '../styles/home.module.css';
import useUser from '@site/src/hooks/useUser';
import Spacer from '@site/src/components/Spacer';
import Path from '@site/src/utils/Path';

const ProjectTitle = () => {
    const user = useUser();
    const history = useHistory();

    return (
        <h1 className={styles.projectTitle} onClick={() => history.push('/luoye')}>
            <span className={styles.pageIcon}>{PROJECT_ICON}</span>
            {PROJECT_NAME}
            <Spacer />
            <span className={styles.pageUser} onClick={() => Path.toUserConfig()}>
                {user?.id || '请先登录'}
            </span>
        </h1>
    );
};

export default ProjectTitle;
