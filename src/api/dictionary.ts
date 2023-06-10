import { SERVER_API } from '../constants/config';
import { rocket } from './utils';

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
        rocket.get<YouDaoResponse>(
            `${SERVER_API}/dictionary?word=${encodeURIComponent(text)}`,
        ),
};

export default DictionaryAPI;
