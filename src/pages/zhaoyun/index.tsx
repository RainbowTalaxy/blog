import Layout from '@theme/Layout';
import styled from 'styled-components';
import { MATCHES } from '@site/src/zhaoyun/matches/Matches';
import RankList from '@site/src/zhaoyun/components/RankList';
import DayInfo from '@site/src/zhaoyun/components/DayInfo';
import BanPick from '@site/src/zhaoyun/components/BanPick';

const Container = styled.div`
    margin: 0 auto;
    padding: 5vh 0;
    width: 90vw;
    max-width: 1200px;
`;

export default function Home(): JSX.Element {
    return (
        <Layout title="赵云杯">
            <Container>
                <h1>赵云杯</h1>
                <h2>收米榜</h2>
                <RankList />
                <ul>
                    <li>
                        <strong>积分</strong> - 暂定为胜局与败局之差。
                    </li>
                    <li>
                        <strong>净胜分</strong> - 地图的胜负局数差。
                    </li>
                    <li>排名并非完全正确，仅作参考。</li>
                </ul>
                <h2>英雄 Ban 率</h2>
                <BanPick />
                <h2>近期比赛</h2>
                {MATCHES.map((day) => (
                    <DayInfo key={day.date} day={day} />
                ))}
            </Container>
        </Layout>
    );
}
