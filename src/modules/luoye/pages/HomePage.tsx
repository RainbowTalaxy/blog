import { useCallback, useEffect, useState } from 'react';
import { DocItem, WorkspaceItem } from '@site/src/api/luoye';
import API from '@site/src/api';
import { Button } from '@site/src/components/Form';
import Path from '@site/src/utils/Path';

const HomePage = () => {
    const [data, setData] = useState<{
        workspaces: WorkspaceItem[];
        docs: DocItem[];
    }>();

    const refetch = useCallback(async () => {
        try {
            const [workspaces, docs] = await Promise.all([
                API.luoye.workspaces(),
                API.luoye.docs(),
            ]);
            setData({
                workspaces,
                docs,
            });
        } catch {}
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div>
            <h1>落页</h1>
            {data ? (
                <>
                    <h2>工作区</h2>
                    <ul>
                        {data.workspaces.map((workspace) => {
                            return (
                                <li key={workspace.id}>
                                    {workspace.name === 'default'
                                        ? '个人工作区'
                                        : workspace.name || '未命名'}
                                </li>
                            );
                        })}
                    </ul>
                    <h2>文档</h2>
                    <ul>
                        {data.docs.map((doc) => {
                            return <li key={doc.id}>{doc.name || '未命名'}</li>;
                        })}
                    </ul>
                </>
            ) : (
                <Button onClick={() => Path.toUserConfig()}>请先登录</Button>
            )}
        </div>
    );
};

export default HomePage;
