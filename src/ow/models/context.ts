import { createContext } from "react";

export enum Router {
    Home,
    Docs,
    Blog,
    Gallery,
    Links,
}

export enum TabState {
    Corner,
    Row,
}

export enum SceneLevel {
    Zero,
    One = 'ow-scene-level-1',
}

export interface PageState {
    router: Router;
    tab: TabState;
    scene: SceneLevel;
}

export interface Page {
    state: PageState
    method: {
        push: (next: PageState) => void;
        pop: () => void;
    }
}

export const INITIAL_STATE = {
    router: Router.Links, 
    tab: TabState.Corner,
    scene: SceneLevel.Zero
}

export const PageContext = createContext<Page>({ 
    state: INITIAL_STATE, 
    method: { 
        push: () => {}, 
        pop: () => {} 
    } 
})