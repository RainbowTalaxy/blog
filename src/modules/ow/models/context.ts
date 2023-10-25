import { Screen } from '@site/src/hooks/useScreen';
import useStack from '@site/src/hooks/useStack';
import { createContext } from 'react';

export enum Router {
    Home = '主界面',
    Docs = '笔记',
    Blog = '博客',
    Gallery = '画廊',
    Links = '收藏夹',
    Patch = '更新说明',
    Todo = '版本计划',
    Live = '网站链接',
    Setting = '选项设置',
}

export enum TabState {
    Corner,
    Row,
}

export enum CursorSize {
    Small = 'url(/assets/ow/ow-cursor-small.png)',
    Middle = 'url(/assets/ow/ow-cursor.png)',
}

export enum SceneLevel {
    Zero = 'ow-scene-level-0',
    One = 'ow-scene-level-1',
    Fill = 'ow-scene-level-fill',
}

export interface PageState {
    router: Router;
    tabs?: Router[];
    scene: SceneLevel;
}

export interface Setting {
    time: boolean;
    cursor: CursorSize;
}

export interface Page {
    state: PageState;
    screen?: Screen;
    setting: Setting;
    history: ReturnType<typeof useStack<PageState>>['history'];
    setSetting: <Key extends keyof Setting>(
        key: Key,
        value: Setting[Key],
    ) => void;
}

export const INITIAL_STATE: PageState = {
    router: Router.Home,
    scene: SceneLevel.Zero,
};

export const DEFAULT_SETTING: Setting = {
    time: false,
    cursor: CursorSize.Middle,
};

export const PageContext = createContext<Page>({
    state: INITIAL_STATE,
    screen: Screen.Medium,
    setting: DEFAULT_SETTING,
    history: {
        push: () => {},
        pop: () => {},
        replace: () => {},
    },
    setSetting: () => {},
});
