import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 100px;

    h1 {
        font-size: 36px;
    }

    h2 {
        font-size: 28px;
    }

    p {
        font-size: 24px;
    }

    section {
        position: relative;
    }

    .rect {
        position: absolute;
        width: 100px;
        height: 100px;
        z-index: -1;
    }

    .rect-1 {
        right: 0;
        bottom: 0;
        background-color: var(--theme-color-cyan);
        transform: translateY(var(--parallel-y));
    }

    .rect-2 {
        left: 0;
        bottom: 0;
        background-color: var(--theme-color-red);
        transform: translateY(calc(var(--parallel-y) * 2));
    }
`;

const lorem =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil exercitationem, animi fugit vel, ipsa pariatur a omnis voluptatem enim, quibusdam voluptates eaque harum adipisci repudiandae! Incidunt officiis, laborum saepe facilis rem veritatis, impedit optio ut ipsa quo earum aspernatur officia suscipit explicabo consectetur voluptate similique error, aperiam consequuntur eum iste perferendis delectus ratione? Eius laborum reiciendis autem veritatis voluptas vitae magnam unde, quia consequuntur cupiditate aperiam eos fugiat atque quis ab dolores quas! Reprehenderit porro alias, est sapiente sit vel voluptatibus atque quod laborum sequi, deleniti consequuntur quasi eum iusto nesciunt tempore! Ea sunt corporis aliquid, cum ducimus alias dolores?';

const handleParallel = () => {
    document.querySelectorAll('.parallel-item').forEach((el) => {
        const position =
            el.parentElement.offsetTop - window.scrollY - window.innerHeight;
        (el as HTMLElement).style.setProperty(
            '--parallel-y',
            position * 0.1 + 'px',
        );
    });
};

const Page = () => {
    useEffect(() => {
        handleParallel();
        window.addEventListener('scroll', handleParallel);
        return () => window.removeEventListener('scroll', handleParallel);
    }, []);

    return (
        <Container>
            <h1>Parallel effect</h1>
            <section>
                <div className="rect rect-1 parallel-item" />
                <div className="rect rect-2 parallel-item" />
                <h2>Section</h2>
                <p>{lorem}</p>
                <p>{lorem}</p>
            </section>
            <section>
                <div className="rect rect-1 parallel-item" />
                <h2>Section</h2>
                <p>{lorem}</p>
                <p>{lorem}</p>
            </section>
            <section>
                <div className="rect rect-1 parallel-item" />
                <h2>Section</h2>
                <p>{lorem}</p>
                <p>{lorem}</p>
            </section>
            <section>
                <div className="rect rect-1 parallel-item" />
                <h2>Section</h2>
                <p>{lorem}</p>
                <p>{lorem}</p>
            </section>
        </Container>
    );
};

export default Page;
