import { SERVER_API } from '../constants/config';
import { rocket } from './utils';

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
        rocket.get<{ books: BookInfo[] }>(
            `${SERVER_API}/word-bank/books/${userId}`,
        ),
    book: (userId: string, bookId: string) =>
        rocket.get<{ book: Book }>(
            `${SERVER_API}/word-bank/books/${userId}/${bookId}`,
        ),
    literary: (bookName: string) =>
        rocket.get<ResourceBookMeta>(`${SERVER_API}/word-bank/literary`, {
            bookName,
        }),
};

export default WordBankAPI;
