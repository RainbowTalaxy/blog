import styles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import { Book, BookInfo, Word } from './type';
import { AppleDate } from '@site/src/utils';
import clsx from 'clsx';
import QueryableWord from './components/QueryableWord';
import useQuery from '@site/src/hooks/useQuery';
import { useHistory } from '@docusaurus/router';

function decoratePardOfSpeech(word: Word) {
    if (!word.part) return;
    if (word.part.endsWith('.')) return word.part;
    return word.part + '.';
}

const WordBank = () => {
    const [list, setList] = useState<BookInfo[]>([]);
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // 帮我监听 query 参数，参数名为 id
    const query = useQuery();
    const history = useHistory();

    const refetchBook = useCallback(async (bookInfo: BookInfo) => {
        try {
            const response = await fetch(
                `https://blog.talaxy.cn/public-api/word-bank/books/talaxy/${bookInfo.id}`,
            );
            const data = (await response.json()) as { book: Book };
            setBook(data.book);
            setIsLoading(false);
        } catch {}
    }, []);

    const refetch = useCallback(async () => {
        try {
            const id = query.get('id');
            if (book?.id.startsWith(id)) return;
            setIsLoading(true);
            const response = await fetch(
                'https://blog.talaxy.cn/public-api/word-bank/books/talaxy',
            );
            const data = (await response.json()) as { books: BookInfo[] };
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
                            onClick={() => refetchBook(bookInfo)}
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
            <div className={styles.currentUser}>talaxy</div>
        </div>
    );
};

export default WordBank;
