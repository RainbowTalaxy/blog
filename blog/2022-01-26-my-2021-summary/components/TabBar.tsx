import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
    items: ReactNode[];
    gap?: number;
    activeIdx?: number;
    onClickItem: (item: ReactNode, idx: number) => void;
}

const Container = styled.div`
    position: sticky;
    top: 60px;
    display: flex;
    align-items: center;
    padding: 10px 0 10px 46px;
    width: calc(100% + 32px);
    transform: translateX(-16px);
    background: var(--theme-page-background);
    overflow: scroll;
    z-index: 50;

    ::after {
        flex-shrink: 0;
        width: ${(props: { gap: number }) => props.gap}px;
        height: 1px;
        content: '';
    }

    /* 隐藏滚动条 */
    scrollbar-width: none;
    ::-webkit-scrollbar {
        display: none;
    }

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
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 20px;
    border-radius: 20px;
    border: 1px solid
        var(
            ${(props: TabBarItemsProps) => (props.isActive ? '--theme-color' : '--theme-secondary')}
        );
    background: var(--theme-white-half);
    color: var(
        ${(props: TabBarItemsProps) => (props.isActive ? '--theme-color' : '--theme-primary')}
    );
    font-weight: ${(props: TabBarItemsProps) => (props.isActive ? 'bold' : 'normal')};
`;

const TabBar = ({ items, gap = 16, activeIdx = 0, onClickItem }: Props) => {
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
