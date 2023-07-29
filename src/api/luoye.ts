import { SERVER_API } from '../constants/config';
import { rocketV2 } from './utils';

export enum Scope {
    Private = 'private',
    Public = 'public',
}

export enum DocType {
    Markdown = 'markdown',
}

interface DocDir {
    docId: string; // 文档 id
    name: string; // 文档名称
    scope: Scope; // 可见范围
    updatedAt: number; // 更新时间
}

export interface WorkspaceItem {
    id: string; // 工作区 id
    name: string; // 工作区名称
    description: string; // 工作区描述
    scope: Scope; // 可见范围
    joinAt: number; // 添加时间
}

export interface Workspace {
    id: string; // 工作区 id
    name: string; // 工作区名称
    description: string; // 工作区描述
    scope: Scope; // 可见范围
    creator: string; // 创建者
    admins: string[]; // 管理员列表
    members: string[]; // 成员列表
    docs: DocDir[]; // 文档列表
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
}

export interface DocItem {
    id: string; // 文档 id
    name: string; // 文档名称
    creator: string; // 创建者
    scope: Scope; // 可见范围
    docType: DocType; // 文档类型
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
}

export interface Doc {
    id: string; // 文档 id
    name: string; // 文档名称
    creator: string; // 创建者
    admins: string[]; // 管理员列表
    members: string[]; // 成员列表
    scope: Scope; // 可见范围
    workspaces: string[]; // 所属工作区 id
    docType: DocType; // 文档类型
    content: string; // 文档内容
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
}

const LuoyeAPI = {
    workspaces: () =>
        rocketV2.get<WorkspaceItem[]>(`${SERVER_API}/luoye/workspaces`),
    workspace: (id: string) =>
        rocketV2.get<Workspace>(`${SERVER_API}/luoye/workspace/${id}`),
    createWorkspace: (props: {
        name: string;
        description?: string;
        scope?: Scope;
    }) => rocketV2.post<Workspace>(`${SERVER_API}/luoye/workspace`, props),
    updateWorkspace: (
        id: string,
        props: {
            name?: string;
            description?: string;
            scope?: Scope;
        },
    ) => rocketV2.put<Workspace>(`${SERVER_API}/luoye/workspace/${id}`, props),
    docs: () => rocketV2.get<DocItem[]>(`${SERVER_API}/luoye/docs`),
    doc: (id: string) => rocketV2.get<Doc>(`${SERVER_API}/luoye/doc/${id}`),
    createDoc: (
        workspaceId: string,
        props: {
            name?: string;
        },
    ) =>
        rocketV2.post<Doc>(`${SERVER_API}/luoye/doc`, {
            workspaceId,
            ...props,
        }),
    updateDoc: (
        id: string,
        props: {
            name?: string;
            content?: string;
            scope?: Scope;
        },
    ) => rocketV2.put<Doc>(`${SERVER_API}/luoye/doc/${id}`, props),
    deleteDoc: (id: string) =>
        rocketV2.delete<Doc>(`${SERVER_API}/luoye/doc/${id}`),
};

export default LuoyeAPI;
