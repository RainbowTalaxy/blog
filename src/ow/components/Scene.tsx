import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../models/context';
import '../styles/scene.css';

const MAIN_SCENE =
    'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1YXgc2/bqQfVz5yrrGYSXMvKr.cqaOObb1ygfTxfj6bQWvWC6EXMACeeba4UvhVubjeBx.mXZx1FYhBNbBdEtjHLL7x7xu7JsY1Pv0ehXf49Bar6*g!/r';

const Scene = () => {
    const context = useContext(PageContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(MAIN_SCENE, { mode: 'no-cors' }).then(() => setLoading(false));
    }, []);

    return (
        <div className={clsx('ow-scene', context.state.scene)}>
            <img
                className="ow-bg"
                src={loading ? '/assets/ow/background.png' : MAIN_SCENE}
                alt="background"
            />
        </div>
    );
};

export default Scene;
