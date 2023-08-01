import API from '@site/src/api';
import { WorkspaceItem } from '@site/src/api/luoye';
import { Button, Input } from '@site/src/components/Form';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/form.module.css';

interface Props {
    workspace?: WorkspaceItem;
    onClose: (success?: boolean) => Promise<void>;
}

const WorkspaceForm = ({ workspace, onClose }: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (workspace) {
            nameRef.current!.value = workspace.name;
            descriptionRef.current!.value = workspace.description;
        }
    }, [workspace]);

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{workspace ? '工作区属性' : '新建工作区'}</h2>
                <div className={styles.formItem}>
                    <label>
                        <span>*</span>标题：
                    </label>
                    <Input raf={nameRef} />
                </div>
                <div className={styles.formItem}>
                    <label>描述：</label>
                    <Input raf={descriptionRef} />
                </div>
                <div className={styles.formItem}>
                    <label></label>
                    <div className={styles.options}>
                        <Button
                            type="primary"
                            onClick={async () => {
                                if (!nameRef.current!.value) return alert('请输入标题');
                                const props = {
                                    name: nameRef.current!.value,
                                    description: descriptionRef.current!.value,
                                };
                                try {
                                    if (workspace) {
                                        await API.luoye.updateWorkspace(workspace.id, props);
                                    } else {
                                        await API.luoye.createWorkspace(props);
                                    }
                                    await onClose(true);
                                } catch (error) {
                                    alert(`提交失败：${error.message}`);
                                }
                            }}
                        >
                            创建
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

export default WorkspaceForm;
