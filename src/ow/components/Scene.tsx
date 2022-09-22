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

const FILL_SCENE =
    'http://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1ioe76/bqQfVz5yrrGYSXMvKr.cqcyuPStnr1Xqld4koFzDfPudb.JWLNzTTnamefruENKS.BixfigsE1w4iF64a2co1fi3Wj2PgRXaFbtCugDeXqQ!/r';

const OW_SCENE_IMAGE = 'ow-scene-image';
const OW_SCENE_ID = 'ow-scene-image';

const Scene = () => {
    const context = useContext(PageContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageIdx, setImageIdx] = useState(0);

    let maskOpacity = 0;
    let image = SCENES[imageIdx];
    switch (context.state.scene) {
        case SceneLevel.One:
            maskOpacity = 0.2;
            break;
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

    useEffect(() => {
        setImageIdx(Number(localStorage.getItem(OW_SCENE_IMAGE)) ?? 0);
        const el = document.getElementById(OW_SCENE_ID) as HTMLImageElement;
        el.onload = () => setIsLoaded(true);
        el.src = image;
    }, []);

    return (
        <>
            <div className={clsx('ow-scene', context.state.scene)}>
                <div
                    className="ow-bg ow-bg-mask"
                    style={{ opacity: maskOpacity }}
                />
                <img
                    id={OW_SCENE_ID}
                    className="ow-bg"
                    src={image}
                    style={{ opacity: isLoaded ? 1 : 0 }}
                    alt="background"
                />
            </div>
            {isLoaded && context.state.scene === SceneLevel.Zero && (
                <OrangeButton
                    className="ow-right-bottom-button"
                    onClick={switchImage}
                >
                    切换壁纸
                </OrangeButton>
            )}
            {context.state.scene === SceneLevel.Fill && (
                <div className="ow-scene ow-scene-main">
                    <img
                        id={OW_SCENE_ID}
                        className="ow-bg"
                        src={FILL_SCENE}
                        style={{
                            opacity: isLoaded ? 1 : 0,
                            zIndex: 20,
                        }}
                        alt="background"
                    />
                </div>
            )}
        </>
    );
};

export default Scene;
