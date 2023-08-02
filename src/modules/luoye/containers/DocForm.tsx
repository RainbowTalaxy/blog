import API from '@site/src/api';
import { Doc, Scope, WorkspaceItem } from '@site/src/api/luoye';
import { Button, Input, Select } from '@site/src/components/Form';
import Toggle from '@site/src/components/Form/Toggle';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/form.module.css';

interface Props {
    workspaceItems?: WorkspaceItem[];
    doc?: Doc;
    onClose: (success?: boolean, id?: string) => Promise<void>;
}

const DocForm = ({ workspaceItems, doc, onClose }: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const workspaceRef = useRef<HTMLSelectElement>(null);
    const scopeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (doc) {
            nameRef.current!.value = doc.name;
            scopeRef.current!.checked = doc.scope === Scope.Public;
        }
    }, [doc]);

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{doc ? '文档属性' : '新建文档'}</h2>
                {!doc && (
                    <div className={styles.formItem}>
                        <label>
                            <span>*</span>工作区：
                        </label>
                        <Select
                            raf={workspaceRef}
                            options={workspaceItems.map((w) => ({ label: w.name, value: w.id }))}
                        />
                    </div>
                )}
                <div className={styles.formItem}>
                    <label>标题：</label>
                    <Input raf={nameRef} />
                </div>
                <div className={styles.formItem}>
                    <label>公开：</label>
                    <Toggle raf={scopeRef} />
                </div>
                <div className={styles.formItem}>
                    <label></label>
                    <div className={styles.options}>
                        <Button
                            type="primary"
                            onClick={async () => {
                                const props = {
                                    name: nameRef.current!.value,
                                    scope: scopeRef.current!.checked ? Scope.Public : Scope.Private,
                                };
                                try {
                                    let newDoc: Doc;
                                    if (doc) {
                                        await API.luoye.updateDoc(doc.id, props);
                                    } else {
                                        const workspaceId = workspaceRef.current.value;
                                        if (!workspaceId) return alert('请选择工作区');
                                        newDoc = await API.luoye.createDoc(workspaceId, props);
                                    }
                                    await onClose(true, doc ? doc.id : newDoc.id);
                                } catch (error) {
                                    alert(`提交失败：${error.message}`);
                                }
                            }}
                        >
                            {doc ? '保存' : '创建'}
                        </Button>
                        <Button onClick={() => onClose()}>取消</Button>
                    </div>
                </div>
            </div>
            <div className={styles.mask} onClick={() => onClose()} />
        </div>,
        document.body,
    );
};

export default DocForm;
