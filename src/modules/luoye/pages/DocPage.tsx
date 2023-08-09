import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/home.module.css';
import ContentWithSideBar, { SideBarList, SideBarListItem } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { Doc, Scope, Workspace } from '@site/src/api/luoye';
import useQuery from '@site/src/hooks/useQuery';
import API from '@site/src/api';
import Document from '../containers/Document';
import { useHistory } from '@docusaurus/router';
import { PROJECT_NAME, checkAuth, workSpaceName } from '../constants';
import ProjectTitle from '../containers/ProjectTitle';
import Placeholder from '../components/PlaceHolder';
import SVG from '../components/SVG';
import WorkspaceForm from '../containers/WorkspaceForm';
import DocForm from '../containers/DocForm';
import Head from '@docusaurus/Head';

const DocPage = () => {
    const history = useHistory();
    const query = useQuery();
    const id = query.get('id') ?? '';
    const [doc, setDoc] = useState<Doc | null>();
    const [workspace, setWorkspace] = useState<Workspace | null>();
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

    if (doc === undefined) return null;
    if (doc && workspace === undefined) return null;

    const spaceAuth = checkAuth(workspace);

    return (
        <div className={styles.container}>
            <Head>
                <title>
                    {doc?.name || '文档不存在'} | {PROJECT_NAME}
                </title>
                <meta name="theme-color" content="#ffedcc" />
            </Head>
            <GlobalStyle />
            <ContentWithSideBar
                sidebarVisible={Boolean(workspace)}
                sidebar={
                    workspace && (
                        <>
                            <ProjectTitle marginBottom="1rem" />
                            <h2>{workSpaceName(workspace.name)}</h2>
                            {spaceAuth.configurable && (
                                <>
                                    <SideBarList>
                                        <SideBarListItem onClick={() => setDocFormVisible(true)}>
                                            新建文档
                                        </SideBarListItem>
                                        <SideBarListItem onClick={() => setWorkspaceFormVisible(true)}>
                                            工作区属性
                                        </SideBarListItem>
                                    </SideBarList>
                                    <h2>文档列表</h2>
                                </>
                            )}
                            <SideBarList>
                                {workspace.docs.map((docDir) => (
                                    <SideBarListItem
                                        active={docDir.docId === id}
                                        key={docDir.docId}
                                        onClick={() => history.push(`?id=${docDir.docId}`)}
                                    >
                                        <span>{docDir.name || <Placeholder>未命名</Placeholder>}</span>
                                        {docDir.scope === Scope.Private && <SVG.Lock />}
                                    </SideBarListItem>
                                ))}
                            </SideBarList>
                        </>
                    )
                }
                navbar={<ProjectTitle owner={doc?.creator ?? '404'} />}
            >
                <Document doc={doc} onSave={refetch} />
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
                        if (success) history.push(`?id=${id}`);
                    }}
                />
            )}
        </div>
    );
};

export default DocPage;
