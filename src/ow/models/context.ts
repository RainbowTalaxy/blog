import { createContext } from "react";

export enum Router {
    Home,
    Docs,
    Blog,
    Gallery,
}

export enum TabState {
    Corner,
    Row,
}

export interface PageState {
    router: Router;
    tab: TabState;
}

export const PageContext = createContext<PageState>({ router: Router.Home, tab: TabState.Corner })