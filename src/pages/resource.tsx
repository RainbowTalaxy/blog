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

const BASE_URL = '/resource';

const Page = () => {
    const query = useQuery();
    const user = useUser();

    const path = decodeURIComponent(query.get('dir') ?? '');
    const dir = path.split('/').filter((item) => item !== '');
    const preDir = dir.slice(0, dir.length - 1);

    const [files, setFiles] = useState<FileData[]>();

    useUserEntry();

    useEffect(() => {
        API.statics
            .files(dir.join('/'))
            .then((data) => setFiles(data.files))
            .catch(() => {
                window.location.href = BASE_URL;
            });
    }, [path]);

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
            </div>
        </Layout>
    );
};

export default Page;
