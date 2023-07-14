import _ from 'lodash';
import { SERVER_API } from '../constants/config';
import { APIKey, rocket, rocketV2 } from './utils';

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
    bookList: (userId?: string) =>
        rocketV2.get<{ books: BookInfo[] }>(`${SERVER_API}/word-bank/books`, {
            userId,
        }),
    book: (bookId: string, userId?: string) =>
        rocketV2.get<{ book: Book }>(
            `${SERVER_API}/word-bank/books/${bookId}`,
            {
                userId,
            },
        ),
    literary: (bookName: string) =>
        rocket.get<ResourceBookMeta>(`${SERVER_API}/word-bank/literary`, {
            bookName,
        }),
    uploadBook: async (book: Book) => {
        // 去除 book.words 中 name 为空的单词
        book.words = book.words.filter((word) => word.name);
        await rocketV2.put(`${SERVER_API}/word-bank/books`, book);
    },
    removeBook: async (bookId: string) => {
        await rocketV2.delete(`${SERVER_API}/word-bank/books/${bookId}`);
    },
};

export default WordBankAPI;
