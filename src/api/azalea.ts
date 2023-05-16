import { AZALEA_LOCAL_URL } from '../constants/config';

const AzaleaAPI = {
    hello: () =>
        fetch(`${AZALEA_LOCAL_URL}`, {
            mode: 'no-cors',
        }).then((res) => res.text()),
    sentence: (text: string) =>
        fetch(`${AZALEA_LOCAL_URL}/sentence?text=${encodeURIComponent(text)}`, {
            mode: 'no-cors',
        }).then((res) => res.json()),
};

export default AzaleaAPI;
