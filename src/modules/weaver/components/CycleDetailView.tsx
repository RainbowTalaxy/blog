import { CycleDetail, CycleInfo, ProjectInfo, Task, TaskProps } from '@site/src/api/weaver';
import commonStyles from '../index.module.css';
import styles from './cycle.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import API from '@site/src/api';
import { TaskStatus } from '../types';
import clsx from 'clsx';
import TaskForm from './TaskForm';
import { TASK_POOL_NAME, TASK_PRIORITY_COLORS, TASK_STATUSES, TASK_STATUS_NAMES } from '../constants';
import { useHistory } from '@docusaurus/router';
import dayjs from 'dayjs';

interface Props {
    project: ProjectInfo;
    cycleInfo: CycleInfo;
    cycles: CycleInfo[];
    addCycle: () => void;
}

const CycleDetailView = ({ project, cycleInfo, cycles, addCycle }: Props) => {
    const history = useHistory();
    const [detail, setDetail] = useState<CycleDetail>();
    const [isFormVisible, setFormVisible] = useState(false);
    const targetTask = useRef<Task>();
    const context = useRef<{
        project: ProjectInfo;
        cycleInfo: CycleInfo;
    }>();

    const projectId = project.id;
    const cycleId = cycleInfo.id;

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
        [TaskStatus.Todo, TaskStatus.Doing, TaskStatus.Testing, TaskStatus.Done].forEach((status) => {
            result[status].sort((a, b) => a.priority - b.priority);
        });
        return result;
    }, [detail]);

    const refetch = useCallback(async () => {
        if (!projectId || !cycleId) return;
        try {
            const data = await API.weaver.cycleDetail(projectId, cycleId);
            setDetail(data);
        } catch (error) {
            console.log(error);
        }
    }, [cycleId, projectId]);

    const handleUpdateTask = useCallback(
        async (taskProps: TaskProps) => {
            try {
                if (targetTask.current) {
                    await API.weaver.updateTask(projectId, cycleId, targetTask.current.id, taskProps);
                    return true;
                } else {
                    if (!taskProps.name) return false;
                    await API.weaver.addTask(projectId, cycleId, {
                        ...taskProps,
                        name: taskProps.name,
                        status: TaskStatus.Todo,
                    });
                    return true;
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        [cycleId, projectId],
    );

    const handleMoveTaskCycle = useCallback(
        async (newCycleId: string) => {
            if (!targetTask.current) return false;
            try {
                await API.weaver.changeTaskCycle(projectId, cycleId, targetTask.current.id, newCycleId);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        [projectId, cycleId],
    );

    const handleDeleteTask = useCallback(async () => {
        if (!targetTask.current) return false;
        try {
            await API.weaver.deleteTask(projectId, cycleId, targetTask.current.id);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }, [projectId, cycleId]);

    useEffect(() => {
        refetch();
        context.current = {
            project,
            cycleInfo,
        };
    }, [project, cycleInfo]);

    return (
        <div className={styles.container}>
            <div className={styles.cycleBar}>
                <div className={clsx(styles.cycleButton, styles.cycleAdd)} onClick={addCycle}>
                    +
                </div>
                <div
                    className={clsx(styles.cycleButton, cycleInfo.id === TASK_POOL_NAME && styles.active)}
                    onClick={() => {
                        if (project.id) history.replace(`?project=${project.id}&cycle=${TASK_POOL_NAME}`);
                    }}
                >
                    任务池
                </div>
                {cycles.map((cycle) => (
                    <div
                        key={cycle.id}
                        className={clsx(styles.cycleButton, cycleInfo.id === cycle.id && styles.active)}
                        onClick={() => {
                            if (project.id) history.replace(`?project=${project.id}&cycle=${cycle.id}`);
                        }}
                    >
                        {`第 ${cycle.idx + 1} 周` || '无标题'}
                    </div>
                ))}
            </div>
            <div className={styles.taskPanel}>
                {TASK_STATUSES.map((status) => (
                    <div
                        key={status}
                        className={styles.categoryColumn}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={async (e) => {
                            e.preventDefault();
                            const taskId = e.dataTransfer.getData('text/plain');
                            if (tasks[status].find((task) => task.id === taskId)) return;
                            try {
                                await API.weaver.updateTask(projectId, cycleId, taskId, {
                                    status,
                                });
                                refetch();
                            } catch (error) {
                                console.log(error);
                                window.alert('移动失败');
                            }
                        }}
                    >
                        <div className={styles.categoryContent}>
                            <div className={styles.categoryName}>
                                {TASK_STATUS_NAMES[status]}
                                <span>{tasks[status].length}</span>
                            </div>
                            {tasks[status].length > 0 && (
                                <div className={styles.taskList}>
                                    {tasks[status].map((task) => (
                                        <div
                                            key={task.id}
                                            className={clsx(styles.taskCard, commonStyles.card)}
                                            onClick={() => {
                                                targetTask.current = task;
                                                setFormVisible(true);
                                            }}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('text/plain', task.id);
                                                e.dataTransfer.effectAllowed = 'move';
                                            }}
                                            style={{
                                                opacity: task.status === TaskStatus.Done ? 0.5 : 1,
                                            }}
                                        >
                                            <div
                                                className={styles.taskCardIndicator}
                                                style={{
                                                    background: `var(--theme-color-${
                                                        TASK_PRIORITY_COLORS[task.priority]
                                                    })`,
                                                }}
                                            />
                                            <div className={styles.taskName}>{task.name}</div>
                                            <div className={styles.taskExecutor}>执行者：{task.executor}</div>
                                            {status === TaskStatus.Doing && (
                                                <div
                                                    className={styles.taskProgress}
                                                    style={{
                                                        background: `linear-gradient(90deg, #c3dda7 ${
                                                            task.progress ?? 0
                                                        }%, rgba(0, 0, 0, 0.04) ${task.progress ?? 0}%)`,
                                                    }}
                                                />
                                            )}
                                            {status === TaskStatus.Done && task.finishedAt && (
                                                <div className={styles.taskFinished}>
                                                    完成时间：{dayjs(task.finishedAt).format('YYYY年M月D日')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {status === TaskStatus.Todo && (
                                <div
                                    className={clsx(styles.taskAdd, commonStyles.card)}
                                    onClick={async () => {
                                        targetTask.current = undefined;
                                        setFormVisible(true);
                                    }}
                                >
                                    +
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {isFormVisible && (
                <TaskForm
                    task={targetTask.current}
                    context={context.current}
                    cycles={cycles}
                    update={handleUpdateTask}
                    moveCycle={handleMoveTaskCycle}
                    remove={handleDeleteTask}
                    onClose={async (success) => {
                        if (success) await refetch();
                        setFormVisible(false);
                    }}
                />
            )}
        </div>
    );
};

export default CycleDetailView;
