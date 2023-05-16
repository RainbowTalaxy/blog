import { AZALEA_LOCAL_URL } from '../constants/config';

const AzaleaAPI = {
    hello: () =>
        fetch(`${AZALEA_LOCAL_URL}`, {
            mode: 'no-cors',
        }).then((res) => res.text()),
};

export default AzaleaAPI;
