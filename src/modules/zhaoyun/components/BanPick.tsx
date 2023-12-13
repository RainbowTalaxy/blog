import Spacer from '@site/src/components/Spacer';
import { useState } from 'react';
import styled from 'styled-components';
import { Statistics } from '@site/src/api/zhaoyun';
import { calcBanRank } from '../constants/calc';
import { HERO_DATA, HeroName } from '@site/src/constants/zhaoyun/Hero';

const Container = styled.div`
    margin-bottom: 24px;

    a:hover {
        cursor: pointer;
    }
`;

export const Row = styled.div`
    display: flex;
    margin-bottom: 7px;
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: bold;
    color: black;
    transition: all 0.05s;

    @media (pointer: fine) {
        &:hover {
            transform: scale(1.02);
            z-index: 10;
            filter: brightness(1.02);
        }
    }
`;

interface Props {
    statistics: Statistics;
}

const BanPick = ({ statistics }: Props) => {
    const [fold, setFold] = useState(true);

    const banPick = calcBanRank(statistics);

    return (
        <Container>
            {banPick.list.slice(0, fold ? 7 : banPick.list.length).map(([hero, data]) => (
                <Row
                    key={hero}
                    style={{
                        background: `linear-gradient(${HERO_DATA[HeroName[hero]].color}, ${
                            HERO_DATA[HeroName[hero]].color
                        }) left/${(data.times * 100) / banPick.highest}% 100% no-repeat,#e1e7ed`,
                    }}
                >
                    <div className="hero-label">{HeroName[hero]}</div>
                    <Spacer />
                    <div>{data.times} 次</div>
                </Row>
            ))}
            <a onClick={() => setFold((prev) => !prev)}>{fold ? '展开所有' : '收起'}</a>
        </Container>
    );
};

export default BanPick;
