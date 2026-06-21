import Layout from '@theme/Layout';
import styles from './shortcut.module.css';
import API from '@site/src/api';
import { Shortcut } from '@site/src/api/shortcut';
import useUserEntry from '@site/src/hooks/useUserEntry';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@site/src/components/Form';
import ShortcutForm from '../modules/shortcut/ShortcutForm';
import Path from '@site/src/utils/Path';
import clsx from 'clsx';

const ShortcutPage = () => {
    const [list, setList] = useState<Shortcut[] | null>();
    const [isFormVisible, setFormVisible] = useState(false);
    const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(
        null,
    );
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    const refetch = useCallback(async () => {
        try {
            const data = await API.shortcut.list();
            setList(data);
        } catch (error) {
            console.log(error);
            setList(null);
        }
    }, []);

    useUserEntry();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleEdit = (shortcut: Shortcut) => {
        setEditingShortcut(shortcut);
        setFormVisible(true);
    };

    const handleDelete = async (shortcut: Shortcut) => {
        const result = confirm(
            `确定删除短链 ${shortcut.name || shortcut.id} ？`,
        );
        if (!result) return;

        try {
            await API.shortcut.delete(shortcut.id);
            await refetch();
        } catch {
            alert('删除失败');
        }
    };

    const handleCloseForm = async (success?: boolean) => {
        if (success) await refetch();
        setFormVisible(false);
        setEditingShortcut(null);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                alert('已复制到剪贴板');
            })
            .catch(() => {
                alert('复制失败');
            });
    };

    return (
        <Layout title="短链管理">
            <div className={styles.container}>
                <h1>短链管理</h1>
                {list ? (
                    <>
                        <div className={styles.headerActions}>
                            <Button onClick={() => setFormVisible(true)}>
                                新建短链
                            </Button>
                        </div>
                        {list.length === 0 ? (
                            <div className={styles.empty}>暂无短链</div>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>短链标识</th>
                                        <th>名称</th>
                                        <th>目标链接</th>
                                        <th>访问次数</th>
                                        <th>创建时间</th>
                                        <th>最后访问</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((shortcut) => {
                                        const shortUrl = origin
                                            ? `${origin}/s/${shortcut.id}`
                                            : `/s/${shortcut.id}`;
                                        return (
                                            <tr key={shortcut.id}>
                                                <td>
                                                    <div
                                                        className={
                                                            styles.shortId
                                                        }
                                                    >
                                                        {shortcut.id}
                                                    </div>
                                                </td>
                                                <td>{shortcut.name || '-'}</td>
                                                <td className={styles.urlCell}>
                                                    <a
                                                        href={shortcut.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={
                                                            styles.urlLink
                                                        }
                                                    >
                                                        {shortcut.url}
                                                    </a>
                                                </td>
                                                <td className={styles.center}>
                                                    {shortcut.visits}
                                                </td>
                                                <td>
                                                    {dayjs(
                                                        shortcut.createdAt,
                                                    ).format(
                                                        'YYYY-MM-DD HH:mm',
                                                    )}
                                                </td>
                                                <td>
                                                    {shortcut.lastVisit
                                                        ? dayjs(
                                                              shortcut.lastVisit,
                                                          ).format(
                                                              'YYYY-MM-DD HH:mm',
                                                          )
                                                        : '-'}
                                                </td>
                                                <td className={styles.actions}>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => {
                                                            copyToClipboard(
                                                                shortUrl,
                                                            );
                                                        }}
                                                    >
                                                        复制
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        onClick={() =>
                                                            handleEdit(shortcut)
                                                        }
                                                    >
                                                        编辑
                                                    </Button>
                                                    <Button
                                                        type="danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                shortcut,
                                                            )
                                                        }
                                                    >
                                                        删除
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </>
                ) : (
                    <Button onClick={() => Path.toUserConfig()}>
                        请先登录
                    </Button>
                )}
                {isFormVisible && (
                    <ShortcutForm
                        shortcut={editingShortcut}
                        onClose={handleCloseForm}
                    />
                )}
            </div>
        </Layout>
    );
};

export default ShortcutPage;
