import { SERVER_API } from '../constants/config';
import { rocketV2 } from './utils';

export interface Shortcut {
    id: string;
    url: string;
    isCustom: boolean;
    name?: string;
    createdAt: number;
    visits: number;
    lastVisit?: number;
}

export interface CreateShortcutBody {
    url: string;
    customId?: string;
    name?: string;
}

export interface UpdateShortcutBody {
    url?: string;
    name?: string;
}

const ShortcutAPI = {
    list: () => rocketV2.get<Shortcut[]>(`${SERVER_API}/shortcut/list`),
    info: (shortcutId: string) =>
        rocketV2.get<Shortcut>(`${SERVER_API}/shortcut/info/${shortcutId}`),
    create: (body: CreateShortcutBody) =>
        rocketV2.post<Shortcut>(`${SERVER_API}/shortcut`, body),
    update: (shortcutId: string, body: UpdateShortcutBody) =>
        rocketV2.put<Shortcut>(`${SERVER_API}/shortcut/${shortcutId}`, body),
    delete: (shortcutId: string) =>
        rocketV2.delete<{ success: boolean }>(
            `${SERVER_API}/shortcut/${shortcutId}`,
        ),
};

export default ShortcutAPI;
