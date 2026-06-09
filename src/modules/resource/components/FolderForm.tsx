import { createPortal } from 'react-dom';
import { useRef } from 'react';
import { Button, Input } from '@site/src/components/Form';
import styles from './FolderForm.module.css';

interface Props {
    currentPath: string;
    onSubmit: (folderName: string) => Promise<void>;
    onClose: () => void;
}

const FolderForm = ({ currentPath, onSubmit, onClose }: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        const folderName = nameRef.current?.value.trim();
        if (!folderName) {
            alert('请输入文件夹名称');
            return;
        }
        try {
            await onSubmit(folderName);
            onClose();
        } catch (error) {
            alert(`创建失败：${(error as Error).message}`);
        }
    };

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>创建文件夹</h2>
                <div className={styles.formItem}>
                    <label>当前路径：</label>
                    <span className={styles.path}>{currentPath || '/'}</span>
                </div>
                <div className={styles.formItem}>
                    <label>
                        <span>*</span>文件夹名称：
                    </label>
                    <Input raf={nameRef} placeholder="请输入文件夹名称" />
                </div>
                <div className={styles.formItem}>
                    <label></label>
                    <div className={styles.options}>
                        <Button type="primary" onClick={handleSubmit}>
                            创建
                        </Button>
                        <Button onClick={onClose}>取消</Button>
                    </div>
                </div>
            </div>
            <div className={styles.mask} onClick={onClose} />
        </div>,
        document.body,
    );
};

export default FolderForm;
