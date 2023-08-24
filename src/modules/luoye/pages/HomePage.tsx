import { useCallback, useEffect, useState } from 'react';
import { DocItem, Scope, WorkspaceItem } from '@site/src/api/luoye';
import API from '@site/src/api';
import styles from '../styles/home.module.css';
import ContentWithSideBar, { SideBarList, SideBarListItem, hideSidebar } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { PROJECT_NAME, splitWorkspace } from '../constants';
import { useHistory } from '@docusaurus/router';
import ProjectTitle from '../containers/ProjectTitle';
import useQuery from '@site/src/hooks/useQuery';
import Welcome from '../containers/Welcome';
import DocList from '../containers/DocList';
import Placeholder from '../components/PlaceHolder';
import SVG from '../components/SVG';
import Head from '@docusaurus/Head';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const HomePage = () => {
    const history = useHistory();
    const query = useQuery();
    const workspaceId = query.get('workspace');
    const [data, setData] = useState<{
        defaultWorkspace: WorkspaceItem;
        workspaces: WorkspaceItem[];
        docs: DocItem[];
    } | null>();

    const refetch = useCallback(async () => {
        try {
            const [workspaces, docs] = await Promise.all([API.luoye.workspaceItems(), API.luoye.docs()]);
            setData({
                ...splitWorkspace(workspaces),
                docs,
            });
            hideSidebar();
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
                <meta name="theme-color" content="#fff8ed" />
            </Head>
            <GlobalStyle />
            <ContentWithSideBar
                sidebar={
                    <>
                        <ProjectTitle className={styles.fixedTitle} />
                        {allWorkspaces && (
                            <>
                                <SideBarList>
                                    <SideBarListItem active={!workspaceId} icon="🍄" onClick={() => history.push('?')}>
                                        开始
                                    </SideBarListItem>
                                    <SideBarListItem
                                        icon="🪴"
                                        active={workspaceId === data.defaultWorkspace.id}
                                        onClick={() => history.push(`?workspace=${data.defaultWorkspace.id}`)}
                                    >
                                        <span>{data.defaultWorkspace.name || <Placeholder>未命名</Placeholder>}</span>
                                        {data.defaultWorkspace.scope === Scope.Private && <SVG.Lock />}
                                    </SideBarListItem>
                                </SideBarList>
                                <h2>工作区</h2>
                                <DragDropContext
                                    onDragEnd={async (result) => {
                                        const sourceIdx = result.source.index;
                                        const destIdx = result.destination?.index ?? -1;
                                        if (destIdx < 0 || sourceIdx === destIdx) return;
                                        const reOrdered = Array.from(data.workspaces);
                                        const [removed] = reOrdered.splice(sourceIdx, 1);
                                        reOrdered.splice(destIdx, 0, removed);
                                        // 先更新状态，避免回弹动画
                                        setData({
                                            ...data,
                                            workspaces: reOrdered,
                                        });
                                        try {
                                            const newWorkspaceItems = await API.luoye.updateWorkspaceItems(
                                                reOrdered
                                                    .map((workspace) => workspace.id)
                                                    .concat(data.defaultWorkspace.id),
                                            );
                                            setData({
                                                ...data,
                                                ...splitWorkspace(newWorkspaceItems),
                                            });
                                        } catch (error) {
                                            console.log(error);
                                            setData(data);
                                        }
                                    }}
                                >
                                    <Droppable droppableId="droppable">
                                        {(provided) => (
                                            <SideBarList ref={provided.innerRef} {...provided.droppableProps}>
                                                {data.workspaces.map((workspace, index) => (
                                                    <Draggable
                                                        key={workspace.id}
                                                        draggableId={workspace.id}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <SideBarListItem
                                                                ref={provided.innerRef}
                                                                active={workspaceId === workspace.id}
                                                                onClick={() =>
                                                                    history.push(`?workspace=${workspace.id}`)
                                                                }
                                                                draggableProps={provided.draggableProps}
                                                                dragHandleProps={provided.dragHandleProps}
                                                                style={provided.draggableProps.style}
                                                            >
                                                                <span>
                                                                    {workspace.name || (
                                                                        <Placeholder>未命名</Placeholder>
                                                                    )}
                                                                </span>
                                                                {workspace.scope === Scope.Private && <SVG.Lock />}
                                                            </SideBarListItem>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </SideBarList>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </>
                        )}
                    </>
                }
                navbar={<ProjectTitle fold />}
            >
                <div className={styles.pageView}>
                    {data && !workspaceId && <Welcome data={data} refetch={refetch} />}
                    {data && workspaceId && allWorkspaces && (
                        <DocList workspaceId={workspaceId} allWorkspaces={allWorkspaces} refetch={refetch} />
                    )}
                </div>
            </ContentWithSideBar>
        </div>
    );
};

export default HomePage;
