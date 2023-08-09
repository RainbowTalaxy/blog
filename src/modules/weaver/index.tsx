import API from '@site/src/api';
import { ProjectInfo } from '@site/src/api/weaver';
import useUserEntry from '@site/src/hooks/useUserEntry';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import styles from './styles/index.module.css';
import useQuery from '@site/src/hooks/useQuery';
import ProjectView from './project';
import { useHistory } from '@docusaurus/router';
import useUser from '@site/src/hooks/useUser';
import Path from '@site/src/utils/Path';
import clsx from 'clsx';
import { Button } from '@site/src/components/Form';
import ProjectForm from './components/ProjectForm';

const today = dayjs().format('YYYY-MM-DD');

const Weaver = () => {
    const user = useUser();
    const query = useQuery();
    const history = useHistory();
    const [list, setList] = useState<ProjectInfo[]>();
    const [isFormVisible, setFormVisible] = useState(false);

    const projectId = query.get('project');

    const refetch = useCallback(async () => {
        if (!user.id) return;
        await API.weaver.projects().then((data) => setList(data));
    }, [user]);

    useUserEntry();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const project = list?.find((project) => project.id === projectId);

    if (project && user.id) {
        return <ProjectView project={project} refetch={refetch} />;
    }

    return (
        <div className={styles.container}>
            <h1>Weaver</h1>
            {list ? (
                <>
                    <h3>项目列表</h3>
                    <div className={styles.grid}>
                        {list.map((project) => (
                            <div
                                key={project.id}
                                className={clsx(styles.itemCard, styles.projectCard)}
                                onClick={() => {
                                    if (user.id && project.id) history.push(`?project=${project.id}`);
                                }}
                            >
                                <div className={styles.projectName}>{project.name}</div>
                                <div className={styles.projectOwner}>所有者：{project.owner}</div>
                                <div className={styles.projectDate}>
                                    创建时间：
                                    {dayjs(project.createdAt).format('YYYY年M月D日')}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => setFormVisible(true)}>新建项目</Button>
                </>
            ) : (
                <Button onClick={() => Path.toUserConfig()}>请先登录</Button>
            )}
            {isFormVisible && (
                <ProjectForm
                    onClose={async (success) => {
                        if (success) await refetch();
                        setFormVisible(false);
                    }}
                />
            )}
        </div>
    );
};

export default Weaver;
