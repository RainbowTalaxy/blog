import { useHistory } from '@docusaurus/router';
import { PROJECT_ICON, PROJECT_NAME } from '../constants';
import styles from '../styles/home.module.css';

const ProjectTitle = () => {
    const history = useHistory();

    return (
        <h1 className={styles.projectTitle} onClick={() => history.push('/luoye')}>
            <span className={styles.pageIcon}>{PROJECT_ICON}</span>
            {PROJECT_NAME}
        </h1>
    );
};

export default ProjectTitle;
