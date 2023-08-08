import { useCallback, useEffect, useState } from 'react';
import { DocItem, Scope, WorkspaceItem } from '@site/src/api/luoye';
import API from '@site/src/api';
import styles from '../styles/home.module.css';
import ContentWithSideBar, { SideBarList, SideBarListItem } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { DEFAULT_WORKSPACE, DEFAULT_WORKSPACE_PLACEHOLDER, PROJECT_NAME } from '../constants';
import { useHistory } from '@docusaurus/router';
import ProjectTitle from '../containers/ProjectTitle';
import useQuery from '@site/src/hooks/useQuery';
import Welcome from '../containers/Welcome';
import DocList from '../containers/DocList';
import Placeholder from '../components/PlaceHolder';
import SVG from '../components/SVG';
import Head from '@docusaurus/Head';

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
            const defaultWorkspaceIdx = workspaces.findIndex((workspace) => workspace.name === DEFAULT_WORKSPACE.name);
            const defaultWorkspace = workspaces[defaultWorkspaceIdx] || workspaces[0];
            if (defaultWorkspaceIdx !== -1) {
                workspaces.splice(defaultWorkspaceIdx, 1);
            }
            defaultWorkspace.name = DEFAULT_WORKSPACE_PLACEHOLDER.name;
            defaultWorkspace.description = DEFAULT_WORKSPACE_PLACEHOLDER.description;
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
            <Head>
                <title>{PROJECT_NAME}</title>
                <meta name="theme-color" content="#ffedcc" />
            </Head>
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
                                            <span>{workspace.name || <Placeholder>未命名</Placeholder>}</span>
                                            {workspace.scope === Scope.Private && <SVG.Lock />}
                                        </SideBarListItem>
                                    ))}
                                </SideBarList>
                            </>
                        )}
                    </>
                }
            >
                <div className={styles.pageView}>
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
