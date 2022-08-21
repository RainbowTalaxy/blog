import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

export enum Screen {
    Small,
    Medium,
    Large,
}

const useScreen = () => {
    const [screen, setScreen] = useState(Screen.Large);

    useEffect(() => {
        const event = throttle(() => {
            if (window.innerWidth < 640) {
                setScreen(Screen.Small);
            } else if (window.innerWidth < 845) {
                setScreen(Screen.Medium);
            } else {
                setScreen(Screen.Large);
            }
        }, 500);
        event();
        window.addEventListener('resize', event);
        return () => window.removeEventListener('resize', event);
    }, []);

    return screen;
};

export default useScreen;
