import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

interface Props {
    items: ReactNode[];
    gap?: number;
    activeIdx?: number;
    onClickItem: (item: ReactNode, idx: number) => void;
}

const Container = styled.div`
    position: sticky;
    top: 70px;
    display: flex;
    align-items: center;
    z-index: 50;

    > div + div {
        margin-left: ${(props: { gap: number }) => props.gap}px;
    }

    > div:hover {
        cursor: pointer;
    }
`;

interface TabBarItemsProps {
    isActive: boolean;
}

const TabBarItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 20px;
    border-radius: 20px;
    border: 1px solid
        var(
            ${(props: TabBarItemsProps) =>
                props.isActive ? '--theme-color' : '--theme-background'}
        );
    background: var(--theme-white-half);
    color: var(
        ${(props: TabBarItemsProps) => (props.isActive ? '--theme-color' : '--theme-primary')}
    );
    font-weight: ${(props: TabBarItemsProps) => (props.isActive ? 'bold' : 'normal')};
`;

const TabBar = ({ items, gap = 20, activeIdx = 0, onClickItem }: Props) => {
    return (
        <Container gap={gap}>
            {items.map((item, idx) => (
                <TabBarItem
                    key={idx}
                    isActive={idx === activeIdx}
                    onClick={() => onClickItem(item, idx)}
                >
                    {item}
                </TabBarItem>
            ))}
        </Container>
    );
};

export default TabBar;
