import { useHistory } from '@docusaurus/router';
import { DocItem, WorkspaceItem } from '@site/src/api/luoye';
import { useState } from 'react';
import { date } from '../constants';
import styles from '../styles/home.module.css';
import DocForm from './DocForm';
import WorkspaceForm from './WorkspaceForm';

interface Props {
    data: {
        defaultWorkspace: WorkspaceItem;
        workspaces: WorkspaceItem[];
        docs: DocItem[];
    };
    refetch: () => Promise<void>;
}

const Welcome = ({ data, refetch }: Props) => {
    const history = useHistory();
    const [isWorkspaceFormVisible, setWorkspaceFormVisible] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);

    const allWorkspaces = data && [data.defaultWorkspace, ...data.workspaces];

    return (
        <>
            <h2 className={styles.pageTitle}>开始</h2>
            <div className={styles.actionSheet}>
                <div className={styles.action} onClick={() => setWorkspaceFormVisible(true)}>
                    <span>🪸</span>新建工作区
                </div>
                <div className={styles.action} onClick={() => setDocFormVisible(true)}>
                    <span>🍂</span>新建文档
                </div>
            </div>
            <h2>工作区</h2>
            <div className={styles.workspaceList}>
                {allWorkspaces.map((workspace) => (
                    <div
                        className={styles.workspaceItem}
                        key={workspace.id}
                        onClick={() => history.replace(`?workspace=${workspace.id}`)}
                    >
                        <div className={styles.workspaceName}>
                            <span>🪴</span>
                            <div>{workspace.name || '未命名'}</div>
                        </div>
                        <div className={styles.description}>{workspace.description}</div>
                    </div>
                ))}
            </div>
            <h2>文档</h2>
            {data.docs.length === 0 ? (
                <p>暂无文档</p>
            ) : (
                <div className={styles.docList}>
                    {data.docs.map((doc) => (
                        <div
                            className={styles.docItem}
                            key={doc.id}
                            onClick={() => history.push(`/luoye/doc?id=${doc.id}`)}
                        >
                            <div className={styles.docName}>{doc.name || '未命名文档'}</div>
                            <div className={styles.docCreator}>{doc.creator}</div>
                            <div className={styles.docDate}>{date(doc.updatedAt)}</div>
                        </div>
                    ))}
                </div>
            )}
            {isWorkspaceFormVisible && (
                <WorkspaceForm
                    onClose={async (success) => {
                        if (success) await refetch();
                        setWorkspaceFormVisible(false);
                    }}
                />
            )}
            {data && isDocFormVisible && (
                <DocForm
                    workspaceItems={allWorkspaces}
                    onClose={async (success, newDocId) => {
                        if (success) await refetch();
                        setDocFormVisible(false);
                        if (newDocId) history.push(`/luoye/doc?id=${newDocId}`);
                    }}
                />
            )}
        </>
    );
};

export default Welcome;
