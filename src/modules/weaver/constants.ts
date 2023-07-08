import { Priority, TaskStatus } from './types';

export const TASK_PRIORITIES = [Priority.One, Priority.Two, Priority.Three];

export const TASK_PRIORITY_COLORS = {
    [Priority.One]: 'red',
    [Priority.Two]: 'orange',
    [Priority.Three]: 'green',
};

export const TASK_STATUSES = [
    TaskStatus.Todo,
    TaskStatus.Doing,
    TaskStatus.Testing,
    TaskStatus.Done,
];

export const TASK_STATUS_NAMES = {
    [TaskStatus.Todo]: '待处理',
    [TaskStatus.Doing]: '进行中',
    [TaskStatus.Testing]: '测试中',
    [TaskStatus.Done]: '已完成',
};

// 生成一个 0-100 的数组，stop 为 5 。
export const PROGRESS_STOPS = Array.from({ length: 105 / 5 }, (_, i) => i * 5);
