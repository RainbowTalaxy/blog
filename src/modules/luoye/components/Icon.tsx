import clsx from 'clsx';
import { PROJECT_ICON } from '../constants';
import styles from '../styles/home.module.css';
import { useHistory } from '@docusaurus/router';

interface Props {
    className?: string;
}

const Icon = ({ className }: Props) => {
    const history = useHistory();

    return (
        <span className={clsx(styles.pageIcon, className)} onClick={() => history.push('/luoye')}>
            {PROJECT_ICON}
        </span>
    );
};

export default Icon;
