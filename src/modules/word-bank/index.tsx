import styles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import { convertToAppleDate } from '@site/src/utils';
import clsx from 'clsx';
import useQuery from '@site/src/hooks/useQuery';
import { useHistory } from '@docusaurus/router';
import { useLocalStorage } from 'usehooks-ts';
import { DEFAULT_USER_INFO } from '@site/src/constants/user';
import API from '@site/src/api';
import { Book, BookInfo } from '@site/src/api/word-bank';
import WordLine from './components/WordLine';
import useEditData from './hooks/useEditData';
import useUserEntry from '@site/src/hooks/useUserEntry';
import { setUser } from '@site/src/utils/user';

const WordBank = () => {
    const [list, setList] = useState<BookInfo[]>([]);
    const [book, setBook] = useState<Book | null>(null);
    const { editData, addEmptyWord, reset } = useEditData(book);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [user] = useLocalStorage('user', { ...DEFAULT_USER_INFO });
    // 帮我监听 query 参数，参数名为 id
    const query = useQuery();
    const history = useHistory();

    const refetchBook = useCallback(async (bookInfo: BookInfo) => {
        if (!user?.id) return;
        try {
            const data = await API.wordBank.book(user.id, bookInfo.id);
            setBook(data.book);
            setIsEditing(false);
            setIsLoading(false);
        } catch {}
    }, []);

    const refetch = useCallback(async () => {
        if (!user?.id) return;
        try {
            const id = query.get('id');
            if (book?.id.startsWith(id)) return;
            setIsLoading(true);
            const data = await API.wordBank.bookList(user.id);
            data.books.sort((a, b) => b.date - a.date);
            setList(data.books);
            if (id) {
                const bookInfo = data.books.find((bookInfo) =>
                    bookInfo.id.startsWith(id),
                );
                if (bookInfo) refetchBook(bookInfo);
            } else {
                refetchBook(data.books[0]);
            }
        } catch {}
    }, [book, query]);

    useEffect(() => {
        refetch();
    }, [query.get('id')]);

    useUserEntry();

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarInner}>
                    <div className={styles.header}>WordBank</div>
                    {list.map((bookInfo) => (
                        <div
                            className={clsx(
                                styles.book,
                                book?.id === bookInfo.id && styles.active,
                            )}
                            key={bookInfo.id}
                            onClick={() => {
                                // 设置 query 来更新
                                history.push('?id=' + bookInfo.id.slice(0, 5));
                            }}
                        >
                            <div className={styles.bookTitle}>
                                {bookInfo.title}
                            </div>
                            <div className={styles.spacer} />
                            <div className={styles.bookDate}>
                                {convertToAppleDate(bookInfo.date).format(
                                    'YYYY/MM/DD',
                                )}
                            </div>
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
                                history.push('?id=' + bookInfo.id.slice(0, 5))
                            }
                        >
                            <div className={styles.bookTitle}>
                                {bookInfo.title}
                            </div>
                        </div>
                    ))}
                </div>
                {book && editData && (
                    <>
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
                            <div className={styles.wordList}>
                                <div className={styles.word}>
                                    <a
                                        onClick={async () => {
                                            if (isEditing) {
                                                await API.wordBank.uploadBook(
                                                    user.id,
                                                    editData,
                                                );
                                                setBook(editData);
                                                setIsEditing(false);
                                            } else {
                                                setIsEditing(true);
                                            }
                                        }}
                                    >
                                        {isEditing ? '保存' : '编辑'}
                                    </a>
                                </div>
                                {isEditing && (
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
            </div>
        </div>
    );
};

export default WordBank;
