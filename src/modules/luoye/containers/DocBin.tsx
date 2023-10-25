import styles from '../styles/home.module.css';
import { useHistory } from '@docusaurus/router';
import API from '@site/src/api';
import { DocBinItem } from '@site/src/api/luoye';
import Spacer from '@site/src/components/Spacer';
import { useEffect, useState } from 'react';
import { date } from '../constants';
import Placeholder from '../components/PlaceHolder';
import { hideSidebar } from '../components/SideBar';
import Toast from '../components/Notification/Toast';

const DocBin = () => {
    const history = useHistory();
    const [docBin, setDocBin] = useState<DocBinItem[] | null>();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const data = await API.luoye.docBin();
                if (isMounted) setDocBin(data);
            } catch (error: any) {
                Toast.notify(error.message);
                if (isMounted) setDocBin(null);
            }
            hideSidebar();
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    if (docBin === undefined) return null;
    if (docBin === null) return <p>网络遇到了错误</p>;

    return (
        <>
            <div className={styles.titleBar}>
                <h2 className={styles.pageTitle}>文档回收站</h2>
            </div>
            <p className={styles.pageDescription}>删除的文档会在这里显示</p>

            {docBin.length === 0 ? (
                <p>
                    <Placeholder>暂无文档</Placeholder>
                </p>
            ) : (
                <div className={styles.docList}>
                    {docBin.map((doc) => (
                        <div
                            className={styles.docItem}
                            key={doc.docId}
                            onClick={() => history.push(`/luoye/doc?id=${doc.docId}`)}
                        >
                            <div className={styles.docName}>{doc.name || <Placeholder>未命名文档</Placeholder>}</div>
                            <Spacer />
                            <div className={styles.docUser}>{doc.executor}</div>
                            <div className={styles.docDate}>{date(doc.deletedAt)}</div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default DocBin;
