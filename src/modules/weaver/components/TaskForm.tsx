import { createPortal } from 'react-dom';
import styles from './TaskForm.module.css';
import { CycleInfo, ProjectInfo, Task, TaskProps } from '@site/src/api/weaver';
import { useEffect, useRef, useState } from 'react';
import { Priority, TaskStatus } from '../types';
import {
    PROGRESS_STOPS,
    TASK_POOL_NAME,
    TASK_PRIORITIES,
    TASK_PRIORITY_COLORS,
    TASK_STATUSES,
    TASK_STATUS_NAMES,
} from '../constants';
import clsx from 'clsx';
import { Button, Input, Select, TextArea } from '@site/src/components/Form';

interface Props {
    task?: Task;
    context: {
        project: ProjectInfo;
        cycleInfo: CycleInfo;
    };
    cycles: CycleInfo[];
    moveCycle: (cycleId: string) => Promise<boolean>;
    update: (props: TaskProps) => Promise<boolean>;
    remove: (taskId: string) => Promise<boolean>;
    onClose: (success?: boolean) => Promise<void>;
}

const TaskForm = ({ task, context, cycles, update, moveCycle, remove, onClose }: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.Todo);
    const [priority, setPriority] = useState<Priority>(Priority.One);
    const [progress, setProgress] = useState<number>(0);
    const cycleRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (task) {
            nameRef.current!.value = task.name;
            descriptionRef.current!.value = task.description;
            setStatus(task.status as TaskStatus);
            setPriority(task.priority);
            setProgress(task.progress ?? 0);
            cycleRef.current!.value = context.cycleInfo.id;
        }
    }, [task, context, cycles]);

    if (!context) return null;

    return createPortal(
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>{task ? '任务详情' : '新建任务'}</h2>
                <div className={styles.formItem}>
                    <label>
                        <span>*</span>标题：
                    </label>
                    <Input raf={nameRef} />
                </div>
                {task && (
                    <div className={clsx(styles.formItem, styles.statusFormItem)}>
                        <label>状态：</label>
                        <div className={styles.options}>
                            {TASK_STATUSES.map((s) => (
                                <div
                                    key={s}
                                    className={clsx(styles.status, s === status && styles.selected)}
                                    onClick={() => setStatus(s)}
                                >
                                    {TASK_STATUS_NAMES[s]}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {task && status === TaskStatus.Doing && (
                    <div className={styles.formItem}>
                        <label style={{ margin: '-4px 0' }}>进度：</label>
                        <div className={styles.progressOptions}>
                            {PROGRESS_STOPS.map((p) => (
                                <div
                                    key={p}
                                    className={clsx(styles.progress, p <= progress && styles.selected)}
                                    onClick={() => setProgress(p)}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}
                <div className={styles.formItem}>
                    <label>描述：</label>
                    <TextArea raf={descriptionRef} />
                </div>
                <div className={styles.formItem}>
                    <label>优先级：</label>
                    <div className={styles.options}>
                        {TASK_PRIORITIES.map((p) => (
                            <div
                                key={p}
                                className={clsx(styles.priority, p === priority && styles.selected)}
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
                        <Select raf={cycleRef}>
                            <option value={TASK_POOL_NAME}>任务池</option>
                            {cycles.map((c) => (
                                <option key={c.id} value={c.id}>
                                    第 {c.idx + 1} 周
                                </option>
                            ))}
                        </Select>
                    </div>
                )}
                <div className={styles.formItem}>
                    <label></label>
                    <div className={styles.options}>
                        <Button
                            type="primary"
                            onClick={async () => {
                                if (!nameRef.current?.value) return alert('请输入标题');
                                const result = await update({
                                    name: nameRef.current!.value,
                                    description: descriptionRef.current!.value,
                                    status,
                                    priority,
                                    progress,
                                });
                                if (!result) return alert('提交失败');
                                if (task && context.cycleInfo.id !== cycleRef.current!.value) {
                                    const cycleResult = await moveCycle(cycleRef.current!.value);
                                    if (!cycleResult) return alert('周期修改失败');
                                }
                                await onClose(true);
                            }}
                        >
                            {task ? '保存' : '创建'}
                        </Button>
                        <Button onClick={() => onClose()}>取消</Button>
                        {task && (
                            <Button
                                type="danger"
                                onClick={async () => {
                                    const result = confirm(`确定删除任务 ${task.name} ？`);
                                    if (!result) return;
                                    const deleteResult = await remove(task.id);
                                    if (!deleteResult) return alert('删除失败');
                                    await onClose(true);
                                }}
                            >
                                删除
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.mask} onClick={() => onClose()} />
        </div>,
        document.body,
    );
};

export default TaskForm;
