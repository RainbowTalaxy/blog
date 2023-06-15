import API from '@site/src/api';
import { ProjectInfo } from '@site/src/api/weaver';
import { DEFAULT_USER_INFO } from '@site/src/constants/user';
import useUserEntry from '@site/src/hooks/useUserEntry';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import styles from './index.module.css';
import useQuery from '@site/src/hooks/useQuery';
import ProjectView from './project';
import { useHistory } from '@docusaurus/router';

const Weaver = () => {
    const [user] = useLocalStorage('user', { ...DEFAULT_USER_INFO });
    const query = useQuery();
    const history = useHistory();
    const [list, setList] = useState<ProjectInfo[]>();

    const projectId = query.get('project');

    const refetch = useCallback(() => {
        if (!user.id) return;
        API.weaver.projects(user.id).then((data) => setList(data));
    }, [user]);

    useUserEntry();

    useEffect(() => refetch(), []);

    const project = list?.find((project) => project.id === projectId);

    if (project && user.id) {
        return <ProjectView project={project} user={user} />;
    }

    return (
        <div className={styles.container}>
            <h1>Weaver</h1>
            <h3>项目列表</h3>
            <div className={styles.grid}>
                {list?.map((project) => (
                    <div
                        key={project.id}
                        className={styles.projectCard}
                        onClick={() => {
                            if (user.id && project.id)
                                history.push(`?project=${project.id}`);
                        }}
                    >
                        <div className={styles.projectName}>{project.name}</div>
                        <div className={styles.projectOwner}>
                            所有者：{project.owner}
                        </div>
                        <div className={styles.projectDate}>
                            创建时间：
                            {dayjs(project.createdAt).format('YYYY年M月D日')}
                        </div>
                    </div>
                ))}
            </div>
            {user.id && (
                <>
                    <h3>新建项目</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const name = (form as any).name.value;
                            if (!name) return alert('项目名称不能为空');
                            API.weaver.createProject(user.id, name).then(() => {
                                form.reset();
                                refetch();
                            });
                        }}
                    >
                        <input
                            className={styles.input}
                            name="name"
                            placeholder="项目名称"
                        />
                        <br />
                        <button className={styles.formButton}>提交</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Weaver;