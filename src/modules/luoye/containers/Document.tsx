import API from '@site/src/api';
import { Doc, Workspace } from '@site/src/api/luoye';
import { Button } from '@site/src/components/Form';
import Markdown from '@site/src/components/Markdown';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/document.module.css';
import DocForm from './DocForm';
import Editor, { EditorRef } from '../components/Editor';
import { useHistory } from '@docusaurus/router';
import { checkAuth } from '../constants';
import ProjectTitle from './ProjectTitle';
import Toast from '../components/Notification/Toast';

interface Props {
    doc: Doc | null;
    workspace?: Workspace | null;
    onSave: () => Promise<void>;
}

const Document = ({ doc, workspace, onSave }: Props) => {
    const history = useHistory();
    const [isEdit, setEdit] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);
    const textRef = useRef<EditorRef>(null);
    const prevDoc = useRef<Doc | null>(null);

    useEffect(() => {
        if (!doc) return;
        if (prevDoc.current?.id !== doc.id) {
            setEdit(false);
            prevDoc.current = doc;
        }
        if (doc.content === '') {
            textRef.current?.setText(doc.content);
            setEdit(true);
        }
    }, [doc]);

    const auth = checkAuth(doc);

    if (!doc)
        return (
            <div className={styles.docView}>
                <header className={styles.docNavBar}>
                    <ProjectTitle className={styles.docIcon} fold={Boolean(workspace)} showInfo={false} />
                    {`>_<`}
                </header>
                <main className={styles.document}>
                    <p>抱歉，文档不存在。</p>
                </main>
            </div>
        );

    return (
        <div className={styles.docView}>
            <header className={styles.docNavBar}>
                {workspace ? (
                    <>
                        <div className={styles.docNavTitle}>{doc.name}</div>
                        <ProjectTitle className={styles.docIcon} fold={Boolean(workspace)} showInfo={false} />
                    </>
                ) : (
                    <ProjectTitle fold={Boolean(workspace)} showInfo={false} />
                )}
                {auth.editable ? (
                    <>
                        {!isEdit && <Button onClick={() => setDocFormVisible(true)}>设 置</Button>}
                        <Button
                            type="primary"
                            onClick={async () => {
                                if (isEdit) {
                                    const text = textRef.current?.getText();
                                    if (doc.content === '' && text === '') return setEdit(false);
                                    try {
                                        await API.luoye.updateDoc(doc.id, {
                                            content: text,
                                        });
                                        await onSave();
                                        setEdit(false);
                                    } catch (error: any) {
                                        return alert(`提交失败：${error.message}`);
                                    }
                                } else {
                                    textRef.current?.setText(doc.content);
                                    setEdit(true);
                                }
                            }}
                        >
                            {isEdit ? '保 存' : '编 辑'}
                        </Button>
                        {isEdit && <Button onClick={() => setEdit(false)}>取 消</Button>}
                    </>
                ) : (
                    doc.creator.toUpperCase()
                )}
            </header>
            <main className={styles.document}>
                {!isEdit && (
                    <>
                        <h1>{doc.name}</h1>
                        <Markdown
                            toc={(slugs) => (
                                <div className={styles.toc}>
                                    <div>
                                        <strong>{doc.name}</strong>
                                    </div>
                                    {slugs.map((slug) => (
                                        <div key={slug.slug} className={styles.tocItem}>
                                            <a href={`#${slug.slug}`}>{slug.title}</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        >
                            {doc.content}
                        </Markdown>
                        <p className={styles.docInfo}>
                            <span>{doc.creator.toUpperCase()}</span> 更新于{' '}
                            {dayjs(doc.updatedAt).format('YYYY年M月D日 HH:mm')}
                        </p>
                    </>
                )}
                <Editor
                    ref={textRef}
                    visible={isEdit}
                    keyId={doc.id}
                    onSave={async () => {
                        const text = textRef.current?.getText();
                        try {
                            await API.luoye.updateDoc(doc.id, {
                                content: text,
                            });
                            Toast.notify('保存成功');
                            onSave();
                        } catch {
                            Toast.notify('保存失败');
                        }
                    }}
                />
            </main>
            {isDocFormVisible && (
                <DocForm
                    doc={doc}
                    onClose={async (success) => {
                        if (success) await onSave();
                        setDocFormVisible(false);
                    }}
                    onDelete={() => {
                        history.replace(`/luoye?workspace=${doc.workspaces[0]}`);
                    }}
                />
            )}
        </div>
    );
};

export default Document;
