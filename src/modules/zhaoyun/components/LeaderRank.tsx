import styled from 'styled-components';
import { useState } from 'react';
import { TEAM_LEADER_RANK } from '../../../constants/zhaoyun/Result';
import { Hero, HERO_DATA } from '../../../constants/zhaoyun/Hero';
import Spacer from '@site/src/components/Spacer';
import { Row } from './BanPick';

const Container = styled.div`
    margin-bottom: 24px;

    .button-bar {
        display: flex;
        align-items: center;
    }

    a:hover {
        cursor: pointer;
    }
`;

const LeaderRank = () => {
    const [fold, setFold] = useState(true);
    const [showNum, setShowNum] = useState(false);

    return (
        <Container>
            {TEAM_LEADER_RANK.slice(0, fold ? 5 : TEAM_LEADER_RANK.length).map(
                ([player, data]) => {
                    const hero = Hero.TBD;
                    const rate = (data.win * 100) / (data.win + data.loss);
                    return (
                        <Row
                            key={player}
                            style={{
                                background: `linear-gradient(${HERO_DATA[hero].color}, ${HERO_DATA[hero].color}) left/${rate}% 100% no-repeat,#e1e7ed`,
                            }}
                        >
                            <div className="hero-label">{player}</div>
                            <Spacer />
                            <div>
                                {showNum
                                    ? `${data.win} 胜 ${data.loss} 负`
                                    : rate.toFixed(0) + '%'}
                            </div>
                        </Row>
                    );
                },
            )}
            <div className="button-bar">
                <a onClick={() => setFold((prev) => !prev)}>
                    {fold ? '展开所有' : '收起'}
                </a>
                <Spacer />
                <a onClick={() => setShowNum((prev) => !prev)}>
                    {showNum ? '显示胜率' : '显示胜负'}
                </a>
            </div>
        </Container>
    );
};

export default LeaderRank;
