import { SERVER_API } from '../constants/config';

export interface FileData {
    name: string;
    isDir: boolean;
}

const StaticsAPI = {
    files: (path = '') =>
        fetch(`${SERVER_API}/statics/${decodeURIComponent(path)}`).then((res) =>
            res.json(),
        ) as Promise<{ files: FileData[] }>,
};

export default StaticsAPI;
