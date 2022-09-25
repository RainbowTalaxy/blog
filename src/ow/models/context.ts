import { Screen } from '@site/src/hooks/useScreen';
import useStack from '@site/src/hooks/useStack';
import { createContext } from 'react';

export enum Router {
    Home = '主界面',
    Docs = '文档',
    Blog = '博客',
    Gallery = '画廊',
    Links = '收藏夹',
    Patch = '更新说明',
    Todo = '版本计划',
}

export enum TabState {
    Corner,
    Row,
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

export interface Page {
    state: PageState;
    screen: Screen;
    history: ReturnType<typeof useStack<PageState>>['history'];
}

export const INITIAL_STATE: PageState = {
    router: Router.Home,
    scene: SceneLevel.Zero,
};

export const PageContext = createContext<Page>({
    state: INITIAL_STATE,
    screen: Screen.Medium,
    history: {
        push: () => {},
        pop: () => {},
        replace: () => {},
    },
});
