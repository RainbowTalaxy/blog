import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Section, SECTION_ITEMS, TabBarItems } from '../constant';
import TabBar from '../components/TabBar';
import { getCoordinates } from '@site/src/utils';
import smoothscroll from 'smoothscroll-polyfill';

const Container = styled.div`
    position: relative;
`;

const SectionWrapper = styled.div`
    position: relative;
    top: -55px;
`;

const Content = () => {
    const [tabBarIdx, setTabBarIdx] = useState(Section.Activity);

    const handleClickTabBarItem = (idx: number) => {
        setTabBarIdx(idx);
        window.scrollTo({
            top: getCoordinates(document.getElementById('anchor')).top - 60,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        smoothscroll.polyfill();
    }, []);

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
