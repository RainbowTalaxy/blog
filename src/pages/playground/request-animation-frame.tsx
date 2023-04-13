import { useCallback, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    margin: 10px 20px;
`;

const Progress = styled.div`
    --percentage: 0;
    margin: 10px 0;
    width: 300px;
    height: 16px;
    background: linear-gradient(#21ba9b, #21ba9b) left/0 no-repeat, #f2f2f2;
    background-size: calc(var(--percentage) * 1%);
    border: 1px solid black;
    /* transition: all 1s ease; */
`;

const Page = () => {
    const taskId = useRef<number>();

    const nextAnimation = useCallback(() => {
        taskId.current = window.requestAnimationFrame(() => {
            const target = document.querySelector(
                '.progress-bar',
            ) as HTMLDivElement;
            const progress = Number(
                target.style.getPropertyValue('--percentage'),
            );
            if (progress === 100) return;
            target.style.setProperty('--percentage', String(progress + 1));
            nextAnimation();
        });
    }, []);

    return (
        <Container>
            <Progress className="progress-bar" />
            <button
                onClick={() => {
                    if (taskId.current) {
                        window.cancelAnimationFrame(taskId.current);
                    }
                    const target = document.querySelector(
                        '.progress-bar',
                    ) as HTMLDivElement;
                    target.style.setProperty('--percentage', '0');
                    nextAnimation();
                }}
            >
                Trigger
            </button>
        </Container>
    );
};

export default Page;
