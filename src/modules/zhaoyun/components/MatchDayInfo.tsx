import clsx from 'clsx';
import { Fragment } from 'react';
import styled from 'styled-components';
import { Statistics } from '@site/src/api/zhaoyun';
import { Player } from '@site/src/constants/zhaoyun/Player';
import { GameMapName } from '@site/src/constants/zhaoyun/Map';
import { MatchModeName } from '../constants';

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
    grid-template-rows: repeat(3, max-content);
    grid-template-columns: 60px repeat(7, 120px);

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

interface Props {
    matchDay: Statistics['matchDays'][number];
}

const MatchDayInfo = ({ matchDay: day }: Props) => {
    return (
        <Container>
            {day.matches.map((match, idx) => (
                <MatchCard key={idx}>
                    <h4>
                        第{idx + 1}场：{MatchModeName[match.mode]}
                    </h4>
                    <h5>队伍</h5>
                    <TeamCard>
                        <Team>
                            <span>A</span>
                            {match.teamA.players.map((player, idx) => (
                                <div key={idx} className={clsx(idx === 0 && 'first')}>
                                    {Player[player]}
                                </div>
                            ))}
                        </Team>
                        <Team>
                            <span>B</span>
                            {match.teamB.players.map((player, idx) => (
                                <div key={idx} className={clsx(idx === 0 && 'first')}>
                                    {Player[player]}
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
                            {match.rounds.map((round, idx) => (
                                <Fragment key={idx}>
                                    <div className="map">{GameMapName[round.map]}</div>
                                    <div className={clsx(round.scoreA > round.scoreB && 'hint')}>{round.scoreA}</div>
                                    <div className={clsx(round.scoreB > round.scoreA && 'hint')}>{round.scoreB}</div>
                                </Fragment>
                            ))}
                        </Round>
                    </RoundCard>
                </MatchCard>
            ))}
        </Container>
    );
};

export default MatchDayInfo;
