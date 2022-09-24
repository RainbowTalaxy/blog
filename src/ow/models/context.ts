import { createContext } from 'react';

export enum Router {
    Home,
    Docs,
    Blog,
    Gallery,
    Links,
    Patch,
    Todo,
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
    tab: TabState;
    scene: SceneLevel;
}

export interface Page {
    state: PageState;
    method: {
        push: (next: PageState) => void;
        pop: () => void;
    };
}

export const INITIAL_STATE = {
    router: Router.Home,
    tab: TabState.Corner,
    scene: SceneLevel.Zero,
};

export const PageContext = createContext<Page>({
    state: INITIAL_STATE,
    method: {
        push: () => {},
        pop: () => {},
    },
});
