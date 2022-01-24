import React, { useState } from 'react';
import styled from 'styled-components';
import { SECTION_ITEMS, TabBarItems } from './data';
import TabBar from './components/TabBar';

const Container = styled.div`
    position: relative;
    margin: 20px 0;
`;

const Section = styled.div`
    margin: 30px 0;
`;

const Content = () => {
    const [tabBarIdx, setTabBarIdx] = useState(0);

    return (
        <Container>
            <TabBar
                items={TabBarItems}
                activeIdx={tabBarIdx}
                onClickItem={(_, idx) => setTabBarIdx(idx)}
            />
            <Section>{SECTION_ITEMS[tabBarIdx]}</Section>
        </Container>
    );
};

export default Content;
