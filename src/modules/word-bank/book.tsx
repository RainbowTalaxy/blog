import clsx from 'clsx';
import styles from './index.module.css';
import { useHistory } from '@docusaurus/router';
import { useCallback, useEffect, useState } from 'react';
import { ResourceBookMeta } from './type';
import useQuery from '@site/src/hooks/useQuery';
import { useLocalStorage } from 'usehooks-ts';
import { DEFAULT_USER_INFO } from '@site/src/constants/user';

const Book = () => {
    const [user] = useLocalStorage('user', { ...DEFAULT_USER_INFO });
    const query = useQuery();
    const history = useHistory();

    const [bookMeta, setBookMeta] = useState<ResourceBookMeta>();

    const bookName = decodeURI(
        query.get('book') ?? 'Harry Potter and The Half-Blood Prince',
    );
    const targetChapter = decodeURI(query.get('chapter') ?? '');

    const refetchMeta = useCallback(async () => {
        try {
            const response = await fetch(
                `https://blog.talaxy.cn/public-api/word-bank/literary?bookName=${decodeURI(
                    bookName,
                )}`,
            );
            const data = (await response.json()) as ResourceBookMeta;
            setBookMeta(data);
        } catch {}
    }, [bookName]);

    useEffect(() => {
        refetchMeta();
    }, [refetchMeta]);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarInner}>
                    <div className={styles.header}>{bookName}</div>
                    {bookMeta?.chapters.map((chapter) => (
                        <div
                            className={clsx(
                                styles.book,
                                targetChapter === chapter.title &&
                                    styles.active,
                            )}
                            key={chapter.title}
                            onClick={() => {
                                // 设置 query 来更新
                                history.push(
                                    `?book=${bookName}&chapter=${chapter}`,
                                );
                            }}
                        >
                            <div className={styles.bookTitle}>{chapter}</div>
                            <div className={styles.spacer} />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.content}>
                {/* 下面的组件是给小屏写的，用来代替上面的sidebar */}
                <div className={styles.sidebarMobile}>
                    {bookMeta?.chapters.map((chapter) => (
                        <div
                            className={clsx(
                                styles.book,
                                targetChapter === chapter.title &&
                                    styles.active,
                            )}
                            key={chapter.title}
                            onClick={() =>
                                history.push(
                                    `?book=${bookName}&chapter=${chapter}`,
                                )
                            }
                        >
                            <div className={styles.bookTitle}>{chapter}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={styles.currentUser}
                onClick={() =>
                    history.push(
                        '/user' +
                            '?nextUrl=' +
                            encodeURIComponent(window.location.href),
                    )
                }
            >
                {user?.id ?? '设置信息'}
            </div>
        </div>
    );
};

export default Book;
