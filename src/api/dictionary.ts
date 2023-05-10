import { SERVER_API } from '../constants/config';

export interface YouDaoResponse {
    query: string;
    isWord: boolean;
    basic?: {
        'us-phonetic': string;
        'uk-phonetic': string;
        explains: string[];
    };
    returnPhrase?: string[];
    translation?: string[];
}

const DictionaryAPI = {
    query: (text: string) =>
        fetch(`${SERVER_API}/dictionary?word=${encodeURIComponent(text)}`).then(
            (res) => res.json(),
        ) as Promise<YouDaoResponse>,
};

export default DictionaryAPI;
