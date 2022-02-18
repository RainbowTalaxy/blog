import React, { useEffect } from 'react';
import styled from 'styled-components';

interface Props {}

const Container = styled.div`
    min-height: 200vh;

    > div {
        padding: 20px 30px;
        background: var(--theme-color);
    }
`;

const Sticky = styled.div`
    position: sticky;
    top: 0;
    z-index: 3000;
`;

const Fixed = styled.div`
    position: fixed;
    bottom: 0;
    z-index: 3000;
`;

const Absolute = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
`;

const Lorem = () => {
    return (
        <p style={{ padding: '0 20px' }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus,
            quisquam quia aperiam minima sequi voluptatem nobis mollitia
            deserunt quis voluptatibus minus, facilis commodi similique
            officiis, architecto magni dignissimos iste molestiae!
        </p>
    );
};

const View = ({}: Props) => {
    const stickyId = 'sticky-element';

    return (
        <Container>
            <p></p>
            <Lorem />
            <Sticky id={stickyId}>Sticky 元素（ top: 0 ）</Sticky>
            <p></p>
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Lorem />
            <Fixed>Fixed 元素</Fixed>
            <Absolute>Absolute 元素</Absolute>
        </Container>
    );
};

export default View;
