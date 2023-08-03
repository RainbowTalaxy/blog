import API from '@site/src/api';
import { Doc } from '@site/src/api/luoye';
import { Button } from '@site/src/components/Form';
import Markdown from '@site/src/components/Markdown';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/document.module.css';
import DocForm from './DocForm';
import Editor, { EditorRef } from '../components/Editor';

interface Props {
    doc?: Doc;
    onSave: () => Promise<void>;
    mode: 'view' | 'edit';
}

const Document = ({ doc, mode = 'edit', onSave }: Props) => {
    const [isEdit, setEdit] = useState(false);
    const [isDocFormVisible, setDocFormVisible] = useState(false);
    const textRef = useRef<EditorRef>();

    useEffect(() => {
        setEdit(doc.content === '');
    }, [doc]);

    if (!doc) return null;

    return (
        <div className={styles.docView}>
            <div className={styles.docNavBar}>
                <header>{doc.name}</header>
                {mode === 'edit' && (
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
                                    } catch (error) {
                                        return alert(`提交失败：${error.message}`);
                                    }
                                } else {
                                    textRef.current.setText(doc.content);
                                    setEdit(true);
                                }
                            }}
                        >
                            {isEdit ? '保 存' : '编 辑'}
                        </Button>
                        {isEdit && <Button onClick={() => setEdit(false)}>取 消</Button>}
                    </>
                )}
                {mode === 'view' && doc.creator}
            </div>
            <div className={styles.document}>
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
            </div>
            {doc && isDocFormVisible && (
                <DocForm
                    doc={doc}
                    onClose={async (success) => {
                        if (success) await onSave();
                        setDocFormVisible(false);
                    }}
                />
            )}
        </div>
    );
};

export default Document;
