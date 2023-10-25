import '../styles/scene.css';
import useScreen, { Screen } from '@site/src/hooks/useScreen';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PageContext, SceneLevel } from '../models/context';
import { OrangeButton } from './Button';

const SCENES = [
    {
        title: '南京 栖霞山',
        img: 'https://r.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEGgRtksXQIKNmqU5VUGrB6J6G5.D2Dg8xmkm5lFJGZ86Ox*KDyFdsjSafFIVezETaJuV.EzZMLRDsD1Vo0eRfWY!/r',
    },
    {
        title: '青岛 鲁迅公园',
        img: 'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1YXgc2/bqQfVz5yrrGYSXMvKr.cqaOObb1ygfTxfj6bQWvWC6EXMACeeba4UvhVubjeBx.mXZx1FYhBNbBdEtjHLL7x7xu7JsY1Pv0ehXf49Bar6*g!/r',
    },
    {
        title: '南京 古秦淮',
        img: 'https://r.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEMbYQH8lkiws*5rCIaE09i82RbcEMyrS1X07XrTaaND.gDnMNvR3DA5BnDq20ctXiEpoPfiOV.r8tn6abNfeeho!/r',
    },

    {
        title: '南京 玄武湖',
        img: 'https://r.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEJVqmSngXdMnrh97rVk*1md1PTUPuMED7hBoWQG3guvtAaPBi3Ot9xRkj6uZ7LDfZd4DkRhsnV1HyUJtB6*8wmc!/r',
    },
    {
        title: '湖南省博物馆',
        img: 'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E0dV59G/TmEUgtj9EK6.7V8ajmQrEJHUPpwfIojpD3NIHEz7Y1BxyRfnEghq0ppFPHG8TNbTJhN8K3VD5AGPgfiGQhEIBsEgwHuyXMkE.iGHWHOQrgY!/r',
    },
    {
        title: '守望先锋 归来',
        img: 'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1ioe76/bqQfVz5yrrGYSXMvKr.cqcw3Vr5tG1tVse1MUIM83zjN1Ds6WZGwA*VP7Epq4QJObUnvRix.i2Jj6IMQUty0mHyjvq1tPf05sXmIFRX3JuY!/r',
    },
];

const FILL_SCENE =
    'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1ioe76/bqQfVz5yrrGYSXMvKr.cqcyuPStnr1Xqld4koFzDfPudb.JWLNzTTnamefruENKS.BixfigsE1w4iF64a2co1fi3Wj2PgRXaFbtCugDeXqQ!/r';

const OW_SCENE_IMAGE = 'ow-scene-image';
const OW_SCENE_ID = 'ow-scene-image';

const getTime = () => dayjs().format('hh:mm A');

const Scene = () => {
    const screen = useScreen();
    const context = useContext(PageContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageIdx, setImageIdx] = useState(0);
    const [time, setTime] = useState<string>(getTime());

    let maskOpacity = 0;
    let scene = SCENES[imageIdx];
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
        setImageIdx(
            (Number(localStorage.getItem(OW_SCENE_IMAGE)) ?? 0) % SCENES.length,
        );
        const el = document.getElementById(OW_SCENE_ID) as HTMLImageElement;
        el.onload = () => setIsLoaded(true);
        el.src = scene.img;
    }, []);

    useEffect(() => {
        const timerId = setInterval(() => setTime(getTime()), 5000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <>
            <div className={clsx('ow-scene', context.state.scene)}>
                <div
                    className="ow-bg ow-bg-mask"
                    style={{ opacity: maskOpacity }}
                />
                <img
                    referrerPolicy="no-referrer"
                    id={OW_SCENE_ID}
                    className="ow-bg"
                    src={scene.img}
                    style={{ opacity: isLoaded ? 1 : 0 }}
                    alt="background"
                />
            </div>
            {context.setting.time && <div className="ow-time">{time}</div>}
            {isLoaded && context.state.scene === SceneLevel.Zero && (
                <div className="ow-scene-desc">
                    {screen && screen > Screen.Small && (
                        <div className="ow-scene-desc-title">{scene.title}</div>
                    )}
                    <OrangeButton onClick={switchImage}>切换壁纸</OrangeButton>
                </div>
            )}
            {context.state.scene === SceneLevel.Fill && (
                <div className="ow-scene ow-scene-main">
                    <img
                        referrerPolicy="no-referrer"
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
