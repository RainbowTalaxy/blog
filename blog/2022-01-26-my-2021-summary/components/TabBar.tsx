import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

interface Props {
    items: ReactNode[];
    width?: number;
    gap?: number;
    activeIdx?: number;
    onClickItem: (item: ReactNode, idx: number) => void;
}

const Container = styled.div`
    display: flex;
    align-items: center;

    > div + div {
        margin-left: ${(props: { gap: number }) => props.gap}px;
    }

    > div:hover {
        cursor: pointer;
    }
`;

interface TabBarItemsProps {
    width: number;
    isActive: boolean;
}

const TabBarItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 20px;
    width: ${(props: TabBarItemsProps) => props.width}px;
    border-radius: 20px;
    border: 1px solid
        var(
            ${(props: TabBarItemsProps) =>
                props.isActive ? '--theme-color' : '--theme-background'}
        );
    background: var(--theme-background);
    color: var(
        ${(props: TabBarItemsProps) => (props.isActive ? '--theme-color' : '--theme-primary')}
    );
    font-weight: ${(props: TabBarItemsProps) => (props.isActive ? 'bold' : 'normal')};
`;

const TabBar = ({ items, width = 120, gap = 20, activeIdx = 0, onClickItem }: Props) => {
    return (
        <Container gap={gap}>
            {items.map((item, idx) => (
                <TabBarItem
                    key={idx}
                    width={width}
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
