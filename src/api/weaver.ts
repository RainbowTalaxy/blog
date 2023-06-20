import { SERVER_API } from '../constants/config';
import { APIKey, rocket } from './utils';

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
}

export interface TaskProps {
    name?: string;
    description?: string;
    priority?: number;
    status?: number;
    executor?: string;
}

export interface CycleDetail {
    tasks: Task[];
}

const WeaverAPI = {
    projects: (userId: string) =>
        rocket.get<ProjectInfo[]>(`${SERVER_API}/weaver/${userId}/projects`),
    createProject: (userId: string, name: string) =>
        rocket.post<{ id: string }>(
            `${SERVER_API}/weaver/${userId}/project`,
            {
                name,
            },
            APIKey.file,
        ),
    deleteProject: (userId: string, projectId: string) =>
        rocket.delete(
            `${SERVER_API}/weaver/${userId}/project/${projectId}`,
            {},
            APIKey.file,
        ),
    cycles: (userId: string, projectId: string) =>
        rocket.get<CycleInfo[]>(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycles`,
        ),
    addCycle: (userId: string, projectId: string) =>
        rocket.post<CycleInfo>(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle`,
            {},
            APIKey.file,
        ),
    cycleDetail: (userId: string, projectId: string, cycleId: string) =>
        rocket.get<CycleDetail>(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle/${cycleId}`,
        ),
    addTask: (
        userId: string,
        projectId: string,
        cycleId: string,
        task: Omit<TaskProps, 'name'> & {
            name: string;
        },
    ) =>
        rocket.post(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle/${cycleId}/task`,
            task,
            APIKey.file,
        ),
    updateTask: (
        userId: string,
        projectId: string,
        cycleId: string,
        taskId: string,
        task: TaskProps,
    ) =>
        rocket.put(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle/${cycleId}/task/${taskId}`,
            task,
            APIKey.file,
        ),
    changeTaskCycle: (
        userId: string,
        projectId: string,
        cycleId: string,
        taskId: string,
        targetCycleId: string,
    ) =>
        rocket.put(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle/${cycleId}/task/${taskId}/move`,
            {
                cycleId: targetCycleId,
            },
            APIKey.file,
        ),
    deleteTask: (
        userId: string,
        projectId: string,
        cycleId: string,
        taskId: string,
    ) =>
        rocket.delete(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle/${cycleId}/task/${taskId}`,
            {},
            APIKey.file,
        ),
};

export default WeaverAPI;
