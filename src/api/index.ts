import AzaleaAPI from './azalea';
import DictionaryAPI from './dictionary';
import StaticsAPI from './statics';
import WordBankAPI from './word-bank';

const API = {
    wordBank: WordBankAPI,
    dictionary: DictionaryAPI,
    statics: StaticsAPI,
    azalea: AzaleaAPI,
};

export default API;
