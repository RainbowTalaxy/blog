import { Doc, Workspace } from '@site/src/api/luoye';
import { getUser } from '@site/src/utils/user';
import dayjs from 'dayjs';

export const PROJECT_ICON = '🍂';
export const PROJECT_NAME = '落页';

export const DEFAULT_WORKSPACE = {
    name: 'default',
};

export const DEFAULT_WORKSPACE_PLACEHOLDER = {
    name: '个人工作区',
    description: '用于存放个人文档的工作区',
};

export const workSpaceName = (name: string) => {
    return name === DEFAULT_WORKSPACE.name ? '个人工作区' : name;
};

export const date = (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm');

export const checkAuth = (entity?: Workspace | Doc) => {
    const user = getUser();
    const result = {
        editable: false,
        configurable: false,
    };
    if (!entity) return result;
    if (entity.admins.includes(user?.id)) {
        result.editable = true;
        result.configurable = true;
    }
    if (entity.members.includes(user?.id)) {
        result.editable = true;
    }
    return result;
};
