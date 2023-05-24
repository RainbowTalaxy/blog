import { SERVER_API } from '../constants/config';

export interface Word {
    id: string;
    date: number;
    name: string;
    part: string;
    def: string;
}

export interface Book {
    id: string;
    title: string;
    date: number;
    words: Word[];
}

export type BookInfo = Omit<Book, 'words'>;

export interface ResourceBookMeta {
    title: string;
    chapters: Array<{
        title: string;
        resource: string;
    }>;
}

const WordBankAPI = {
    bookList: (userId: string) =>
        fetch(`${SERVER_API}/word-bank/books/${userId}`).then((res) =>
            res.json(),
        ) as Promise<{ books: BookInfo[] }>,
    book: (userId: string, bookId: string) =>
        fetch(`${SERVER_API}/word-bank/books/${userId}/${bookId}`).then((res) =>
            res.json(),
        ) as Promise<{ book: Book }>,
    literary: (bookName) =>
        fetch(
            `${SERVER_API}/word-bank/literary?bookName=${encodeURIComponent(
                bookName,
            )}`,
        ).then((res) => res.json()) as Promise<ResourceBookMeta>,
};

export default WordBankAPI;
