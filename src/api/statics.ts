import { SERVER_API } from '../constants/config';
import { rocket } from './utils';

export interface FileData {
    name: string;
    isDir: boolean;
}

const StaticsAPI = {
    files: (path = '') =>
        rocket.get<{
            files: FileData[];
        }>(`${SERVER_API}/statics/${decodeURIComponent(path)}`),
};

export default StaticsAPI;
