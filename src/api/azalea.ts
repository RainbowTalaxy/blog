import { AZALEA_URL } from '../constants/config';
import { Token } from '../modules/tokenize/types';

export interface SentenceData {
    text: string;
    ents: Array<{ start: string; end: string; label: string }>;
    tokens: Array<Token>;
}

const AzaleaAPI = {
    hello: () =>
        fetch(`${AZALEA_URL}`, {
            mode: 'no-cors',
        }).then((res) => res.text()),
    sentence: (text: string) =>
        fetch(`${AZALEA_URL}/sentence?text=${encodeURIComponent(text)}`).then(
            (res) => res.json(),
        ) as Promise<{ data: SentenceData }>,
};

export default AzaleaAPI;
