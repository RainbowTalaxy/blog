import React, { useState } from 'react';
import styled from 'styled-components';
import { Section, SECTION_ITEMS, TabBarItems } from './constant';
import TabBar from './components/TabBar';

const Container = styled.div`
    position: relative;
`;

const SectionWrapper = styled.div`
    position: relative;
    top: -55px;
`;

function getCoords(elem) {
    // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

const Content = () => {
    const [tabBarIdx, setTabBarIdx] = useState(Section.Activity);

    const handleClickTabBarItem = (idx: number) => {
        setTabBarIdx(idx);
        window.scrollTo({
            top: getCoords(document.getElementById('anchor')).top - 60,
            behavior: 'smooth',
        });
    };

    return (
        <Container id="anchor">
            <TabBar
                items={TabBarItems}
                activeIdx={tabBarIdx}
                onClickItem={(_, idx) => handleClickTabBarItem(idx)}
            />
            <SectionWrapper>{SECTION_ITEMS[tabBarIdx]}</SectionWrapper>
        </Container>
    );
};

export default Content;
