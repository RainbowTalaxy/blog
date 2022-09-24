import { useEffect, useMemo, useRef, useState } from 'react';
import Home from './pages/Home';
import {
    PageContext,
    Page,
    Router,
    PageState,
    INITIAL_STATE,
} from './models/context';
import Scene from './components/Scene';
import NavBar from './components/NavBar';
import './styles/index.css';
import './styles/post.css';
import Links from './pages/Links';
import useStack from '../hooks/useStack';
import useKeyboard from '../hooks/useKeyboard';
import Gallery from './pages/Gallery';
import Alert from './components/Alert';
import Document from './pages/Document';
import CHANGELOG from './docs/CHANGELOG.md';
import TODO from './docs/TODO.md';

const OW_UPDATE_KEY = 'ow-update';

const Overwatch = () => {
    const { state, history } = useStack<PageState>(INITIAL_STATE);
    const [isTipVisible, setTipVisible] = useState(false);

    const context = useMemo<Page>(() => {
        return {
            state: state,
            method: history,
        };
    }, [state, history]);

    useKeyboard('Escape', () => history.pop());

    useEffect(() => {
        const hasShownTip = localStorage.getItem(OW_UPDATE_KEY);
        if (!hasShownTip) {
            setTipVisible(true);
        }
    }, []);

    return (
        <PageContext.Provider value={context}>
            <div className="ow-view">
                {isTipVisible && (
                    <Alert
                        onConfirm={() => {
                            localStorage.setItem(OW_UPDATE_KEY, 'true');
                            setTipVisible(false);
                        }}
                    />
                )}
                <NavBar />
                {state.router === Router.Home && <Home />}
                {state.router === Router.Links && <Links />}
                {state.router === Router.Gallery && <Gallery />}
                {state.router === Router.Patch && (
                    <Document title="更新说明" doc={CHANGELOG} />
                )}
                {state.router === Router.Todo && (
                    <Document title="待办计划" doc={TODO} />
                )}
                <Scene />
            </div>
        </PageContext.Provider>
    );
};

export default Overwatch;
