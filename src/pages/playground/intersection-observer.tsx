import { useEffect, useState } from 'react';
import styled from 'styled-components';

const TARGET_CARD = 'target-card';

const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;

    .${TARGET_CARD} {
        opacity: 0;
        background-color: var(--theme-color-yellow);
        transition: all 0.5s ease;
    }

    .active {
        opacity: 1;
    }
`;

const Info = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 10px;
    left: 10px;
    padding: 20px;
    border-radius: 5px;
    background-color: #f2f2f2;

    span {
        font-weight: bold;
        margin-right: 7px;
    }
`;

const Card = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20vh auto;
    border-radius: 5px;
    width: 60vh;
    height: 60vh;
    background-color: var(--theme-color-red);
`;

const Page = () => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    } else {
                        entry.target.classList.remove('active');
                    }
                    setEntry(entry);
                });
            },
            {
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        );
        observer.observe(document.querySelector('.' + TARGET_CARD));
    }, []);

    return (
        <Container>
            <Info>
                {entry ? (
                    <>
                        <div>
                            <span>Ratio</span>
                            {(entry?.intersectionRatio ?? 0).toFixed(3)}
                        </div>
                        <div>
                            <span>Active</span>
                            {String(entry?.isIntersecting ?? false)}
                        </div>
                        <div>
                            <span>Time</span>
                            {((entry?.time ?? 0) / 1000).toFixed(0)}s
                        </div>
                    </>
                ) : (
                    <span>No information</span>
                )}
            </Info>
            <Card />
            <Card className={TARGET_CARD}>Target card!</Card>
            <Card />
            <Card />
        </Container>
    );
};

export default Page;
