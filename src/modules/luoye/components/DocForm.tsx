import API from '@site/src/api';
import { Doc } from '@site/src/api/luoye';
import { Button, Input } from '@site/src/components/Form';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/form.module.css';

interface Props {
    workspaceId?: string;
    doc?: Doc;
    onClose: (success?: boolean) => Promise<void>;
}

const DocForm = ({ workspaceId, doc, onClose }: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (doc) {
            nameRef.current!.value = doc.name;
        }
    }, [doc]);

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{doc ? '文档属性' : '新建文档'}</h2>
                <div className={styles.formItem}>
                    <label>
                        <span>*</span>标题：
                    </label>
                    <Input raf={nameRef} />
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
                                };
                                try {
                                    if (doc) {
                                        await API.luoye.updateDoc(doc.id, props);
                                    } else {
                                        if (!workspaceId) return alert('请选择工作区');
                                        await API.luoye.createDoc(workspaceId, props);
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

export default DocForm;
