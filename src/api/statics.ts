import { SERVER_API } from '../constants/config';
import { rocketV2 } from './utils';

export interface FileData {
    name: string;
    isDir: boolean;
}

const StaticsAPI = {
    files: (path = '') =>
        rocketV2.get<{
            files: FileData[];
        }>(`${SERVER_API}/statics/${decodeURIComponent(path)}`),
};

export default StaticsAPI;
