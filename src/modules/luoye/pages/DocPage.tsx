import styles from '../styles/home.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import ContentWithSideBar, { SideBarList, SideBarListItem, hideSidebar } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { Doc, Scope, Workspace } from '@site/src/api/luoye';
import useQuery from '@site/src/hooks/useQuery';
import API from '@site/src/api';
import Document, { DocRefProps } from '../containers/Document';
import { useHistory } from '@docusaurus/router';
import { LEAVE_EDITING_TEXT, PROJECT_NAME, checkAuth, workSpaceName } from '../constants';
import ProjectTitle from '../containers/ProjectTitle';
import Placeholder from '../components/PlaceHolder';
import SVG from '../components/SVG';
import WorkspaceForm from '../containers/WorkspaceForm';
import DocForm from '../containers/DocForm';
import Head from '@docusaurus/Head';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import Toast from '../components/Notification/Toast';

const DocPage = () => {
    const history = useHistory();
    const query = useQuery();
    const id = query.get('id') ?? '';
    const [doc, setDoc] = useState<Doc | null>();
    const [workspace, setWorkspace] = useState<Workspace | null>();
    const [isWorkspaceFormVisible, setWorkspaceFormVisible] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);
    const docRef = useRef<DocRefProps>(null);

    const saveCheck = useCallback(() => {
        if (!docRef.current?.isEditing) return true;
        return confirm(LEAVE_EDITING_TEXT);
    }, []);

    const refetch = useCallback(async () => {
        try {
            const docData = await API.luoye.doc(id);
            setDoc(docData);
        } catch (error: any) {
            Toast.notify(error.message);
            setDoc(null);
        }
    }, [id]);

    useEffect(() => {
        if (!doc) return;
        (async () => {
            try {
                const workspaceData = await API.luoye.workspace(doc.workspaces[0]);
                setWorkspace(workspaceData);
            } catch (error: any) {
                setWorkspace(null);
            }
            hideSidebar();
        })();
    }, [doc]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (doc === undefined) return null;
    if (doc && workspace === undefined) return null;

    const spaceAuth = checkAuth(workspace);
    const isDeleted = Boolean(doc?.deletedAt);
    const isSidebarVisible = Boolean(workspace) && !isDeleted;

    return (
        <div className={clsx(styles.container)}>
            <Head>
                <title>
                    {doc ? doc.name || '未命名' : '文档不存在'} | {PROJECT_NAME}
                </title>
                <meta name="theme-color" content="#fff8ed" />
                <link rel="icon" href="https://blog.talaxy.cn/img/luoye.png" />
            </Head>
            <GlobalStyle />
            <ContentWithSideBar
                navbar={<ProjectTitle owner={doc?.creator ?? '404'} fold navigatePreCheck={saveCheck} />}
                sidebarVisible={isSidebarVisible}
                sidebar={
                    workspace && (
                        <>
                            <ProjectTitle className={styles.fixedTitle} navigatePreCheck={saveCheck} />
                            <h2>
                                <span>{workSpaceName(workspace.name)}</span>
                                {workspace.scope === Scope.Private && <SVG.Lock />}
                            </h2>
                            {spaceAuth.configurable && (
                                <>
                                    <SideBarList>
                                        <SideBarListItem
                                            onClick={() => {
                                                if (saveCheck()) setDocFormVisible(true);
                                            }}
                                        >
                                            新建文档
                                        </SideBarListItem>
                                        <SideBarListItem onClick={() => setWorkspaceFormVisible(true)}>
                                            工作区属性
                                        </SideBarListItem>
                                    </SideBarList>
                                    <h2>文档列表</h2>
                                </>
                            )}
                            <DragDropContext
                                onDragEnd={async (result) => {
                                    const sourceIdx = result.source.index;
                                    const destIdx = result.destination?.index ?? -1;
                                    if (destIdx < 0 || sourceIdx === destIdx) return;
                                    const reOrdered = Array.from(workspace.docs);
                                    const [removed] = reOrdered.splice(sourceIdx, 1);
                                    reOrdered.splice(destIdx, 0, removed);
                                    // 先更新状态，避免回弹动画
                                    setWorkspace({
                                        ...workspace,
                                        docs: reOrdered,
                                    });
                                    try {
                                        const newWorkspace = await API.luoye.updateWorkspace(workspace.id, {
                                            docs: reOrdered,
                                        });
                                        setWorkspace(newWorkspace);
                                    } catch (error: any) {
                                        Toast.notify(error.message);
                                        setWorkspace(workspace);
                                    }
                                }}
                            >
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <SideBarList ref={provided.innerRef} {...provided.droppableProps}>
                                            {workspace.docs.map((docDir, index) => (
                                                <Draggable key={docDir.docId} draggableId={docDir.docId} index={index}>
                                                    {(provided) => (
                                                        <SideBarListItem
                                                            ref={provided.innerRef}
                                                            active={docDir.docId === id}
                                                            onClick={() => {
                                                                if (saveCheck()) history.push(`?id=${docDir.docId}`);
                                                            }}
                                                            draggableProps={provided.draggableProps}
                                                            dragHandleProps={provided.dragHandleProps}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <span>
                                                                {docDir.name || <Placeholder>未命名</Placeholder>}
                                                            </span>
                                                            {docDir.scope === Scope.Private && <SVG.Lock />}
                                                        </SideBarListItem>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </SideBarList>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </>
                    )
                }
            >
                <Document ref={docRef} doc={doc} workspace={workspace} onSave={refetch} />
            </ContentWithSideBar>
            {workspace && isWorkspaceFormVisible && (
                <WorkspaceForm
                    workspace={workspace}
                    onClose={async (success) => {
                        if (success) await refetch();
                        setWorkspaceFormVisible(false);
                    }}
                />
            )}
            {workspace && spaceAuth.configurable && isDocFormVisible && (
                <DocForm
                    workspace={workspace}
                    onClose={async (success, id) => {
                        setDocFormVisible(false);
                        if (success && id) history.push(`?id=${id}`);
                    }}
                />
            )}
        </div>
    );
};

export default DocPage;
