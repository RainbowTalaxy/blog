import styles from './index.module.css';
import { useEffect, useState } from 'react';
import API from '@site/src/api';
import { FileData } from '../api/statics';
import Layout from '@theme/Layout';
import useQuery from '../hooks/useQuery';
import { STATICS_URL } from '../constants/config';
import useUserEntry from '../hooks/useUserEntry';
import useUser from '../hooks/useUser';
import { Button } from '../components/Form';
import Path from '../utils/Path';
import FolderForm from '@site/src/modules/resource/components/FolderForm';

const BASE_URL = '/resource';

const Page = () => {
    const query = useQuery();
    const user = useUser();

    const path = decodeURIComponent(query.get('dir') ?? '');
    const dir = path.split('/').filter((item) => item !== '');
    const preDir = dir.slice(0, dir.length - 1);

    const [files, setFiles] = useState<FileData[]>();
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useUserEntry();

    const loadFiles = () => {
        API.statics
            .files(dir.join('/'))
            .then((data) => setFiles(data.files))
            .catch(() => {
                window.location.href = BASE_URL;
            });
    };

    useEffect(() => {
        loadFiles();
    }, [path]);

    const handleCreateFolder = async (folderName: string) => {
        const folderPath = path ? `${path}/${folderName}` : folderName;
        await API.statics.createFolder(folderPath);
        loadFiles();
    };

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await API.statics.uploadFile(file, path);
            loadFiles();
            // 重置 input
            e.target.value = '';
        } catch (error) {
            alert(`上传失败：${(error as Error).message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Layout title="静态资源">
            <div className={styles['custom-page']}>
                {user.id ? (
                    <>
                        <h1>静态资源</h1>
                        <p>当前目录：{path}</p>
                        <ul>
                            <li>
                                <a
                                    href={
                                        preDir.length > 0
                                            ? `?dir=${encodeURIComponent(
                                                  preDir.join('/'),
                                              )}`
                                            : BASE_URL
                                    }
                                >
                                    ..
                                </a>
                            </li>
                            <li style={{ fontStyle: 'italic' }}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowFolderForm(true);
                                    }}
                                >
                                    创建文件夹
                                </a>
                            </li>
                            <li style={{ fontStyle: 'italic' }}>
                                <label style={{ cursor: 'pointer' }}>
                                    <a>
                                        {isUploading ? '上传中...' : '上传文件'}
                                    </a>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleUploadFile}
                                        disabled={isUploading}
                                    />
                                </label>
                            </li>
                            {files?.map((file) => {
                                const targetUrl = path + '/' + file.name;
                                return (
                                    <li key={file.name}>
                                        {file.isDir ? (
                                            <a href={`?dir=${targetUrl}`}>
                                                {file.name}
                                            </a>
                                        ) : (
                                            <a
                                                target="_blank"
                                                href={`${STATICS_URL}${targetUrl}`}
                                            >
                                                {file.name}
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <Button onClick={() => Path.toUserConfig()}>
                        请先登录
                    </Button>
                )}
                {showFolderForm && (
                    <FolderForm
                        currentPath={path}
                        onSubmit={handleCreateFolder}
                        onClose={() => setShowFolderForm(false)}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Page;
