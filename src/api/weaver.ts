import { SERVER_API } from '../constants/config';
import { rocketV2 } from './utils';

export interface ProjectInfo {
    id: string;
    name: string;
    owner: string;
    createdAt: number;
}

export interface CycleInfo {
    id: string;
    idx: number;
    start: number;
    end: number;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    priority: number;
    status: number;
    executor: string;
    progress?: number;
    createdAt?: number;
    updatedAt?: number;
    finishedAt?: number;
}

export interface TaskProps {
    name?: string;
    description?: string;
    priority?: number;
    status?: number;
    executor?: string;
    progress?: number;
}

export interface ProjectProps {
    name?: string;
}

export interface CycleDetail {
    tasks: Task[];
}

const WeaverAPI = {
    projects: () =>
        rocketV2.get<ProjectInfo[]>(`${SERVER_API}/weaver/projects`),
    createProject: (name: string, firstDate?: number) =>
        rocketV2.post<{ id: string }>(`${SERVER_API}/weaver/project`, {
            name,
            firstDate,
        }),
    updateProject: (id: string, props: ProjectProps) =>
        rocketV2.put(`${SERVER_API}/weaver/project/${id}`, props),
    deleteProject: (projectId: string) =>
        rocketV2.delete(`${SERVER_API}/weaver/project/${projectId}`),
    cycles: (projectId: string) =>
        rocketV2.get<CycleInfo[]>(
            `${SERVER_API}/weaver/project/${projectId}/cycles`,
        ),
    addCycle: (projectId: string) =>
        rocketV2.post<CycleInfo>(
            `${SERVER_API}/weaver/project/${projectId}/cycle`,
        ),
    cycleDetail: (projectId: string, cycleId: string) =>
        rocketV2.get<CycleDetail>(
            `${SERVER_API}/weaver/project/${projectId}/cycle/${cycleId}`,
        ),
    addTask: (
        projectId: string,
        cycleId: string,
        taskProps: Omit<TaskProps, 'name'> & {
            name: string;
        },
    ) =>
        rocketV2.post(
            `${SERVER_API}/weaver/project/${projectId}/cycle/${cycleId}/task`,
            taskProps,
        ),
    updateTask: (
        projectId: string,
        cycleId: string,
        taskId: string,
        taskProps: TaskProps,
    ) =>
        rocketV2.put(
            `${SERVER_API}/weaver/project/${projectId}/cycle/${cycleId}/task/${taskId}`,
            taskProps,
        ),
    changeTaskCycle: (
        projectId: string,
        cycleId: string,
        taskId: string,
        targetCycleId: string,
    ) =>
        rocketV2.put(
            `${SERVER_API}/weaver/project/${projectId}/cycle/${cycleId}/task/${taskId}/move`,
            {
                cycleId: targetCycleId,
            },
        ),
    deleteTask: (projectId: string, cycleId: string, taskId: string) =>
        rocketV2.delete(
            `${SERVER_API}/weaver/project/${projectId}/cycle/${cycleId}/task/${taskId}`,
        ),
};

export default WeaverAPI;
