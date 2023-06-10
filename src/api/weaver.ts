import { SERVER_API } from '../constants/config';
import { rocket } from './utils';

export interface ProjectInfo {
    id: string;
    name: string;
    owner: string;
    createdAt: number;
}

const WeaverAPI = {
    projects: (userId: string) =>
        rocket.get<ProjectInfo[]>(`${SERVER_API}/weaver/${userId}/projects`),
    createProject: (userId: string, name: string) =>
        rocket.post<{ id: string }>(`${SERVER_API}/weaver/${userId}/project`, {
            name,
        }),
};

export default WeaverAPI;
