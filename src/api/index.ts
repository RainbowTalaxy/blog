import AzaleaAPI from './azalea';
import DictionaryAPI from './dictionary';
import StaticsAPI from './statics';
import WordBankAPI from './word-bank';

const API = {
    text: (url: string) => fetch(url).then((res) => res.text()),
    json: (url: string) => fetch(url).then((res) => res.json()),
    wordBank: WordBankAPI,
    dictionary: DictionaryAPI,
    statics: StaticsAPI,
    azalea: AzaleaAPI,
};

export default API;
