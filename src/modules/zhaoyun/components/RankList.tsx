import clsx from 'clsx';
import { Fragment } from 'react';
import styled from 'styled-components';
import { RANK } from '../Result';

const Table = styled.div`
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 1fr;

    > div {
        padding: 5px;
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid #e3e3e3;
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

const RankList = () => {
    return (
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
                        <div>{data.rank}</div>
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
    );
};

export default RankList;
