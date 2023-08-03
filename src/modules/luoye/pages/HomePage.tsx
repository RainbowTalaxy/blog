import { useCallback, useEffect, useState } from 'react';
import { DocItem, WorkspaceItem } from '@site/src/api/luoye';
import API from '@site/src/api';
import { Button } from '@site/src/components/Form';
import Path from '@site/src/utils/Path';
import styles from '../styles/home.module.css';
import ContentWithSideBar, { SideBarList, SideBarListItem } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { DEFAULT_WORKSPACE_NAME, PROJECT_NAME } from '../constants';
import { useHistory } from '@docusaurus/router';
import ProjectTitle from '../containers/ProjectTitle';
import useQuery from '@site/src/hooks/useQuery';
import Welcome from '../containers/Welcome';
import DocList from '../containers/DocList';

const HomePage = () => {
    const history = useHistory();
    const query = useQuery();
    const workspaceId = query.get('workspace');
    const [data, setData] = useState<{
        defaultWorkspace: WorkspaceItem;
        workspaces: WorkspaceItem[];
        docs: DocItem[];
    }>();

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
        document.title = PROJECT_NAME;
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
                        <ProjectTitle />
                        {allWorkspaces && (
                            <>
                                <SideBarList>
                                    <SideBarListItem
                                        active={!workspaceId}
                                        icon="🍄"
                                        onClick={() => history.replace('?')}
                                    >
                                        开始
                                    </SideBarListItem>
                                </SideBarList>
                                <h2>工作区</h2>
                                <SideBarList>
                                    {allWorkspaces.map((workspace) => (
                                        <SideBarListItem
                                            key={workspace.id}
                                            active={workspaceId === workspace.id}
                                            onClick={() => history.replace(`?workspace=${workspace.id}`)}
                                        >
                                            {workspace.name || '未命名'}
                                        </SideBarListItem>
                                    ))}
                                </SideBarList>
                            </>
                        )}
                    </>
                }
            >
                <div className={styles.pageView}>
                    {data === null && <Button onClick={() => Path.toUserConfig()}>请先登录</Button>}
                    {data && !workspaceId && <Welcome data={data} refetch={refetch} />}
                    {data && workspaceId && (
                        <DocList workspaceId={workspaceId} allWorkspaces={allWorkspaces} refetch={refetch} />
                    )}
                </div>
            </ContentWithSideBar>
        </div>
    );
};

export default HomePage;
