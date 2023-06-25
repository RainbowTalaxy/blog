import { createPortal } from 'react-dom';
import styles from './TaskForm.module.css';
import { CycleInfo, ProjectInfo, Task } from '@site/src/api/weaver';
import { useEffect, useRef, useState } from 'react';
import { UserInfo } from '@site/src/constants/user';
import { Priority, TaskStatus } from '../types';
import {
    TASK_PRIORITIES,
    TASK_PRIORITY_COLORS,
    TASK_STATUSES,
    TASK_STATUS_NAMES,
} from '../constants';
import clsx from 'clsx';
import API from '@site/src/api';

interface Props {
    task?: Task;
    context: {
        user: UserInfo;
        project: ProjectInfo;
        cycleInfo: CycleInfo;
    };
    cycles: CycleInfo[];
    moveCycle: (cycleId: string) => Promise<boolean>;
    update: (props: {
        name?: string;
        description?: string;
        priority?: Priority;
        status: TaskStatus;
    }) => Promise<boolean>;
    remove: (taskId: string) => Promise<boolean>;
    onClose: (success?: boolean) => Promise<void>;
}

const TaskForm = ({
    task,
    context,
    cycles,
    update,
    moveCycle,
    remove,
    onClose,
}: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.Todo);
    const [priority, setPriority] = useState<Priority>(Priority.One);
    const cycleRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (task) {
            nameRef.current!.value = task.name;
            descriptionRef.current!.value = task.description;
            setStatus(task.status as TaskStatus);
            setPriority(task.priority);
            cycleRef.current!.value = context.cycleInfo.id;
        }
    }, [task, context, cycles]);

    if (!context) return null;

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{task ? '任务详情' : '新建任务'}</h2>
                {task && (
                    <div className={styles.formItem}>
                        <label>状态：</label>
                        <div className={styles.priorityOptions}>
                            {TASK_STATUSES.map((s) => (
                                <div
                                    key={s}
                                    className={clsx(
                                        styles.priority,
                                        s === status && styles.selected,
                                    )}
                                    style={{
                                        background: `var(--theme-color-gray)`,
                                    }}
                                    onClick={() => setStatus(s)}
                                >
                                    {TASK_STATUS_NAMES[s]}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className={styles.formItem}>
                    <label>
                        <span>*</span>标题：
                    </label>
                    <input ref={nameRef} type="text" />
                </div>
                <div className={styles.formItem}>
                    <label>描述：</label>
                    <textarea ref={descriptionRef} />
                </div>
                <div className={styles.formItem}>
                    <label>优先级：</label>
                    <div className={styles.priorityOptions}>
                        {TASK_PRIORITIES.map((p) => (
                            <div
                                key={p}
                                className={clsx(
                                    styles.priority,
                                    p === priority && styles.selected,
                                )}
                                style={{
                                    background: `var(--theme-color-${TASK_PRIORITY_COLORS[p]})`,
                                }}
                                onClick={() => setPriority(p)}
                            >
                                {p}
                            </div>
                        ))}
                    </div>
                </div>
                {task && cycles && (
                    <div className={styles.formItem}>
                        <label>周期：</label>
                        <select ref={cycleRef}>
                            {cycles.map((c) => (
                                <option key={c.id} value={c.id}>
                                    第 {c.idx + 1} 周
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className={styles.formItem}>
                    <label></label>
                    <button
                        className={styles.primary}
                        onClick={async () => {
                            if (!nameRef.current?.value)
                                return alert('请输入标题');
                            const result = await update({
                                name: nameRef.current!.value,
                                description: descriptionRef.current!.value,
                                status,
                                priority,
                            });
                            if (!result) return alert('提交失败');
                            if (
                                task &&
                                context.cycleInfo.id !== cycleRef.current!.value
                            ) {
                                const cycleResult = await moveCycle(
                                    cycleRef.current!.value,
                                );
                                if (!cycleResult) return alert('周期修改失败');
                            }
                            await onClose(true);
                        }}
                    >
                        提交
                    </button>
                    <button onClick={() => onClose()}>取消</button>
                    {task && (
                        <button
                            className={styles.danger}
                            onClick={async () => {
                                const result = confirm(
                                    `确定删除任务 ${task.name} ？`,
                                );
                                if (!result) return;
                                const deleteResult = await remove(task.id);
                                if (!deleteResult) return alert('删除失败');
                                await onClose(true);
                            }}
                        >
                            删除
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.mask} onClick={() => onClose()} />
        </div>,
        document.body,
    );
};

export default TaskForm;
