import styled from 'styled-components';
import { useDrag } from '@use-gesture/react';
import { useRef, useState } from 'react';

const Container = styled.div`
    --bar-height: 20px;
    --thumb-length: 30px;
    --track-position: 0%;
    --border-radius: 10px;

    position: relative;
    width: 100%;

    > * {
        flex: 0 0;
    }
`;

const Thumb = styled.div`
    position: absolute;
    top: calc((var(--bar-height) - var(--thumb-length)) / 2);
    left: calc(var(--track-position) - var(--thumb-length) / 2);
    width: var(--thumb-length);
    height: var(--thumb-length);
    border: 4px solid black;
    border-radius: 50%;
    background-color: white;
    touch-action: none;
    z-index: 100;
`;

const Track = styled.div`
    position: absolute;
    width: var(--track-position);
    height: var(--bar-height);
    border: 4px solid black;
    border-radius: var(--border-radius);
    background-color: var(--theme-color-green);
    z-index: 50;
`;

const Bar = styled.div`
    position: absolute;
    width: 100%;
    height: var(--bar-height);
    border: 4px solid black;
    border-radius: var(--border-radius);
    background-color: var(--theme-color-gray);
    z-index: 10;
`;

const Slider = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const bind = useDrag(
        ({ offset: [x, y] }) => {
            const container = containerRef.current;
            if (!container) return;
            const width = container.getBoundingClientRect().width;
            const offsetPercent = (x * 100) / width;
            const actualOffsetPercent = Math.max(
                0,
                Math.min(offsetPercent, 100),
            );
            container.style.setProperty(
                '--track-position',
                actualOffsetPercent + '%',
            );
            setProgress(actualOffsetPercent);
        },
        {
            axis: 'x',
        },
    );

    return (
        <Container ref={containerRef}>
            <Thumb {...bind()} />
            <Track />
            <Bar />
        </Container>
    );
};

export default Slider;
