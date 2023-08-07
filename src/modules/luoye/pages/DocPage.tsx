import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/home.module.css';
import ContentWithSideBar, { SideBarList, SideBarListItem } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { Doc, Scope, Workspace } from '@site/src/api/luoye';
import useQuery from '@site/src/hooks/useQuery';
import API from '@site/src/api';
import Document from '../containers/Document';
import { useHistory } from '@docusaurus/router';
import { PROJECT_NAME, workSpaceName } from '../constants';
import ProjectTitle from '../containers/ProjectTitle';
import Placeholder from '../components/PlaceHolder';
import SVG from '../components/SVG';
import WorkspaceForm from '../containers/WorkspaceForm';
import DocForm from '../containers/DocForm';

const DocPage = () => {
    const history = useHistory();
    const query = useQuery();
    const id = query.get('id');
    const [doc, setDoc] = useState<Doc>();
    const [workspace, setWorkspace] = useState<Workspace>();
    const [isWorkspaceFormVisible, setWorkspaceFormVisible] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);

    const refetch = useCallback(async () => {
        try {
            const docData = await API.luoye.doc(id);
            setDoc(docData);
        } catch (error) {
            console.log(error);
            setDoc(null);
        }
    }, [id]);

    useEffect(() => {
        if (!doc) return;
        document.title = `${doc.name} | ${PROJECT_NAME}`;
        (async () => {
            try {
                const workspaceData = await API.luoye.workspace(doc.workspaces[0]);
                setWorkspace(workspaceData);
            } catch (error) {
                console.log(error);
                setWorkspace(null);
            }
        })();
    }, [doc]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (workspace === undefined) return null;

    return (
        <div className={styles.container}>
            <GlobalStyle />
            <ContentWithSideBar
                sidebarVisible={workspace !== null}
                sidebar={
                    workspace && (
                        <>
                            <ProjectTitle />
                            <h2>{workSpaceName(workspace.name)}</h2>
                            <SideBarList>
                                <SideBarListItem onClick={() => setWorkspaceFormVisible(true)}>
                                    工作区属性
                                </SideBarListItem>
                                <SideBarListItem onClick={() => setDocFormVisible(true)}>新建文档</SideBarListItem>
                            </SideBarList>
                            <h2>文档列表</h2>
                            <SideBarList>
                                {workspace.docs.map((docDir) => (
                                    <SideBarListItem
                                        active={docDir.docId === id}
                                        key={docDir.docId}
                                        onClick={() => history.replace(`?id=${docDir.docId}`)}
                                    >
                                        <span>{docDir.name || <Placeholder>未命名</Placeholder>}</span>
                                        {docDir.scope === Scope.Private && <SVG.Lock />}
                                    </SideBarListItem>
                                ))}
                            </SideBarList>
                        </>
                    )
                }
            >
                <Document doc={doc} onSave={refetch} mode={workspace ? 'edit' : 'view'} />
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
            {workspace && isDocFormVisible && (
                <DocForm
                    workspace={workspace}
                    onClose={async (success, id) => {
                        setDocFormVisible(false);
                        if (success) history.push(`?id=${id}`);
                    }}
                />
            )}
        </div>
    );
};

export default DocPage;
