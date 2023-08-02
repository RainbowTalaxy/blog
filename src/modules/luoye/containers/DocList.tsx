import { useHistory } from '@docusaurus/router';
import API from '@site/src/api';
import { Workspace, WorkspaceItem } from '@site/src/api/luoye';
import { Button } from '@site/src/components/Form';
import Spacer from '@site/src/components/Spacer';
import { useEffect, useState } from 'react';
import { date } from '../constants';
import styles from '../styles/home.module.css';
import DocForm from './DocForm';

interface Props {
    workspaceId: string;
    allWorkspaces: WorkspaceItem[];
    refetch: () => Promise<void>;
}

const DocList = ({ workspaceId, allWorkspaces, refetch }: Props) => {
    const history = useHistory();
    const [workspace, setWorkspace] = useState<Workspace>();
    const [isDocFormVisible, setDocFormVisible] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const workspace = await API.luoye.workspace(workspaceId);
                setWorkspace(workspace);
            } catch (error) {
                console.log(error);
                setWorkspace(null);
            }
        })();
    }, [workspaceId]);

    if (workspace === undefined) return null;
    if (workspace === null) return <p>工作区不存在</p>;

    return (
        <>
            <h2 className={styles.pageTitle}>{workspace.name}</h2>
            <h2 className={styles.titleBar}>
                文档列表
                <Spacer />
                <Button type="primary" onClick={() => setDocFormVisible(true)}>
                    新建文档
                </Button>
            </h2>

            <div className={styles.docList}>
                {workspace.docs.length === 0 ? (
                    <div className={styles.docItem}>暂无文档</div>
                ) : (
                    workspace.docs.map((doc) => (
                        <div
                            className={styles.docItem}
                            key={doc.docId}
                            onClick={() => history.push(`/luoye/doc?id=${doc.docId}`)}
                        >
                            <div className={styles.docName}>{doc.name || '未命名文档'}</div>
                            <div className={styles.docDate}>{date(doc.updatedAt)}</div>
                        </div>
                    ))
                )}
            </div>
            {isDocFormVisible && (
                <DocForm
                    workspaceId={workspaceId}
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

export default DocList;
