export interface Book {
    id: string;
    title: string;
    date: number;
    words: Word[];
}

export type BookInfo = Omit<Book, 'words'>;

export interface Word {
    id: string;
    date: number;
    name: string;
    part: string;
    def: string;
}

export interface YouDaoResponse {
    query: string;
    isWord: true;
    basic?: {
        'us-phonetic': string;
        'uk-phonetic': string;
        explains: string[];
    };
}
