import { useMemo, useState } from 'react';
import Home from './pages/Home';
import { PageContext, PageState, Router, TabState } from './models/context';
import Scene from './components/Scene';
import NavBar from './components/NavBar';
import './styles/index.css';

const Overwatch = () => {
    const [router, setRouter] = useState(Router.Home);

    const context = useMemo<PageState>(() => {
        return {
            router,
            tab: TabState.Corner,
        };
    }, [router]);

    return (
        <PageContext.Provider value={context}>
            <div className="ow-view">
                <NavBar />
                {router === Router.Home && <Home />}
                <Scene />
            </div>
        </PageContext.Provider>
    );
};

export default Overwatch;
