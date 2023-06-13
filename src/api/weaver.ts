import { SERVER_API } from '../constants/config';
import { rocket } from './utils';

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

const WeaverAPI = {
    projects: (userId: string) =>
        rocket.get<ProjectInfo[]>(`${SERVER_API}/weaver/${userId}/projects`),
    createProject: (userId: string, name: string) =>
        rocket.post<{ id: string }>(`${SERVER_API}/weaver/${userId}/project`, {
            name,
        }),
    cycles: (userId: string, projectId: string) =>
        rocket.get<CycleInfo[]>(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle`,
        ),
    addCycle: (userId: string, projectId: string) =>
        rocket.post<CycleInfo>(
            `${SERVER_API}/weaver/${userId}/project/${projectId}/cycle`,
        ),
};

export default WeaverAPI;
