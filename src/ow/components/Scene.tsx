import clsx from 'clsx';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PageContext, SceneLevel } from '../models/context';
import '../styles/scene.css';
import { OrangeButton } from './Button';

const SCENES = [
    'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1YXgc2/bqQfVz5yrrGYSXMvKr.cqaOObb1ygfTxfj6bQWvWC6EXMACeeba4UvhVubjeBx.mXZx1FYhBNbBdEtjHLL7x7xu7JsY1Pv0ehXf49Bar6*g!/r',
    'https://r.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEMbYQH8lkiws*5rCIaE09i82RbcEMyrS1X07XrTaaND.gDnMNvR3DA5BnDq20ctXiEpoPfiOV.r8tn6abNfeeho!/r',
    'https://r.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEGgRtksXQIKNmqU5VUGrB6J6G5.D2Dg8xmkm5lFJGZ86Ox*KDyFdsjSafFIVezETaJuV.EzZMLRDsD1Vo0eRfWY!/r',
];

const OW_SCENE_IMAGE = 'ow-scene-image';

const Scene = () => {
    const context = useContext(PageContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageIdx, setImageIdx] = useState(
        () => Number(localStorage.getItem(OW_SCENE_IMAGE)) ?? 0,
    );

    let maskOpacity = 0;
    switch (context.state.scene) {
        case SceneLevel.One:
            maskOpacity = 0.2;
    }

    const switchImage = useCallback(() => {
        setIsLoaded(false);
        setTimeout(() => {
            setImageIdx((prev) => {
                const newImageIdx = (prev + 1) % SCENES.length;
                localStorage.setItem(OW_SCENE_IMAGE, newImageIdx + '');
                return newImageIdx;
            });
        }, 600);
    }, []);

    return (
        <>
            <div className={clsx('ow-scene', context.state.scene)}>
                <div
                    className="ow-bg ow-bg-mask"
                    style={{ opacity: maskOpacity }}
                />
                <img
                    className="ow-bg"
                    onLoad={() => setIsLoaded(true)}
                    src={SCENES[imageIdx]}
                    style={{ opacity: isLoaded ? 1 : 0 }}
                    alt="background"
                />
            </div>
            <OrangeButton
                className="ow-right-bottom-button"
                onClick={switchImage}
            >
                切换壁纸
            </OrangeButton>
        </>
    );
};

export default Scene;
