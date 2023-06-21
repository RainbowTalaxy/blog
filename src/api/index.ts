import AzaleaAPI from './azalea';
import DictionaryAPI from './dictionary';
import StaticsAPI from './statics';
import UserAPI from './user';
import { rocket } from './utils';
import WeaverAPI from './weaver';
import WordBankAPI from './word-bank';

const API = {
    text: (url: string) => fetch(url).then((res) => res.text()),
    json<Data>(url: string) {
        rocket.get<Data>(url);
    },
    wordBank: WordBankAPI,
    dictionary: DictionaryAPI,
    statics: StaticsAPI,
    azalea: AzaleaAPI,
    weaver: WeaverAPI,
    user: UserAPI,
};

export default API;
