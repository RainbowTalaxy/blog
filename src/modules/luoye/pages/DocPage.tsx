import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/home.module.css';
import ContentWithSideBar, { SideBarList, SideBarListItem } from '../components/SideBar';
import GlobalStyle from '../styles/GlobalStyle';
import { Doc, Workspace } from '@site/src/api/luoye';
import useQuery from '@site/src/hooks/useQuery';
import API from '@site/src/api';
import Document from '../containers/Document';
import { useHistory } from '@docusaurus/router';
import { PROJECT_NAME } from '../constants';
import ProjectTitle from '../containers/ProjectTitle';

const DocPage = () => {
    const history = useHistory();
    const query = useQuery();
    const id = query.get('id');
    const [doc, setDoc] = useState<Doc>();
    const [workspace, setWorkspace] = useState<Workspace>();

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
    }, [doc?.workspaces[0]]);

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
                            <h2>文档列表</h2>
                            <SideBarList>
                                {workspace.docs.map((docDir) => (
                                    <SideBarListItem
                                        active={docDir.docId === id}
                                        key={docDir.docId}
                                        onClick={() => history.replace(`?id=${docDir.docId}`)}
                                    >
                                        {docDir.name || '未命名'}
                                    </SideBarListItem>
                                ))}
                            </SideBarList>
                        </>
                    )
                }
            >
                <Document doc={doc} onSave={refetch} mode={workspace ? 'edit' : 'view'} />
            </ContentWithSideBar>
        </div>
    );
};

export default DocPage;
