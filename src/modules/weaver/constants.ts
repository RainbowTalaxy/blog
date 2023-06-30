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

export const PROGRESS_STOPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
