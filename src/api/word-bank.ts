import _ from 'lodash';
import { SERVER_API } from '../constants/config';
import { APIKey, rocket } from './utils';

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
    description?: string;
}

export type BookInfo = Omit<Book, 'words' | 'description'>;

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
    uploadBook: async (userId: string, book: Book) => {
        // 去除 book.words 中 name 为空的单词
        book.words = book.words.filter((word) => word.name);
        await rocket.put(
            `${SERVER_API}/word-bank/books/${userId}`,
            book,
            APIKey.file,
        );
    },
    removeBook: async (userId: string, bookId: string) => {
        await rocket.delete(
            `${SERVER_API}/word-bank/books/${userId}/${bookId}`,
            undefined,
            APIKey.file,
        );
    },
};

export default WordBankAPI;
