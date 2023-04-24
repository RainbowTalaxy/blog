import Spacer from '@site/src/components/Spacer';
import { useState } from 'react';
import styled from 'styled-components';
import { HERO_DATA } from '../Hero';
import { BAN_PICK } from '../Result';

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

const BanPick = () => {
    const [fold, setFold] = useState(true);

    return (
        <Container>
            {BAN_PICK.list
                .slice(0, fold ? 7 : BAN_PICK.list.length)
                .map(([hero, data]) => (
                    <Row
                        key={hero}
                        style={{
                            background: `linear-gradient(${
                                HERO_DATA[hero].color
                            }, ${HERO_DATA[hero].color}) left/${
                                (data.times * 100) / BAN_PICK.highest
                            }% 100% no-repeat,#e1e7ed`,
                        }}
                    >
                        <div className="hero-label">{hero}</div>
                        <Spacer />
                        <div>{data.times} 次</div>
                    </Row>
                ))}
            <a onClick={() => setFold((prev) => !prev)}>
                {fold ? '展开所有' : '收起'}
            </a>
        </Container>
    );
};

export default BanPick;
