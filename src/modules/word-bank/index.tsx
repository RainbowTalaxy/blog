import styles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import { AppleDate } from '@site/src/utils';
import clsx from 'clsx';
import QueryableWord from './components/QueryableWord';
import useQuery from '@site/src/hooks/useQuery';
import { useHistory } from '@docusaurus/router';
import { useLocalStorage } from 'usehooks-ts';
import { DEFAULT_USER_INFO } from '@site/src/constants/user';
import API from '@site/src/api';
import { Book, BookInfo, Word } from '@site/src/api/word-bank';

function decoratePardOfSpeech(word: Word) {
    if (!word.part) return;
    if (word.part.endsWith('.')) return word.part;
    return word.part + '.';
}

const WordBank = () => {
    const [list, setList] = useState<BookInfo[]>([]);
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user] = useLocalStorage('user', { ...DEFAULT_USER_INFO });
    // 帮我监听 query 参数，参数名为 id
    const query = useQuery();
    const history = useHistory();

    const refetchBook = useCallback(async (bookInfo: BookInfo) => {
        if (!user?.id) return;
        try {
            const data = await API.wordBank.book(user.id, bookInfo.id);
            setBook(data.book);
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
                                {AppleDate(bookInfo.date).format('YYYY/MM/DD')}
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
                {book && (
                    <div className={styles.wordList}>
                        {book.words?.map((word) => (
                            <div className={styles.word} key={word.id}>
                                <div className={styles.wordName}>
                                    {!isLoading && (
                                        <QueryableWord word={word} />
                                    )}
                                </div>
                                <div className={styles.spacer} />
                                <div className={styles.wordPartOfSpeech}>
                                    {!isLoading && decoratePardOfSpeech(word)}
                                </div>
                                <div className={styles.wordDefinition}>
                                    {!isLoading && word.def}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

export default WordBank;
