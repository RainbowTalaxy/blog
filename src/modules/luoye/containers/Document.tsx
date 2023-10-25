import styles from '../styles/document.module.css';
import API from '@site/src/api';
import { Doc, DocType, Workspace } from '@site/src/api/luoye';
import { Button } from '@site/src/components/Form';
import Markdown from '@site/src/components/Markdown';
import dayjs from 'dayjs';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import DocForm from './DocForm';
import Editor, { EditorRef } from '../components/Editor/Editor';
import { useHistory } from '@docusaurus/router';
import { LEAVE_EDITING_TEXT, checkAuth } from '../constants';
import ProjectTitle from './ProjectTitle';
import Toast from '../components/Notification/Toast';
import clsx from 'clsx';
import MarkdownEditor from '../components/Editor/MarkdownEditor';
import EditingModeGlobalStyle from '../styles/EditingModeGlobalStyle';
import Placeholder from '../components/PlaceHolder';

interface Props {
    doc: Doc | null;
    workspace?: Workspace | null;
    onSave: () => Promise<void>;
}

export interface DocRefProps {
    isEditing: boolean;
}

const Document = forwardRef(({ doc, workspace, onSave }: Props, ref: ForwardedRef<DocRefProps>) => {
    const history = useHistory();
    const [isEditing, setIsEditing] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);
    const textRef = useRef<EditorRef>(null);
    const prevDoc = useRef<Doc | null>(null);

    const auth = checkAuth(doc);
    const isDeleted = Boolean(doc?.deletedAt);
    const isSidebarVisible = Boolean(workspace) && !isDeleted;

    const saveCheck = () => {
        if (!isEditing) return true;
        return confirm(LEAVE_EDITING_TEXT);
    };

    useImperativeHandle(ref, () => {
        return {
            isEditing,
        };
    });

    useEffect(() => {
        if (!doc) return;
        if (prevDoc.current?.id !== doc.id) {
            setIsEditing(false);
            prevDoc.current = doc;
        }
        if (doc.content === '' && !isDeleted) {
            textRef.current?.setText(doc.content);
            setIsEditing(true);
        }
    }, [doc]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [isEditing]);

    const onSaveContent = async () => {
        if (!doc) return;
        const text = textRef.current?.getText();
        try {
            await API.luoye.updateDoc(doc.id, {
                content: text,
            });
            Toast.cover('保存成功');
            await onSave();
        } catch {
            Toast.cover('保存失败');
        }
    };

    if (!doc)
        return (
            <div className={styles.docView}>
                <header className={styles.docNavBar}>
                    <ProjectTitle className={styles.docIcon} fold={isSidebarVisible} showInfo={false} />
                    {`>_<`}
                </header>
                <main className={styles.document}>
                    <p>抱歉，文档不存在。</p>
                </main>
            </div>
        );

    return (
        <div className={styles.docView}>
            {isEditing && <EditingModeGlobalStyle />}
            <header className={styles.docNavBar}>
                {isSidebarVisible ? (
                    <>
                        <div className={styles.docNavTitle}>{doc.name || <Placeholder>未命名文档</Placeholder>}</div>
                        <ProjectTitle
                            className={styles.docIcon}
                            fold={isSidebarVisible}
                            showInfo={false}
                            navigatePreCheck={saveCheck}
                        />
                    </>
                ) : (
                    <ProjectTitle fold={isSidebarVisible} showInfo={false} navigatePreCheck={saveCheck} />
                )}
                {!isDeleted &&
                    (auth.editable ? (
                        <>
                            {!isEditing && <Button onClick={() => setDocFormVisible(true)}>设 置</Button>}
                            <Button
                                type="primary"
                                onClick={async () => {
                                    if (isEditing) {
                                        const text = textRef.current?.getText();
                                        if (doc.content === '' && text === '') return setIsEditing(false);
                                        try {
                                            await API.luoye.updateDoc(doc.id, {
                                                content: text,
                                            });
                                            await onSave();
                                            setIsEditing(false);
                                        } catch (error: any) {
                                            return Toast.notify(error.message);
                                        }
                                    } else {
                                        textRef.current?.setText(doc.content);
                                        setIsEditing(true);
                                    }
                                }}
                            >
                                {isEditing ? '保 存' : '编 辑'}
                            </Button>
                            {isEditing && <Button onClick={() => setIsEditing(false)}>取 消</Button>}
                        </>
                    ) : (
                        doc.creator.toUpperCase()
                    ))}
                {isDeleted && (
                    <Button
                        type="primary"
                        onClick={async () => {
                            try {
                                if (!confirm('确定要恢复该文档吗？')) return;
                                await API.luoye.restoreDoc(doc.id);
                                await onSave();
                                Toast.notify('恢复成功');
                            } catch (error: any) {
                                Toast.notify(error.message);
                            }
                        }}
                    >
                        恢 复
                    </Button>
                )}
            </header>
            <main
                className={clsx(
                    styles.document,
                    !isSidebarVisible && styles.centeredDoc,
                    !isEditing && styles.hiddenEditor,
                )}
            >
                {!isEditing && (
                    <>
                        <h1>{doc.name || <Placeholder>无标题</Placeholder>}</h1>
                        {doc.docType === DocType.Text &&
                            doc.content.split('\n').map((item, index) => <p key={index}>{item}</p>)}
                        {doc.docType === DocType.Markdown && (
                            <Markdown
                                toc={(slugs) => (
                                    <div className={styles.toc}>
                                        <div>
                                            <strong>{doc.name || <Placeholder>无标题</Placeholder>}</strong>
                                        </div>
                                        {slugs.map((item) => (
                                            <div key={item.slug} className={styles.tocItem}>
                                                <a href={`#${item.slug}`}>{item.title}</a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            >
                                {doc.content}
                            </Markdown>
                        )}
                        <p className={styles.docInfo}>
                            <span>{doc.creator.toUpperCase()}</span>
                            {auth.editable ? (
                                <> 于 {dayjs(doc.updatedAt).format('YYYY年M月D日 H:m')} 更新</>
                            ) : (
                                <> 落于 {dayjs(doc.date).format('YYYY年M月D日')} </>
                            )}
                            。
                        </p>
                    </>
                )}
                {doc.docType === DocType.Text && (
                    <Editor ref={textRef} visible={isEditing} keyId={doc.id} onSave={onSaveContent} />
                )}
                {doc.docType === DocType.Markdown && (
                    <MarkdownEditor ref={textRef} visible={isEditing} keyId={doc.id} onSave={onSaveContent} />
                )}
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
});

export default Document;
