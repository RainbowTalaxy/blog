import useScreen, { Screen } from '@site/src/hooks/useScreen';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PageContext, SceneLevel } from '../models/context';
import '../styles/scene.css';
import { OrangeButton } from './Button';

const SCENES = [
    {
        title: '青岛 鲁迅公园',
        img: '',
    },
    {
        title: '南京 古秦淮',
        img: '',
    },
    {
        title: '南京 栖霞山',
        img: '',
    },
    {
        title: '南京 玄武湖',
        img: '',
    },
    {
        title: '湖南省博物馆',
        img: '',
    },
    {
        title: '守望先锋 归来',
        img: '',
    },
];

const FILL_SCENE = '';

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
        setImageIdx(Number(localStorage.getItem(OW_SCENE_IMAGE)) ?? 0);
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
                    {screen > Screen.Small && (
                        <div className="ow-scene-desc-title">{scene.title}</div>
                    )}
                    <OrangeButton onClick={switchImage}>切换壁纸</OrangeButton>
                </div>
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
