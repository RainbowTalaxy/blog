import clsx from 'clsx';
import styles from './index.module.css';
import bookStyles from './book.module.css';
import { useHistory } from '@docusaurus/router';
import { useCallback, useEffect, useState } from 'react';
import { ResourceBookMeta } from './type';
import useQuery from '@site/src/hooks/useQuery';
import { useLocalStorage } from 'usehooks-ts';
import { DEFAULT_USER_INFO } from '@site/src/constants/user';
import QueryableParagraph from './components/QueryableParagraph';

const Book = () => {
    const [user] = useLocalStorage('user', { ...DEFAULT_USER_INFO });
    const query = useQuery();
    const history = useHistory();

    const [bookMeta, setBookMeta] = useState<ResourceBookMeta>();
    const [rawText, setRawText] = useState<string[]>([]);

    const bookName = decodeURIComponent(
        query.get('book') ?? 'Harry Potter and the Half-Blood Prince',
    );
    const targetChapter = decodeURIComponent(query.get('chapter') ?? '');

    const fetchResource = useCallback(async () => {
        const chapterInfo = bookMeta?.chapters.find(
            (chapter) => chapter.title === targetChapter,
        );
        if (!chapterInfo) return;
        try {
            // 根据 chapterInfo.resource 获取资源，资源是一个 txt 文件
            const response = await fetch(chapterInfo.resource);
            const data = await response.text();
            setRawText(data.split('\n'));
        } catch {}
    }, [targetChapter, bookMeta]);

    const refetchMeta = useCallback(async () => {
        try {
            const response = await fetch(
                `https://blog.talaxy.cn/public-api/word-bank/literary?bookName=${decodeURIComponent(
                    bookName,
                )}`,
            );
            const data = (await response.json()) as ResourceBookMeta;
            setBookMeta(data);
            if (!targetChapter && data.chapters[0]) {
                history.push(
                    `?book=${encodeURI(bookName)}&chapter=${encodeURIComponent(
                        data.chapters[0].title,
                    )}`,
                );
            }
        } catch {}
    }, [bookName, targetChapter]);

    useEffect(() => {
        refetchMeta();
    }, [refetchMeta]);

    useEffect(() => {
        fetchResource();
    }, [fetchResource]);

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
                                    `?book=${encodeURI(
                                        bookName,
                                    )}&chapter=${encodeURI(chapter.title)}`,
                                );
                            }}
                        >
                            <div className={styles.bookTitle}>
                                {chapter.title}
                            </div>
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
                            onClick={() => {
                                history.push(
                                    `?book=${encodeURIComponent(
                                        bookName,
                                    )}&chapter=${encodeURIComponent(
                                        chapter.title,
                                    )}`,
                                );
                            }}
                        >
                            <div className={styles.bookTitle}>
                                {chapter.title}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={bookStyles.chapterContent}>
                    <h2>{targetChapter}</h2>
                    {rawText.map((paragraph, index) => (
                        <QueryableParagraph key={index} paragraph={paragraph} />
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
