import Layout from '@theme/Layout';
import styles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import { Book, BookInfo, Word } from './type';
import { AppleDate } from '@site/src/utils';
import clsx from 'clsx';
import QueryableWord from './components/QueryableWord';

function decoratePardOfSpeech(word: Word) {
    if (!word.part) return;
    if (word.part.endsWith('.')) return word.part;
    return word.part + '.';
}

const WordBank = () => {
    const [list, setList] = useState<BookInfo[]>([]);
    const [book, setBook] = useState<Book | null>(null);

    const refetchBook = useCallback(async (bookInfo: BookInfo) => {
        try {
            const response = await fetch(
                `https://blog.talaxy.cn/public-api/word-bank/books/talaxy/${bookInfo.id}`,
            );
            const data = (await response.json()) as { book: Book };
            setBook(data.book);
        } catch {}
    }, []);

    const refetch = useCallback(async () => {
        try {
            const response = await fetch(
                'https://blog.talaxy.cn/public-api/word-bank/books/talaxy',
            );
            const data = (await response.json()) as { books: BookInfo[] };
            data.books.sort((a, b) => b.date - a.date);
            setList(data.books);
            if (!book) {
                refetchBook(data.books[0]);
            }
        } catch {}
    }, [book]);

    useEffect(() => {
        refetch();
    }, []);

    return (
        <Layout title="WordBank">
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
                                onClick={() => refetchBook(bookInfo)}
                            >
                                <div className={styles.bookTitle}>
                                    {bookInfo.title}
                                </div>
                                <div className={styles.spacer} />
                                <div className={styles.bookDate}>
                                    {AppleDate(bookInfo.date).format(
                                        'YYYY/MM/DD',
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {book && (
                    <div className={styles.content}>
                        {/* 下面的组件是给小屏写的，用来代替上面的sidebar */}
                        <div className={styles.sidebarMobile}>
                            {list.map((bookInfo) => (
                                <div
                                    className={clsx(
                                        styles.book,
                                        book?.id === bookInfo.id &&
                                            styles.active,
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
                        <div className={styles.wordList}>
                            {book.words?.map((word) => (
                                <div className={styles.word} key={word.id}>
                                    <div className={styles.wordName}>
                                        <QueryableWord word={word} />
                                    </div>
                                    <div className={styles.spacer} />
                                    <div className={styles.wordPartOfSpeech}>
                                        {decoratePardOfSpeech(word)}
                                    </div>
                                    <div className={styles.wordDefinition}>
                                        {word.def}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WordBank;
