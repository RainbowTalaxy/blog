import { useMemo, useRef, useState } from 'react';
import Home from './pages/Home';
import {
    PageContext,
    Page,
    Router,
    TabState,
    PageState,
    SceneLevel,
    INITIAL_STATE,
} from './models/Context';
import Scene from './components/Scene';
import NavBar from './components/NavBar';
import './styles/index.css';
import Links from './pages/Links';
import useStack from '../hooks/useStack';
import useKeyboard from '../hooks/useKeyboard';

const Overwatch = () => {
    const { state, history } = useStack<PageState>(INITIAL_STATE);

    const context = useMemo<Page>(() => {
        return {
            state: state,
            method: history,
        };
    }, [state, history]);

    useKeyboard('Escape', () => history.pop());

    return (
        <PageContext.Provider value={context}>
            <div className="ow-view">
                <NavBar />
                {state.router === Router.Home && <Home />}
                {state.router === Router.Links && <Links />}
                <Scene />
            </div>
        </PageContext.Provider>
    );
};

export default Overwatch;
