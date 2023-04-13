import { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        height: 100%;
        overflow: hidden;
    }
`;

const Container = styled.div`
    background-color: var(--theme-color-blue);
    height: 100vh;
    overflow: scroll;
    scrollbar-width: none;
    ::-webkit-scrollbar {
        display: none;
    }

    .page {
        height: 5000px;
    }

    @keyframes dropdown {
        from {
            top: calc(var(--drop-size) * 0.2);
        }
        to {
            top: calc(100% - var(--drop-size) * 1.5);
        }
    }

    .drop {
        --drop-size: 30px;
        margin-top: 12px;
        width: var(--drop-size);
        height: var(--drop-size);
        background-color: white;
        border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
        transform: rotate(-45deg);
    }

    .scroll-state {
        position: fixed;
        right: 10px;

        animation: dropdown 1s linear infinite;
        animation-play-state: paused;
        animation-delay: calc(var(--scroll) * -1s);
    }
`;

const Page = () => {
    useEffect(() => {
        const scrollView = document.querySelector(
            '.scroll-view',
        ) as HTMLDivElement;
        const scrollDetect = () => {
            document.body.style.setProperty(
                '--scroll',
                String(
                    Math.min(
                        scrollView.scrollTop /
                            (scrollView.scrollHeight - scrollView.offsetHeight),
                        0.99,
                    ),
                ),
            );
        };
        scrollView.addEventListener('scroll', scrollDetect);
        return () => scrollView.removeEventListener('scroll', scrollDetect);
    }, []);

    return (
        <>
            <GlobalStyle />
            <Container className="scroll-view">
                <div className="page">
                    <div className="drop scroll-state"></div>
                </div>
            </Container>
        </>
    );
};

export default Page;
