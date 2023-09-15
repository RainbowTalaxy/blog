import API from '@site/src/api';
import { Doc, Scope, WorkspaceItem } from '@site/src/api/luoye';
import { Button, Input, Select } from '@site/src/components/Form';
import Toggle from '@site/src/components/Form/Toggle';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/form.module.css';
import { formDate, time } from '@site/src/utils';
import Toast from '../components/Notification/Toast';

interface Props {
    workspace?: {
        id: string;
        name: string;
        scope: Scope;
    };
    workspaceItems?: WorkspaceItem[];
    doc?: Doc;
    onClose: (success?: boolean, id?: string) => Promise<void>;
    onDelete?: () => void;
}

const DocForm = ({ workspace, workspaceItems, doc, onClose, onDelete }: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const workspaceRef = useRef<HTMLSelectElement>(null);
    const scopeRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (doc) {
            nameRef.current!.value = doc.name;
            scopeRef.current!.checked = doc.scope === Scope.Public;
            dateRef.current!.value = formDate(doc.date);
        } else if (workspace) {
            scopeRef.current!.checked = workspace.scope === Scope.Public;
        }
    }, [doc]);

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{doc ? '文档属性' : '新建文档'}</h2>
                {!doc && workspaceItems && (
                    <div className={styles.formItem}>
                        <label>
                            <span>*</span>工作区：
                        </label>
                        <Select
                            raf={workspaceRef}
                            options={workspaceItems.map((w) => ({ label: w.name, value: w.id }))}
                            defaultValue={workspace?.id ?? workspaceItems[0].id}
                        />
                    </div>
                )}
                <div className={styles.formItem}>
                    <label>标题：</label>
                    <Input raf={nameRef} />
                </div>
                <div className={styles.formItem}>
                    <label>日期：</label>
                    <Input raf={dateRef} type="date" defaultValue={formDate()} />
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
                                    date: time(dateRef.current!.value),
                                };
                                try {
                                    let newDoc: Doc | null = null;
                                    if (doc) {
                                        await API.luoye.updateDoc(doc.id, props);
                                    } else {
                                        const wId = workspaceRef.current?.value ?? workspace?.id;
                                        if (!wId) return Toast.notify('请选择工作区');
                                        newDoc = await API.luoye.createDoc(wId, props);
                                    }
                                    await onClose(true, doc ? doc.id : newDoc?.id);
                                } catch (error: any) {
                                    Toast.notify(error.message);
                                }
                            }}
                        >
                            {doc ? '保存' : '创建'}
                        </Button>
                        <Button onClick={() => onClose()}>取消</Button>
                        {doc && onDelete && (
                            <Button
                                type="danger"
                                onClick={async () => {
                                    if (!confirm('确定要删除吗？')) return;
                                    try {
                                        await API.luoye.deleteDoc(doc.id);
                                        onDelete();
                                    } catch (error: any) {
                                        Toast.notify(error.message);
                                    }
                                }}
                            >
                                删除
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.mask} onClick={() => onClose()} />
        </div>,
        document.body,
    );
};

export default DocForm;
