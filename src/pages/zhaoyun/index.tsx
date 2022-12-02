import Layout from '@theme/Layout';
import styled from 'styled-components';
import { MATCHES } from '@site/src/zhaoyun/matches/Matches';
import RankList from '@site/src/zhaoyun/components/RankList';
import DayInfo from '@site/src/zhaoyun/components/DayInfo';
import BanPick from '@site/src/zhaoyun/components/BanPick';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import LeftArrow from '@site/static/svg/left-arrow.svg';
import RightArrow from '@site/static/svg/right-arrow.svg';
import LeaderRank from '@site/src/zhaoyun/components/LeaderRank';

const Container = styled.div`
    margin: 0 auto;
    padding: 5vh 0;
    width: 90vw;
    max-width: 1200px;

    @media (pointer: coarse) {
        .day-bar {
            padding: 0 !important;

            > svg {
                display: none !important;
            }
        }
    }
`;

const DayBar = styled.div`
    position: relative;
    margin-bottom: 12px;

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

    user-select: none;
`;

const DaySelect = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    overflow: auto;

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

    &::-webkit-scrollbar {
        display: none;
    }

    scrollbar-width: none;
`;

export default function Home(): JSX.Element {
    const [dayIdx, setDayIdx] = useState(0);
    const scrollBar = useRef<HTMLDivElement>();

    useEffect(() => {
        const bar = scrollBar.current;
        if (bar.scrollWidth > bar.clientWidth) {
            (
                document.querySelector('.left-arrow') as HTMLElement
            ).style.display = 'initial';
            (
                document.querySelector('.right-arrow') as HTMLElement
            ).style.display = 'initial';
            (document.querySelector('.day-bar') as HTMLElement).style.padding =
                '0 45px';
        }
    }, []);

    return (
        <Layout title="赵云杯">
            <Container>
                <h1>赵云杯</h1>
                <h2>收米榜</h2>
                <RankList />
                <ul>
                    <li>
                        <strong>积分</strong> - 暂定为胜局与败局之差；
                        <strong>净胜分</strong> - 地图的胜负局数差。
                    </li>
                    <li>应本人要求，已将 MinSea（“最小的海”）从榜中移除。</li>
                    <li>排名仅作参考。</li>
                </ul>
                <h2>英雄 Ban 率</h2>
                <BanPick />
                <h2>队长胜率</h2>
                <LeaderRank />
                <h2>近期比赛</h2>
                <DayBar className="day-bar">
                    <LeftArrow
                        className="left-arrow"
                        onClick={() => {
                            scrollBar.current.scrollBy({
                                top: 0,
                                left: -300,
                                behavior: 'smooth',
                            });
                        }}
                    />
                    <DaySelect ref={scrollBar}>
                        {MATCHES.map((day, idx) => (
                            <div
                                key={day.date}
                                className={clsx(idx === dayIdx && 'active')}
                                onClick={() => setDayIdx(idx)}
                            >
                                {day.date}
                            </div>
                        ))}
                    </DaySelect>
                    <RightArrow
                        className="right-arrow"
                        onClick={() => {
                            scrollBar.current.scrollBy({
                                top: 0,
                                left: 300,
                                behavior: 'smooth',
                            });
                        }}
                    />
                </DayBar>
                <DayInfo key={MATCHES[dayIdx].date} day={MATCHES[dayIdx]} />
            </Container>
        </Layout>
    );
}
