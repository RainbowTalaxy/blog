import {
    CycleDetail,
    CycleInfo,
    ProjectInfo,
    Task,
} from '@site/src/api/weaver';
import commonStyles from '../index.module.css';
import styles from './cycle.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import API from '@site/src/api';
import { UserInfo } from '@site/src/constants/user';
import { TaskStatus } from '../types';
import clsx from 'clsx';

interface Props {
    user: UserInfo;
    project: ProjectInfo;
    cycleInfo: CycleInfo;
}

const TASK_STATUSES = [
    TaskStatus.Todo,
    TaskStatus.Doing,
    TaskStatus.Testing,
    TaskStatus.Done,
];

const TASK_STATUS_NAMES = {
    [TaskStatus.Todo]: '待处理',
    [TaskStatus.Doing]: '进行中',
    [TaskStatus.Testing]: '测试中',
    [TaskStatus.Done]: '已完成',
};

const CycleDetailView = ({ user, project, cycleInfo }: Props) => {
    const [detail, setDetail] = useState<CycleDetail>();

    const tasks = useMemo(() => {
        const result: { [key in TaskStatus]: Task[] } = {
            [TaskStatus.Todo]: [],
            [TaskStatus.Doing]: [],
            [TaskStatus.Testing]: [],
            [TaskStatus.Done]: [],
        };
        detail?.tasks.forEach((task) => {
            result[task.status].push(task);
        });
        return result;
    }, [detail]);

    const refetch = useCallback(async () => {
        if (!user.id || !project.id || !cycleInfo.id) return;
        try {
            const data = await API.weaver.cycleDetail(
                user.id,
                project.id,
                cycleInfo.id,
            );
            setDetail(data);
        } catch (error) {
            console.log(error);
        }
    }, [cycleInfo, project, user]);

    useEffect(() => {
        refetch();
    }, [user, project, cycleInfo]);

    return (
        <div className={styles.container}>
            <div className={styles.taskPanel}>
                {TASK_STATUSES.map((status) => (
                    <div key={status} className={styles.categoryColumn}>
                        <div className={styles.categoryName}>
                            {TASK_STATUS_NAMES[status]}
                            <span>{tasks[status].length}</span>
                        </div>
                        {tasks[status].length > 0 && (
                            <div className={styles.taskList}>
                                {tasks[status].map((task) => (
                                    <div
                                        key={task.id}
                                        className={clsx(
                                            styles.taskCard,
                                            commonStyles.card,
                                        )}
                                    >
                                        <div className={styles.taskName}>
                                            {task.name}
                                        </div>
                                        <div className={styles.taskExecutor}>
                                            执行者：{task.executor}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div
                            className={clsx(styles.taskAdd, commonStyles.card)}
                            onClick={async () => {
                                try {
                                    await API.weaver.addTask(
                                        user.id,
                                        project.id,
                                        cycleInfo.id,
                                        {
                                            name: 'New Task',
                                            description: 'Some Description',
                                            status,
                                            executor: user.id,
                                        },
                                    );
                                    refetch();
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        >
                            +
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CycleDetailView;
