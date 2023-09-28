import { Doc, DocType, Workspace, WorkspaceItem } from '@site/src/api/luoye';
import { getUser } from '@site/src/utils/user';
import dayjs from 'dayjs';
import { User } from '../../user/config';

export const PROJECT_ICON = '🍂';
export const PROJECT_NAME = '落页';

export const DEFAULT_WORKSPACE = {
    name: 'default',
};

export const DEFAULT_WORKSPACE_PLACEHOLDER = {
    name: '个人工作区',
    description: '用于存放个人文档的工作区',
};

export const LEAVE_EDITING_TEXT = '确定离开当前正在编辑的文档？';

export const DOCTYPE_OPTIONS = Object.values(DocType);

export const DOCTYPE_OPTIONS_NAME = {
    [DocType.Text]: '文本',
    [DocType.Markdown]: 'Markdown',
};

export const splitWorkspace = (workspaces: WorkspaceItem[]) => {
    const defaultWorkspaceIdx = workspaces.findIndex(
        (workspace) => workspace.id === User.config.id,
    );
    let defaultWorkspace = workspaces[defaultWorkspaceIdx] || workspaces[0];
    if (defaultWorkspaceIdx !== -1) {
        workspaces.splice(defaultWorkspaceIdx, 1);
    }
    defaultWorkspace = {
        ...defaultWorkspace,
        ...DEFAULT_WORKSPACE_PLACEHOLDER,
    };
    return {
        defaultWorkspace,
        workspaces,
    };
};

export const workSpaceName = (name: string) => {
    return name === DEFAULT_WORKSPACE.name ? '个人工作区' : name;
};

export const date = (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm');

export const checkAuth = (entity?: Workspace | Doc | null) => {
    const user = getUser();
    const result = {
        editable: false,
        configurable: false,
    };
    if (!entity || !user.id) return result;
    if (entity.admins.includes(user.id)) {
        result.editable = true;
        result.configurable = true;
    }
    if (entity.members.includes(user.id)) {
        result.editable = true;
    }
    return result;
};
