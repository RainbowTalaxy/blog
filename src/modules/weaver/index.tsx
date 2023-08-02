import API from '@site/src/api';
import { ProjectInfo } from '@site/src/api/weaver';
import useUserEntry from '@site/src/hooks/useUserEntry';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import useQuery from '@site/src/hooks/useQuery';
import ProjectView from './project';
import { useHistory } from '@docusaurus/router';
import useUser from '@site/src/hooks/useUser';
import Path from '@site/src/utils/Path';
import clsx from 'clsx';
import { Button, Input } from '@site/src/components/Form';

const today = dayjs().format('YYYY-MM-DD');

const Weaver = () => {
    const user = useUser();
    const query = useQuery();
    const history = useHistory();
    const [list, setList] = useState<ProjectInfo[]>();

    const projectId = query.get('project');

    const refetch = useCallback(() => {
        if (!user.id) return;
        API.weaver.projects().then((data) => setList(data));
    }, [user]);

    useUserEntry();

    useEffect(() => refetch(), [refetch]);

    const project = list?.find((project) => project.id === projectId);

    if (project && user.id) {
        return <ProjectView project={project} />;
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
                                <div
                                    className={styles.projectDelete}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        const result = confirm(`确定删除“${project.name}”？`);
                                        if (result) {
                                            try {
                                                await API.weaver.deleteProject(project.id);
                                                refetch();
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        }
                                    }}
                                >
                                    删除
                                </div>
                            </div>
                        ))}
                    </div>
                    <h3>新建项目</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const projectName = (form as any).projectName.value;
                            const startDate = (form as any).startDate.value;
                            if (!projectName) return alert('项目名称不能为空');
                            if (!startDate) return alert('开始时间不能为空');
                            const firstDate = dayjs(startDate).valueOf();
                            console.log(projectName, firstDate);
                            API.weaver.createProject(projectName, firstDate).then(() => {
                                form.reset();
                                refetch();
                            });
                        }}
                    >
                        <Input className={styles.input} name="projectName" placeholder="项目名称" />
                        <br />
                        <span className={styles.fieldName}>开始时间</span>
                        <Input
                            className={styles.input}
                            name="startDate"
                            type="date"
                            defaultValue={today}
                            placeholder="开始时间"
                        />
                        <br />
                        <Button style={{ margin: '18px 0 0 4px' }} type="primary">
                            提交
                        </Button>
                    </form>
                </>
            ) : (
                <Button onClick={() => Path.toUserConfig()}>请先登录</Button>
            )}
        </div>
    );
};

export default Weaver;
