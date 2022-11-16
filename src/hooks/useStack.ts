import { useCallback, useRef, useState } from 'react';

const useStack = <State>(initialState: State) => {
    const [current, setCurrent] = useState<State>(initialState);
    const history = useRef<Array<State>>([]);

    const push = useCallback(
        (nextState: State) => {
            history.current.push(current);
            setCurrent(nextState);
        },
        [current],
    );

    const pop = useCallback(() => {
        const prevState = history.current.pop();
        if (prevState) {
            setCurrent(prevState);
        }
    }, []);

    const replace = useCallback((targetState: State) => {
        setCurrent(targetState);
    }, []);

    return {
        state: current,
        history: { push, pop, replace },
    };
};

export default useStack;
