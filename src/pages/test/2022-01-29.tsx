import React, { useEffect } from 'react';
import styled from 'styled-components';

interface Props {}

const Container = styled.div`
    min-height: 160vh;

    > div {
        padding: 20px 30px;
        background: var(--theme-color);
    }
`;

const Sticky = styled.div`
    position: sticky;
    top: 0;
`;

const Fixed = styled.div`
    position: fixed;
    bottom: 0;
`;

const Absolute = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
`;

const Lorem = () => {
    return (
        <p style={{ padding: '0 20px' }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, quisquam quia aperiam
            minima sequi voluptatem nobis mollitia deserunt quis voluptatibus minus, facilis commodi
            similique officiis, architecto magni dignissimos iste molestiae!
        </p>
    );
};

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            },
        }),
    );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll(element) {
    element.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    element.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    element.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    element.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

const View = ({}: Props) => {
    const stickyId = 'sticky-element';

    useEffect(() => {
        disableScroll(document.getElementById(stickyId));
    }, []);

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
            <Fixed>Fixed 元素</Fixed>
            <Absolute>Absolute 元素</Absolute>
        </Container>
    );
};

export default View;
