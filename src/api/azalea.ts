import { AZALEA_URL } from '../constants/config';
import { Token } from '../modules/tokenize/types';
import { rocket } from './utils';

export interface SentenceData {
    text: string;
    ents: Array<{ start: string; end: string; label: string }>;
    tokens: Array<Token>;
}

const AzaleaAPI = {
    sentence: (text: string) =>
        rocket.get<{ data: SentenceData }>(`${AZALEA_URL}/sentence`, { text }),
};

export default AzaleaAPI;
