import './styles/index.css';
import './styles/post.css';
import './styles/section.css';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Home from './pages/Home';
import {
    PageContext,
    Page,
    Router,
    PageState,
    INITIAL_STATE,
    DEFAULT_SETTING,
    Setting,
} from './models/context';
import Scene from './components/Scene';
import NavBar from './components/NavBar';
import Links from './pages/Links';
import useStack from '../../hooks/useStack';
import useKeyboard from '../../hooks/useKeyboard';
import Gallery from './pages/Gallery';
import Alert from './components/Alert';
import Document from './pages/Document';
import useScreen from '../../hooks/useScreen';
import LiveList from './pages/LiveList';
import SettingPage from './pages/Setting';
import { useLocalStorage } from 'usehooks-ts';
import Docs from './pages/Docs';
// @ts-ignore
import CHANGELOG from './docs/CHANGELOG.md';
// @ts-ignore
import TODO from './docs/TODO.md';

const UPDATE_KEY = 'ow-update';
const SETTING_KEY = 'ow-setting';

const Overwatch = () => {
    const screen = useScreen();
    const { state, history } = useStack<PageState>(INITIAL_STATE);
    const [isTipVisible, setTipVisible] = useState(false);
    const [setting, _setSetting] = useLocalStorage(
        SETTING_KEY,
        DEFAULT_SETTING,
    );
    const view = useRef<HTMLDivElement>(null);

    const setSetting = useCallback(
        <Key extends keyof Setting>(key: Key, value: Setting[Key]) => {
            _setSetting((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        [],
    );

    const context = useMemo<Page>(() => {
        return {
            state,
            screen,
            setting,
            setSetting,
            history,
        };
    }, [state, history]);

    useKeyboard('Escape', () => history.pop());

    useEffect(() => {
        const hasShownTip = localStorage.getItem(UPDATE_KEY);
        if (!hasShownTip) {
            setTipVisible(true);
        }
    }, []);

    useEffect(() => {
        view.current?.style.setProperty('--cursor-img', setting.cursor);
    }, [setting.cursor]);

    return (
        <PageContext.Provider value={context}>
            <div className="ow-view" ref={view}>
                {isTipVisible && (
                    <Alert
                        title="温馨提示"
                        description="为了获得更好的体验，请使用 Safari、Chrome 或 Chromium
                        内核的 Edge 浏览器，并升级到最新版本！"
                        onConfirm={() => {
                            localStorage.setItem(UPDATE_KEY, 'true');
                            setTipVisible(false);
                        }}
                    />
                )}
                <NavBar />
                {state.router === Router.Home && <Home />}
                {state.router === Router.Docs && <Docs />}
                {state.router === Router.Links && <Links />}
                {state.router === Router.Gallery && <Gallery />}
                {state.router === Router.Patch && <Document doc={CHANGELOG} />}
                {state.router === Router.Todo && <Document doc={TODO} />}
                {state.router === Router.Live && <LiveList />}
                {state.router === Router.Setting && <SettingPage />}
                <Scene />
            </div>
        </PageContext.Provider>
    );
};

export default Overwatch;
