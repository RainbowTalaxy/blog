import { useCallback, useEffect, useState } from 'react';
import { DocItem, WorkspaceItem } from '@site/src/api/luoye';
import API from '@site/src/api';
import { Button } from '@site/src/components/Form';
import Path from '@site/src/utils/Path';
import styles from '../styles/home.module.css';
import ContentWithSideBar, { SideBarList, SideBarListItem } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { date, DEFAULT_WORKSPACE_NAME } from '../constants';
import WorkspaceForm from '../components/WorkspaceForm';
import DocForm from '../components/DocForm';

const HomePage = () => {
    const [data, setData] = useState<{
        defaultWorkspace: WorkspaceItem;
        workspaces: WorkspaceItem[];
        docs: DocItem[];
    }>();
    const [isWorkspaceFormVisible, setWorkspaceFormVisible] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);

    const refetch = useCallback(async () => {
        try {
            const [workspaces, docs] = await Promise.all([API.luoye.workspaces(), API.luoye.docs()]);
            // 摘取默认工作区
            const defaultWorkspaceIdx = workspaces.findIndex((workspace) => workspace.name === DEFAULT_WORKSPACE_NAME);
            const defaultWorkspace = workspaces[defaultWorkspaceIdx] || workspaces[0];
            if (defaultWorkspaceIdx !== -1) {
                workspaces.splice(defaultWorkspaceIdx, 1);
            }
            defaultWorkspace.name = '个人工作区';
            defaultWorkspace.description = '用于存放个人文档的工作区';
            setData({
                defaultWorkspace,
                workspaces,
                docs,
            });
        } catch (error) {
            console.log(error);
            setData(null);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const allWorkspaces = data && [data.defaultWorkspace, ...data.workspaces];

    return (
        <div className={styles.container}>
            <GlobalStyle />
            <ContentWithSideBar
                sidebar={
                    <>
                        <h1 className={styles.projectTitle}>
                            <span className={styles.pageIcon}>🍂</span>落页
                        </h1>
                        <SideBarList>
                            <SideBarListItem active icon="🍄">
                                开始
                            </SideBarListItem>
                        </SideBarList>
                        <h2>工作区</h2>
                        {allWorkspaces && (
                            <SideBarList>
                                {allWorkspaces.map((workspace) => (
                                    <SideBarListItem key={workspace.id}>{workspace.name || '未命名'}</SideBarListItem>
                                ))}
                            </SideBarList>
                        )}
                    </>
                }
            >
                <div className={styles.pageView}>
                    {data === null && <Button onClick={() => Path.toUserConfig()}>请先登录</Button>}
                    {data && (
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
                                    <div className={styles.workspaceItem} key={workspace.id}>
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
                                        <div className={styles.docItem} key={doc.id}>
                                            <div className={styles.docName || '未命名文档'}>{doc.name}</div>
                                            <div className={styles.docCreator}>{doc.creator}</div>
                                            <div className={styles.docDate}>{date(doc.updatedAt)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
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
                        workspaceId={data.defaultWorkspace.id}
                        onClose={async (success) => {
                            if (success) await refetch();
                            setDocFormVisible(false);
                        }}
                    />
                )}
            </ContentWithSideBar>
        </div>
    );
};

export default HomePage;
