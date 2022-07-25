import { useEffect } from 'react';

const useKeyboard = (key: string | string[], event: () => void) => {
    useEffect(() => {
        const callback = (e: KeyboardEvent) => {
            e.preventDefault();
            if (typeof key === 'string') {
                if (key === e.key) event();
            } else {
                if (key.includes(e.key)) event();
            }
        };
        document.addEventListener('keydown', callback);
        return () => document.removeEventListener('keydown', callback);
    }, []);
};

export default useKeyboard;
