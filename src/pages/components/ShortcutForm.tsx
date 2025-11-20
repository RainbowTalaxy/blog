import styles from './ShortcutForm.module.css';
import { createPortal } from 'react-dom';
import { Shortcut } from '@site/src/api/shortcut';
import { useEffect, useRef } from 'react';
import { Button, Input } from '@site/src/components/Form';
import API from '@site/src/api';

interface Props {
    shortcut?: Shortcut | null;
    onClose: (success?: boolean) => Promise<void>;
}

const ShortcutForm = ({ shortcut, onClose }: Props) => {
    const urlRef = useRef<HTMLInputElement>(null);
    const customIdRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (shortcut) {
            urlRef.current!.value = shortcut.url;
            nameRef.current!.value = shortcut.name || '';
        }
    }, [shortcut]);

    const handleSubmit = async () => {
        const url = urlRef.current?.value.trim();
        if (!url) {
            alert('请输入目标链接');
            return;
        }

        try {
            if (shortcut) {
                // 更新短链
                await API.shortcut.update(shortcut.id, {
                    url,
                    name: nameRef.current?.value.trim() || undefined,
                });
            } else {
                // 创建短链
                await API.shortcut.create({
                    url,
                    customId: customIdRef.current?.value.trim() || undefined,
                    name: nameRef.current?.value.trim() || undefined,
                });
            }
            await onClose(true);
        } catch (error: any) {
            const message = error?.message || '操作失败';
            alert(message);
        }
    };

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{shortcut ? '编辑短链' : '新建短链'}</h2>
                <div className={styles.formItem}>
                    <label>
                        <span>*</span>目标链接：
                    </label>
                    <Input raf={urlRef} placeholder="https://example.com" />
                </div>
                {!shortcut && (
                    <div className={styles.formItem}>
                        <label>短链标识：</label>
                        <Input raf={customIdRef} placeholder="留空则自动生成" />
                    </div>
                )}
                <div className={styles.formItem}>
                    <label>名称：</label>
                    <Input raf={nameRef} placeholder="可选" />
                </div>
                <div className={styles.formItem}>
                    <label></label>
                    <div className={styles.options}>
                        <Button type="primary" onClick={handleSubmit}>
                            {shortcut ? '保存' : '创建'}
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

export default ShortcutForm;
