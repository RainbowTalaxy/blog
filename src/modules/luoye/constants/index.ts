import dayjs from 'dayjs';

export const DEFAULT_WORKSPACE_NAME = 'default';

export const date = (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm');
