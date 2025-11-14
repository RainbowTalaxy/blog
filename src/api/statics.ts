import { SERVER_API } from '../constants/config';
import { rocketV2 } from './utils';
import { ResponseError } from '../utils/fetch';

export interface FileData {
    name: string;
    isDir: boolean;
}

export interface UploadFileResponse {
    message: string;
    file: {
        filename: string;
        originalname: string;
        mimetype: string;
        size: number;
        path: string;
        url: string;
    };
}

export interface CreateFolderResponse {
    message: string;
    path: string;
}

/**
 * 文件上传专用 fetch（不使用 JSON）
 */
async function uploadFetch<Data>(url: string, method: string, body: FormData) {
    const res = await fetch(url, {
        method,
        credentials: 'same-origin',
        body,
    });
    const result: Data = await res.json();
    if (!res.ok)
        throw new Error((result as ResponseError).message || '上传失败');
    return result;
}

const StaticsAPI = {
    /**
     * 获取指定路径下的文件列表
     */
    files: (path = '') =>
        rocketV2.get<{
            files: FileData[];
        }>(`${SERVER_API}/statics/${decodeURIComponent(path)}`),

    /**
     * 创建文件夹
     */
    createFolder: (path: string) =>
        rocketV2.post<CreateFolderResponse>(`${SERVER_API}/statics/folder`, {
            path,
        }),

    /**
     * 上传文件到指定路径
     * @param file 要上传的文件
     * @param path 目标路径（可选，默认为根目录）
     */
    uploadFile: async (file: File, path = ''): Promise<UploadFileResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);

        const res = await uploadFetch<UploadFileResponse>(
            `${SERVER_API}/statics/upload`,
            'POST',
            formData,
        );

        return res;
    },
};

export default StaticsAPI;
