import { Fragment, useEffect } from 'react';
import BlogLayout from '@theme/BlogLayout';
import style from './index.module.css';
import { RANK } from '@site/src/constants/zhaoyun/Result';
import styled from 'styled-components';
import clsx from 'clsx';
import { Match } from '@site/src/constants/zhaoyun/Matchs';
import dayjs from 'dayjs';

const Table = styled.div`
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 1fr;

    > div {
        padding: 5px;
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid gray;
    }

    .table-header {
        font-size: 20px;
        color: white;
        background-color: rgb(247, 158, 24);
    }

    .red {
        color: rgb(229, 14, 71);
    }

    .green {
        color: rgb(0, 189, 0);
    }
`;

const DayCard = styled.div``;

const MatchCard = styled.div`
    margin-bottom: 20px;
`;

const Team = styled.div`
    display: flex;
    align-items: center;
    margin: 1px 0;

    > span {
        display: block;
        padding: 5px;
        width: 60px;
        text-align: center;
        font-weight: bold;
        color: white;
        background-color: rgb(247, 158, 24);
    }

    > div {
        flex: 1;
        padding: 5px;
        font-weight: bold;
        text-align: center;
        background-color: rgb(242, 242, 242);
        border-right: 1px solid white;
    }
`;

const Round = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(3, max-content);
    grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
    margin: 10px 0;

    .table-header {
        font-weight: bold;
        color: white;
        background-color: rgb(247, 158, 24);
    }

    > div {
        padding: 5px;
        text-align: center;
        border-bottom: 1px solid white;
        background-color: rgb(242, 242, 242);
        border-right: 1px solid white;
    }

    .hint {
        font-weight: bold;
        background-color: rgb(232, 232, 232);
    }

    .map {
        font-weight: bold;
    }
`;

export default function Home(): JSX.Element {
    return (
        <BlogLayout title="赵云杯">
            <h1>赵云杯</h1>
            <h2>收米榜</h2>
            <Table>
                <div className="table-header">排名</div>
                <div className="table-header">选手</div>
                <div className="table-header">积分</div>
                <div className="table-header">胜</div>
                <div className="table-header">负</div>
                <div className="table-header">场次</div>
                <div className="table-header">净胜分</div>
                {RANK.map(([player, data], idx) => {
                    return (
                        <Fragment key={player}>
                            <div>{idx + 1}</div>
                            <div>{player}</div>
                            <div>{data.score}</div>
                            <div>{data.win}</div>
                            <div>{data.loss}</div>
                            <div>{data.matchTotal}</div>
                            <div
                                className={clsx(
                                    data.mapScore > 0 && 'green',
                                    data.mapScore < 0 && 'red',
                                )}
                            >
                                {data.mapScore > 0 && '+'}
                                {data.mapScore}
                            </div>
                        </Fragment>
                    );
                })}
            </Table>
            <ul>
                <li>
                    <strong>积分</strong> - 暂定为胜局与败局之差。
                </li>
                <li>
                    <strong>净胜分</strong> - 地图的胜负局数差。
                </li>
            </ul>
            <h2>近期比赛</h2>
            {Match.map((day) => (
                <DayCard key={day.date}>
                    <h3>{dayjs(day.date).format('YYYY年MM月DD日')}</h3>
                    {day.matchs.map((match, idx) => (
                        <MatchCard key={idx}>
                            <h4>第{idx + 1}局</h4>
                            <h5>队伍</h5>
                            <Team>
                                <span>A</span>
                                {match.teams.A.players.map((player) => (
                                    <div>{player}</div>
                                ))}
                            </Team>
                            <Team>
                                <span>B</span>
                                {match.teams.B.players.map((player) => (
                                    <div>{player}</div>
                                ))}
                            </Team>
                            <div style={{ height: 15 }} />
                            <h5>对局</h5>
                            <Round>
                                <div className="table-header">地图</div>
                                <div className="table-header">A</div>
                                <div className="table-header">B</div>
                                {match.rounds.map((round, idx) => (
                                    <Fragment key={idx}>
                                        <div className="map">{round.map}</div>
                                        <div
                                            className={clsx(
                                                round.A > round.B && 'hint',
                                            )}
                                        >
                                            {round.A}
                                        </div>
                                        <div
                                            className={clsx(
                                                round.B > round.A && 'hint',
                                            )}
                                        >
                                            {round.B}
                                        </div>
                                    </Fragment>
                                ))}
                            </Round>
                        </MatchCard>
                    ))}
                </DayCard>
            ))}
        </BlogLayout>
    );
}
