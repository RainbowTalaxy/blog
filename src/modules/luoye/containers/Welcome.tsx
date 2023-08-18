import { useHistory } from '@docusaurus/router';
import { DocItem, Scope, WorkspaceItem } from '@site/src/api/luoye';
import { useState } from 'react';
import { date } from '../constants';
import styles from '../styles/home.module.css';
import DocForm from './DocForm';
import WorkspaceForm from './WorkspaceForm';
import Placeholder from '../components/PlaceHolder';
import SVG from '../components/SVG';
import Spacer from '@site/src/components/Spacer';

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
            <div className={styles.titleBar}>
                <h2 className={styles.pageTitle}>开始</h2>
            </div>
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
                        onClick={() => history.push(`?workspace=${workspace.id}`)}
                    >
                        <div className={styles.workspaceName}>
                            <span>🪴</span>
                            <div>{workspace.name || <Placeholder>未命名</Placeholder>}</div>
                            {workspace.scope === Scope.Private && <SVG.Lock />}
                        </div>
                        <div className={styles.description}>
                            {workspace.description || <Placeholder>暂无描述</Placeholder>}
                        </div>
                    </div>
                ))}
            </div>
            <h2>最近文档</h2>
            {data.docs.length === 0 ? (
                <p>
                    <Placeholder>暂无文档</Placeholder>
                </p>
            ) : (
                <div className={styles.docList}>
                    {data.docs.slice(0, 10).map((doc) => (
                        <div
                            className={styles.docItem}
                            key={doc.id}
                            onClick={() => history.push(`/luoye/doc?id=${doc.id}`)}
                        >
                            <div className={styles.docName}>{doc.name || <Placeholder>未命名文档</Placeholder>}</div>
                            {doc.scope === Scope.Private && <SVG.Lock />}
                            <Spacer />
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
                    workspace={data.defaultWorkspace}
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
