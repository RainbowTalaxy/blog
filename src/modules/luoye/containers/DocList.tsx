import { useHistory } from '@docusaurus/router';
import API from '@site/src/api';
import { Scope, Workspace, WorkspaceItem } from '@site/src/api/luoye';
import { Button } from '@site/src/components/Form';
import Spacer from '@site/src/components/Spacer';
import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_WORKSPACE_PLACEHOLDER, date, workSpaceName } from '../constants';
import styles from '../styles/home.module.css';
import DocForm from './DocForm';
import Placeholder from '../components/PlaceHolder';
import SVG from '../components/SVG';
import WorkspaceForm from './WorkspaceForm';
import useUser from '@site/src/hooks/useUser';
import { hideSidebar } from '../components/SideBar';
import Toast from '../components/Notification/Toast';

interface Props {
    workspaceId: string;
    allWorkspaces: WorkspaceItem[];
    refetch: () => Promise<void>;
}

const DocList = ({ workspaceId, allWorkspaces, refetch }: Props) => {
    const history = useHistory();
    const user = useUser();
    const [workspace, setWorkspace] = useState<Workspace | null>();
    const [isDocFormVisible, setDocFormVisible] = useState(false);
    const [isWorkspaceFormVisible, setWorkspaceFormVisible] = useState(false);

    const refetchWorkspace = useCallback(async () => {
        try {
            const workspace = await API.luoye.workspace(workspaceId);
            setWorkspace(workspace);
        } catch (error: any) {
            Toast.notify(`获取工作区数据失败：${error.message}`);
            setWorkspace(null);
        }
        hideSidebar();
    }, [workspaceId]);

    useEffect(() => {
        refetchWorkspace();
    }, [refetchWorkspace]);

    if (workspace === undefined) return null;
    if (workspace === null) return <p>工作区不存在</p>;

    return (
        <>
            <div className={styles.titleBar}>
                <h2 className={styles.pageTitle}>{workSpaceName(workspace.name)}</h2>
                <span className={styles.settings} onClick={() => setWorkspaceFormVisible(true)}>
                    设置
                </span>
            </div>
            <p className={styles.pageDescription}>
                {user?.id === workspace.id ? DEFAULT_WORKSPACE_PLACEHOLDER.description : workspace.description}
            </p>
            <h2 className={styles.docTitleBar}>
                文档列表
                <Spacer />
                <Button type="primary" onClick={() => setDocFormVisible(true)}>
                    新建文档
                </Button>
            </h2>

            {workspace.docs.length === 0 ? (
                <div className={styles.docList}>
                    <div className={styles.docItem}>
                        <Placeholder>暂无文档</Placeholder>
                    </div>
                </div>
            ) : (
                <div className={styles.docList}>
                    {workspace.docs.map((doc) => (
                        <div
                            className={styles.docItem}
                            key={doc.docId}
                            onClick={() => history.push(`/luoye/doc?id=${doc.docId}`)}
                        >
                            <div className={styles.docName}>{doc.name || <Placeholder>未命名文档</Placeholder>}</div>
                            {doc.scope === Scope.Private && <SVG.Lock />}
                            <Spacer />
                            <div className={styles.docDate}>{date(doc.updatedAt)}</div>
                        </div>
                    ))}
                </div>
            )}
            {isDocFormVisible && (
                <DocForm
                    workspace={workspace}
                    workspaceItems={allWorkspaces}
                    onClose={async (success, newDocId) => {
                        if (success) await refetch();
                        setDocFormVisible(false);
                        if (newDocId) history.push(`/luoye/doc?id=${newDocId}`);
                    }}
                />
            )}
            {isWorkspaceFormVisible && (
                <WorkspaceForm
                    workspace={workspace}
                    onClose={async (success) => {
                        if (success) {
                            await refetchWorkspace();
                            await refetch();
                        }
                        setWorkspaceFormVisible(false);
                    }}
                />
            )}
        </>
    );
};

export default DocList;
