import styles from './index.module.css';
import Layout from '@theme/Layout';
// @ts-ignore
import README from '../../README.md';

const Page = () => {
    return (
        <Layout title="项目概要">
            <div className={styles['custom-page']}>
                <README />
            </div>
        </Layout>
    );
};

export default Page;
