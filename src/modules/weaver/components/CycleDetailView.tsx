import {
    CycleDetail,
    CycleInfo,
    ProjectInfo,
    Task,
} from '@site/src/api/weaver';
import commonStyles from '../index.module.css';
import styles from './cycle.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import API from '@site/src/api';
import { TaskStatus } from '../types';
import clsx from 'clsx';
import TaskForm from './TaskForm';
import {
    TASK_PRIORITY_COLORS,
    TASK_STATUSES,
    TASK_STATUS_NAMES,
} from '../constants';

interface Props {
    project: ProjectInfo;
    cycleInfo: CycleInfo;
    cycles: CycleInfo[];
}

const CycleDetailView = ({ project, cycleInfo, cycles }: Props) => {
    const [detail, setDetail] = useState<CycleDetail>();
    const [isFormVisible, setFormVisible] = useState(false);
    const [targetTask, setTargetTask] = useState<Task>();
    const context = useRef<{
        project: ProjectInfo;
        cycleInfo: CycleInfo;
    }>();

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
        if (!project.id || !cycleInfo.id) return;
        try {
            const data = await API.weaver.cycleDetail(project.id, cycleInfo.id);
            setDetail(data);
        } catch (error) {
            console.log(error);
        }
    }, [cycleInfo, project]);

    useEffect(() => {
        refetch();
        context.current = {
            project,
            cycleInfo,
        };
    }, [project, cycleInfo]);

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
                                        onClick={() => {
                                            setTargetTask(task);
                                            setFormVisible(true);
                                        }}
                                    >
                                        <div
                                            className={styles.taskCardIndicator}
                                            style={{
                                                background: `var(--theme-color-${
                                                    TASK_PRIORITY_COLORS[
                                                        task.priority
                                                    ]
                                                })`,
                                            }}
                                        />
                                        <div className={styles.taskName}>
                                            {task.name}
                                        </div>

                                        <div className={styles.taskExecutor}>
                                            执行者：{task.executor}
                                        </div>
                                        {status !== TaskStatus.Todo &&
                                            (task.progress ?? 0) !== 0 && (
                                                <div
                                                    className={
                                                        styles.taskProgress
                                                    }
                                                    style={{
                                                        background: `linear-gradient(90deg, #c3dda7 ${
                                                            task.progress ?? 0
                                                        }%, rgba(0, 0, 0, 0.04) ${
                                                            task.progress ?? 0
                                                        }%)`,
                                                    }}
                                                />
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {status === TaskStatus.Todo && (
                            <div
                                className={clsx(
                                    styles.taskAdd,
                                    commonStyles.card,
                                )}
                                onClick={async () => {
                                    setTargetTask(undefined);
                                    setFormVisible(true);
                                }}
                            >
                                +
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {isFormVisible && (
                <TaskForm
                    task={targetTask}
                    context={context.current}
                    moveCycle={async (cycleId) => {
                        if (!targetTask) return false;
                        try {
                            await API.weaver.changeTaskCycle(
                                project.id,
                                cycleInfo.id,
                                targetTask.id,
                                cycleId,
                            );
                            return true;
                        } catch (error) {
                            console.log(error);
                            return false;
                        }
                    }}
                    cycles={cycles}
                    update={async (props) => {
                        try {
                            if (targetTask) {
                                await API.weaver.updateTask(
                                    project.id,
                                    cycleInfo.id,
                                    targetTask.id,
                                    props,
                                );
                                return true;
                            } else {
                                if (!props.name) return false;
                                await API.weaver.addTask(
                                    project.id,
                                    cycleInfo.id,
                                    {
                                        ...props,
                                        name: props.name,
                                        status: TaskStatus.Todo,
                                    },
                                );
                                return true;
                            }
                        } catch (error) {
                            console.log(error);
                            return false;
                        }
                    }}
                    remove={async () => {
                        if (!targetTask) return false;
                        try {
                            await API.weaver.deleteTask(
                                project.id,
                                cycleInfo.id,
                                targetTask.id,
                            );
                            return true;
                        } catch (error) {
                            console.log(error);
                            return false;
                        }
                    }}
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
