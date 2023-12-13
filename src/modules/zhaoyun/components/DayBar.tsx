import styled, { createGlobalStyle } from 'styled-components';
import LeftArrow from '@site/static/svg/left-arrow.svg';
import RightArrow from '@site/static/svg/right-arrow.svg';
import { useEffect, useRef } from 'react';
import { Statistics } from '@site/src/api/zhaoyun';
import clsx from 'clsx';
import dayjs from 'dayjs';

const GlobalStyle = createGlobalStyle`
    @media (pointer: coarse) {
        .day-bar {
            padding: 0 !important;

            > svg {
                display: none !important;
            }
        }
    }
`;

const Container = styled.div`
    position: relative;
    margin-bottom: 12px;
    user-select: none;

    > svg {
        position: absolute;
        top: 50%;
        width: 30px;
        height: 30px;
        padding: 7px;
        border-radius: 50%;
        background-color: #9f9f9f;
        display: none;
        cursor: pointer;
        z-index: 100;
        transform: translateY(-50%);
    }

    > svg:first-of-type {
        left: 0;
    }

    > svg:last-of-type {
        right: 0;
    }
`;

const DaySelect = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    overflow: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    > div {
        font-size: 20px;
        cursor: pointer;
        font-weight: bold;
        color: #9f9f9f;
    }

    .active {
        color: initial;
    }

    > div + div {
        margin-left: 32px;
    }
`;

interface Props {
    statistics: Statistics;
    selectedMatchDay?: Statistics['matchDays'][number];
    onSelect: (matchDay: Statistics['matchDays'][number]) => void;
}

const DayBar = ({ statistics, selectedMatchDay, onSelect }: Props) => {
    const scrollBar = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bar = scrollBar.current;
        if (bar && bar.scrollWidth > bar.clientWidth) {
            (document.querySelector('.left-arrow') as HTMLElement).style.display = 'initial';
            (document.querySelector('.right-arrow') as HTMLElement).style.display = 'initial';
            (document.querySelector(`.day-bar`) as HTMLElement).style.padding = '0 45px';
        }
    }, [statistics]);

    return (
        <>
            <GlobalStyle />
            <Container className="day-bar">
                <LeftArrow
                    className="left-arrow"
                    onClick={() => {
                        scrollBar.current?.scrollBy({
                            top: 0,
                            left: -300,
                            behavior: 'smooth',
                        });
                    }}
                />
                <DaySelect ref={scrollBar}>
                    {statistics?.matchDays
                        .sort((a, b) => b.date - a.date)
                        .map((matchDay) => (
                            <div
                                key={matchDay.id}
                                className={clsx(selectedMatchDay?.id === matchDay.id && 'active')}
                                onClick={() => onSelect(matchDay)}
                            >
                                {dayjs(matchDay.date).format('YYYY/MM/DD')}
                            </div>
                        ))}
                </DaySelect>
                <RightArrow
                    className="right-arrow"
                    onClick={() => {
                        scrollBar.current?.scrollBy({
                            top: 0,
                            left: 300,
                            behavior: 'smooth',
                        });
                    }}
                />
            </Container>
        </>
    );
};

export default DayBar;
