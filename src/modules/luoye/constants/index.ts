import dayjs from 'dayjs';

export const PROJECT_ICON = '🍂';
export const PROJECT_NAME = '落页';

export const DEFAULT_WORKSPACE_NAME = 'default';

export const workSpaceName = (name: string) => {
    return name === DEFAULT_WORKSPACE_NAME ? '个人工作区' : name;
};

export const date = (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm');
