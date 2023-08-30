import styles from './index.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppleDate, convertToAppleDate, uuid } from '@site/src/utils';
import clsx from 'clsx';
import useQuery from '@site/src/hooks/useQuery';
import { useHistory } from '@docusaurus/router';
import API from '@site/src/api';
import { Book, BookInfo } from '@site/src/api/word-bank';
import WordLine, { EditableSpan } from './components/WordLine';
import useEditData from './hooks/useEditData';
import useUserEntry from '@site/src/hooks/useUserEntry';
import ActionItem from './components/ActionItem';
import useUser from '@site/src/hooks/useUser';
import Path from '@site/src/utils/Path';
import { LEAVE_EDITING_TEXT } from '../luoye/constants';

const WordBank = () => {
    const titleRef = useRef<HTMLSpanElement>(null);
    const descRef = useRef<HTMLSpanElement>(null);
    const [list, setList] = useState<BookInfo[]>([]);
    const [book, setBook] = useState<Book>();
    const { editData, addEmptyWord, reset } = useEditData(book);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const user = useUser();
    // 帮我监听 query 参数，参数名为 id
    const query = useQuery();
    const history = useHistory();

    const refetchBook = useCallback(
        async (bookInfo: BookInfo) => {
            if (!user?.id) return;
            try {
                const data = await API.wordBank.book(bookInfo.id, user.id);
                setBook(data.book);
                setIsEditing(false);
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

    const handleSwitchBook = (bookId: string) => {
        if (isEditing) {
            const granted = confirm(LEAVE_EDITING_TEXT);
            if (!granted) return;
        }
        history.replace('?id=' + bookId);
    };

    useEffect(() => {
        if (!list) return;
        const id = query.get('id');
        if (id) {
            const bookInfo = list.find((bookInfo) => bookInfo.id.startsWith(id));
            if (bookInfo) refetchBook(bookInfo);
        } else {
            refetchBook(list[0]);
        }
    }, [list, query.get('id')]);

    useEffect(() => {
        refetch();
    }, [refetch]);

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
                                        await API.wordBank.uploadBook({
                                            id: uuid(),
                                            title: '新单词书',
                                            date: AppleDate(),
                                            words: [],
                                            description: '',
                                        });
                                        refetch();
                                        history.replace('?');
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
                            className={clsx(styles.book, book?.id === bookInfo.id && styles.active)}
                            key={bookInfo.id}
                            onClick={() => handleSwitchBook(bookInfo.id)}
                        >
                            <div className={styles.bookTitle}>{bookInfo.title || '无标题'}</div>
                            <div className={styles.spacer} />
                            {bookInfo.date && (
                                <div className={styles.bookDate}>
                                    {convertToAppleDate(bookInfo.date).format('YYYY/M/D')}
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
                            className={clsx(styles.book, book?.id === bookInfo.id && styles.active)}
                            key={bookInfo.id}
                            onClick={() => handleSwitchBook(bookInfo.id)}
                        >
                            <div className={styles.bookTitle}>{bookInfo.title || '无标题'}</div>
                        </div>
                    ))}
                </div>
                <article className={styles.pageContent}>
                    {book && editData && (
                        <>
                            <h1>
                                {isEditing ? (
                                    <EditableSpan
                                        tabIndex={2}
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
                                        tabIndex={3}
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
                            {!isEditing && <span className={styles.wordCount}>共 {editData.words.length} 个词条</span>}
                            <div className={styles.wordList}>
                                {editData.words.map((word, idx) => (
                                    <WordLine
                                        key={word.id}
                                        index={idx + 1}
                                        word={word}
                                        isLoading={isLoading}
                                        isEditing={isEditing}
                                        onReturn={() => {
                                            if (idx === editData.words.length - 1) {
                                                document.documentElement.scrollTo({
                                                    top: window.__docusaurus.scrollHeight,
                                                    behavior: 'smooth',
                                                });
                                                addEmptyWord();
                                            }
                                        }}
                                    />
                                ))}
                                {(isEditing || editData.words.length === 0) && (
                                    <ActionItem
                                        onClick={() => {
                                            setIsEditing(true);
                                            addEmptyWord();
                                        }}
                                    >
                                        添加单词
                                    </ActionItem>
                                )}
                            </div>
                            {user?.id && (
                                <>
                                    <div
                                        className={styles.wordList}
                                        style={{
                                            marginBottom: !isEditing ? 72 : undefined,
                                        }}
                                    >
                                        {editData.words.length > 0 && (
                                            <ActionItem
                                                onClick={async () => {
                                                    if (isEditing) {
                                                        await API.wordBank.uploadBook(editData);
                                                        refetch();
                                                    } else {
                                                        setIsEditing(true);
                                                        addEmptyWord();
                                                    }
                                                }}
                                            >
                                                {isEditing ? '保存' : '编辑'}
                                            </ActionItem>
                                        )}
                                        {isEditing ? (
                                            editData.words.length > 0 && (
                                                <ActionItem
                                                    onClick={() => {
                                                        reset();
                                                        setIsEditing(false);
                                                    }}
                                                >
                                                    取消
                                                </ActionItem>
                                            )
                                        ) : (
                                            <ActionItem
                                                className={styles.warning}
                                                onClick={async () => {
                                                    try {
                                                        const result = confirm(`确定删除《${book.title}》？`);
                                                        if (!result) return;
                                                        await API.wordBank.removeBook(book.id);
                                                        refetch();
                                                        history.replace('?');
                                                    } catch (e) {
                                                        console.log(e);
                                                    }
                                                }}
                                            >
                                                删除
                                            </ActionItem>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {!user.id && (
                        <div className={styles.wordList}>
                            <ActionItem onClick={() => Path.toUserConfig()}>设置用户</ActionItem>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
};

export default WordBank;
