import React, { useState } from 'react';
import styled from 'styled-components';
import { SECTION_ITEMS, TabBarItems } from './data';
import TabBar from './components/TabBar';

const Container = styled.div`
    position: relative;
`;

const Section = styled.div`
    position: relative;
    top: -55px;
`;

const Content = () => {
    const [tabBarIdx, setTabBarIdx] = useState(2);

    const handleClickTabBarItem = (idx: number) => {
        setTabBarIdx(idx);
        document.getElementById('anchor').scrollIntoView({
            behavior: 'smooth',
        });
        window.scrollBy({
            top: -58,
        });
    };

    return (
        <Container id="anchor">
            <TabBar
                items={TabBarItems}
                activeIdx={tabBarIdx}
                onClickItem={(_, idx) => handleClickTabBarItem(idx)}
            />
            <Section>{SECTION_ITEMS[tabBarIdx]}</Section>
        </Container>
    );
};

export default Content;
