import API from '@site/src/api';
import { Doc } from '@site/src/api/luoye';
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

interface Props {
    doc: Doc | null;
    onSave: () => Promise<void>;
}

const Document = ({ doc, onSave }: Props) => {
    const history = useHistory();
    const [isEdit, setEdit] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);
    const textRef = useRef<EditorRef>(null);

    useEffect(() => {
        if (!doc) return;
        setEdit(doc.content === '');
    }, [doc]);

    const auth = checkAuth(doc);

    if (!doc)
        return (
            <div className={styles.docView}>
                <header className={styles.docNavBar}>
                    <div className={styles.docNavTitle}>🍂 落叶</div>
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
                <div className={styles.docNavTitle}>{doc.name}</div>
                <ProjectTitle className={styles.docIcon} fold showInfo={false} />
                {auth.editable ? (
                    <>
                        {!isEdit && <Button onClick={() => setDocFormVisible(true)}>设 置</Button>}
                        <Button
                            type="primary"
                            onClick={async () => {
                                if (isEdit) {
                                    const text = textRef.current?.getText();
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
                        <Markdown>{doc.content}</Markdown>
                        <p className={styles.docInfo}>
                            <span>{doc.creator}</span> 更新于 {dayjs(doc.updatedAt).format('YYYY年MM月DD日 HH:mm')}
                        </p>
                    </>
                )}
                <Editor ref={textRef} visible={isEdit} keyId={doc.id} />
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
