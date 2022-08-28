import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { PageContext, SceneLevel } from '../models/context';
import '../styles/scene.css';

const MAIN_SCENE =
    'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1YXgc2/bqQfVz5yrrGYSXMvKr.cqaOObb1ygfTxfj6bQWvWC6EXMACeeba4UvhVubjeBx.mXZx1FYhBNbBdEtjHLL7x7xu7JsY1Pv0ehXf49Bar6*g!/r';

const Scene = () => {
    const context = useContext(PageContext);
    const [isLoaded, setIsLoaded] = useState(false);

    let maskOpacity = 0;
    switch (context.state.scene) {
        case SceneLevel.One:
            maskOpacity = 0.2;
    }

    useEffect(() => {
        fetch(MAIN_SCENE, { mode: 'no-cors' }).then(() =>
            setTimeout(() => setIsLoaded(true), 1000),
        );
    }, []);

    return (
        <div className={clsx('ow-scene', context.state.scene)}>
            <div
                className="ow-bg ow-bg-mask"
                style={{ opacity: maskOpacity }}
            />
            <img
                className="ow-bg"
                src={MAIN_SCENE}
                style={{ opacity: isLoaded ? 1 : 0 }}
                alt="background"
            />
        </div>
    );
};

export default Scene;
