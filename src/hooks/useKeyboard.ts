import { useEffect } from 'react';

const useKeyboard = (key: string | string[], event: () => void) => {
    useEffect(() => {
        const callback = (e: KeyboardEvent) => {
            if (typeof key === 'string') {
                if (key !== e.key) return;
            } else {
                if (!key.includes(e.key)) return;
            }
            e.preventDefault();
            event();
        };
        document.addEventListener('keydown', callback);
        return () => document.removeEventListener('keydown', callback);
    }, [key, event]);
};

export default useKeyboard;
