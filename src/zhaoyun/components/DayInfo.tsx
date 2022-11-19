import clsx from 'clsx';
import dayjs from 'dayjs';
import { Fragment } from 'react';
import styled from 'styled-components';
import { MATCHES } from '../matches/Matches';

const Container = styled.div``;

const MatchCard = styled.div`
    margin-bottom: 20px;
`;

const TeamCard = styled.div`
    margin-bottom: 15px;
    width: 100%;
    overflow: auto;
`;

const Team = styled.div`
    display: flex;
    align-items: center;

    > * {
        flex-shrink: 0;
    }

    > span {
        display: block;
        padding: 5px;
        width: 60px;
        font-weight: bold;
        text-align: center;
        color: white;
        background-color: rgb(247, 158, 24);
        border-bottom: 1px solid white;
    }

    > div {
        padding: 5px;
        width: 120px;
        text-align: center;
        color: black;
        background-color: rgb(242, 242, 242);
        border-right: 1px solid white;
        border-bottom: 1px solid white;
    }

    .first {
        font-weight: bold;
    }
`;

const RoundCard = styled.div`
    width: 100%;
    overflow: auto;
`;

const Round = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, max-content);
    grid-template-columns: 60px repeat(7, 120px);

    .ban {
        grid-row: 4 / 8;
    }

    .ban-hero {
        padding: 3px;
        font-size: 12px;
        font-weight: bold;
        background-color: rgba(245, 188, 188, 0.5);
    }

    .table-header {
        font-weight: bold;
        color: white;
        background-color: rgb(247, 158, 24);
    }

    > div {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        text-align: center;
        border-bottom: 1px solid white;
        color: black;
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

type DayMatch = typeof MATCHES[number];

interface Props {
    day: DayMatch;
}

const DayInfo = ({ day }: Props) => {
    return (
        <Container>
            <h3>{dayjs(day.date).format('YYYY年MM月DD日')}</h3>
            {day.matchs.map((match, idx) => (
                <MatchCard key={idx}>
                    <h4>第{idx + 1}局</h4>
                    <h5>队伍</h5>
                    <TeamCard>
                        <Team>
                            <span>A</span>
                            {match.teams.A.players.map((player, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(idx === 0 && 'first')}
                                >
                                    {player}
                                </div>
                            ))}
                        </Team>
                        <Team>
                            <span>B</span>
                            {match.teams.B.players.map((player, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(idx === 0 && 'first')}
                                >
                                    {player}
                                </div>
                            ))}
                        </Team>
                    </TeamCard>
                    <h5>对局</h5>
                    <RoundCard>
                        <Round>
                            <div className="table-header">地图</div>
                            <div className="table-header">A</div>
                            <div className="table-header">B</div>
                            <div className="table-header ban">Ban</div>
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
                                    {round.ban.map((hero, idx) => (
                                        <div key={idx} className="ban-hero">
                                            {hero}
                                        </div>
                                    ))}
                                </Fragment>
                            ))}
                        </Round>
                    </RoundCard>
                </MatchCard>
            ))}
        </Container>
    );
};

export default DayInfo;
