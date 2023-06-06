import styles from './index.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppleDate, convertToAppleDate, uuid } from '@site/src/utils';
import clsx from 'clsx';
import useQuery from '@site/src/hooks/useQuery';
import { useHistory } from '@docusaurus/router';
import { useLocalStorage } from 'usehooks-ts';
import { DEFAULT_USER_INFO } from '@site/src/constants/user';
import API from '@site/src/api';
import { Book, BookInfo } from '@site/src/api/word-bank';
import WordLine, { EditableSpan } from './components/WordLine';
import useEditData from './hooks/useEditData';
import useUserEntry from '@site/src/hooks/useUserEntry';
import { setUser } from '@site/src/utils/user';

const WordBank = () => {
    const titleRef = useRef<HTMLSpanElement>(null);
    const descRef = useRef<HTMLSpanElement>(null);
    const [list, setList] = useState<BookInfo[]>([]);
    const [book, setBook] = useState<Book | null>(null);
    const { editData, addEmptyWord, reset } = useEditData(book);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user] = useLocalStorage('user', { ...DEFAULT_USER_INFO });
    // 帮我监听 query 参数，参数名为 id
    const query = useQuery();
    const history = useHistory();

    const refetchBook = useCallback(
        async (bookInfo: BookInfo) => {
            if (!user?.id) return;
            try {
                const data = await API.wordBank.book(user.id, bookInfo.id);
                setBook(data.book);
                setIsEditing(data.book.words.length === 0);
                setIsLoading(false);
            } catch {}
        },
        [user],
    );

    const refetch = useCallback(async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const data = await API.wordBank.bookList(user.id);
            data.books.sort((a, b) => b.date - a.date);
            setList(data.books);
        } catch {}
    }, [user]);

    useEffect(() => {
        if (!list) return;
        const id = query.get('id');
        if (id) {
            const bookInfo = list.find((bookInfo) =>
                bookInfo.id.startsWith(id),
            );
            if (bookInfo) refetchBook(bookInfo);
        } else {
            refetchBook(list[0]);
        }
    }, [list, query.get('id')]);

    useEffect(() => {
        refetch();
    }, []);

    useUserEntry();

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarInner}>
                    <div className={styles.header}>
                        <span>WordBank</span>
                        <div className={styles.spacer} />
                        {user?.id && (
                            <span
                                className={styles.headerButton}
                                onClick={async () => {
                                    try {
                                        await API.wordBank.uploadBook(user.id, {
                                            id: uuid(),
                                            title: '新单词书',
                                            date: AppleDate(),
                                            words: [],
                                            description: '',
                                        });
                                        setBook(null);
                                        refetch();
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }}
                            >
                                新建
                            </span>
                        )}
                    </div>
                    {list.map((bookInfo) => (
                        <div
                            className={clsx(
                                styles.book,
                                book?.id === bookInfo.id && styles.active,
                            )}
                            key={bookInfo.id}
                            onClick={() => {
                                // 设置 query 来更新
                                history.replace(
                                    '?id=' + bookInfo.id.slice(0, 5),
                                );
                            }}
                        >
                            <div className={styles.bookTitle}>
                                {bookInfo.title || '无标题'}
                            </div>
                            <div className={styles.spacer} />
                            {bookInfo.date && (
                                <div className={styles.bookDate}>
                                    {convertToAppleDate(bookInfo.date).format(
                                        'YYYY/MM/DD',
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.content}>
                {/* 下面的组件是给小屏写的，用来代替上面的sidebar */}
                <div className={styles.sidebarMobile}>
                    {list.map((bookInfo) => (
                        <div
                            className={clsx(
                                styles.book,
                                book?.id === bookInfo.id && styles.active,
                            )}
                            key={bookInfo.id}
                            onClick={() =>
                                history.replace(
                                    '?id=' + bookInfo.id.slice(0, 5),
                                )
                            }
                        >
                            <div className={styles.bookTitle}>
                                {bookInfo.title || '无标题'}
                            </div>
                        </div>
                    ))}
                </div>
                <article className={styles.pageContent}>
                    {book && editData && (
                        <>
                            <h1>
                                {isEditing ? (
                                    <EditableSpan
                                        eleRef={titleRef}
                                        text={editData.title}
                                        placeholder="标题"
                                        onChange={(str) => {
                                            editData.title = str;
                                        }}
                                        onEnter={() => titleRef.current?.blur()}
                                    />
                                ) : (
                                    editData.title || '无标题'
                                )}
                            </h1>
                            {isEditing ? (
                                <p>
                                    <EditableSpan
                                        eleRef={descRef}
                                        text={editData.description ?? ''}
                                        placeholder="描述"
                                        onChange={(str) => {
                                            editData.description = str;
                                        }}
                                        onEnter={() => descRef.current?.blur()}
                                    />
                                </p>
                            ) : (
                                <p>{editData.description}</p>
                            )}
                            <div className={styles.wordList}>
                                {editData.words?.map((word) => (
                                    <WordLine
                                        key={word.id}
                                        word={word}
                                        isLoading={isLoading}
                                        isEditing={isEditing}
                                        onReturn={() => addEmptyWord()}
                                    />
                                ))}
                                {isEditing && (
                                    <div className={styles.word}>
                                        <a onClick={() => addEmptyWord()}>
                                            添加单词
                                        </a>
                                    </div>
                                )}
                            </div>
                            {user?.id && (
                                <div
                                    className={styles.wordList}
                                    style={{ marginBottom: !isEditing && 72 }}
                                >
                                    <div className={styles.word}>
                                        <a
                                            onClick={async () => {
                                                if (isEditing) {
                                                    await API.wordBank.uploadBook(
                                                        user.id,
                                                        editData,
                                                    );
                                                    refetch();
                                                } else {
                                                    setIsEditing(true);
                                                }
                                            }}
                                        >
                                            {isEditing ? '保存' : '编辑'}
                                        </a>
                                    </div>
                                    {isEditing && editData.words.length > 0 && (
                                        <div className={styles.word}>
                                            <a
                                                onClick={() => {
                                                    reset();
                                                    setIsEditing(false);
                                                }}
                                            >
                                                取消
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    {!user.id && (
                        <div className={styles.wordList}>
                            <div className={styles.word}>
                                <a onClick={() => setUser()}>设置用户</a>
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
};

export default WordBank;
