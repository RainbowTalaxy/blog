import { Statistics } from '@site/src/api/zhaoyun';
import styles from '../styles/index.module.css';
import API from '@site/src/api';
import Layout from '@theme/Layout';
import { useCallback, useEffect, useState } from 'react';
import MatchDayInfo from '../components/MatchDayInfo';
import { Button, ButtonGroup } from '@site/src/components/Form';
import useUser from '@site/src/hooks/useUser';
import DayBar from '../components/DayBar';
import MatchForm from '../components/MatchForm';
import useQuery from '@site/src/hooks/useQuery';
import { useHistory } from '@docusaurus/router';
import BanPick from '../components/BanPick';

const Page = () => {
    const history = useHistory();
    const query = useQuery();
    const editId = query.get('edit');
    const [statistics, setStatistics] = useState<Statistics | null>();
    const [selectedMatchDay, setMatchDay] = useState<Statistics['matchDays'][number]>();

    const user = useUser();

    const refetch = useCallback(async () => {
        try {
            const statistics = await API.zhaoyun.statistics();
            setStatistics(statistics);
            if (statistics.matchDays.length === 0) return;
            setMatchDay(statistics.matchDays[0]);
        } catch {
            setStatistics(null);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <Layout title="赵云杯">
            <div className={styles.page}>
                {editId === 'new' ? (
                    <MatchForm />
                ) : (
                    <>
                        {!editId && (
                            <>
                                <h1>赵云杯</h1>
                                <p>
                                    统计榜正在开发中。
                                    <a target="_blank" href="/zhaoyun/2022">
                                        → 第一届赵云杯 ←
                                    </a>
                                </p>
                                {statistics && (
                                    <>
                                        <h2>英雄 Ban 率</h2>
                                        <BanPick statistics={statistics} />
                                    </>
                                )}
                                {user.id && (
                                    <Button
                                        style={{ marginBottom: 24 }}
                                        onClick={() => {
                                            history.push('?edit=new');
                                        }}
                                    >
                                        新建比赛
                                    </Button>
                                )}
                                <h2>近期比赛</h2>
                                {statistics && (
                                    <DayBar
                                        statistics={statistics}
                                        selectedMatchDay={selectedMatchDay}
                                        onSelect={setMatchDay}
                                    />
                                )}
                            </>
                        )}
                        {selectedMatchDay && (
                            <>
                                {editId ? (
                                    <MatchForm matchDayId={selectedMatchDay.id} />
                                ) : (
                                    <MatchDayInfo matchDay={selectedMatchDay} />
                                )}
                                {user.id && !editId && (
                                    <ButtonGroup>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                history.push(`?edit=${selectedMatchDay.id}`);
                                            }}
                                        >
                                            编 辑
                                        </Button>
                                        <Button
                                            type="danger"
                                            onClick={async () => {
                                                const granted = confirm('确认删除？');
                                                if (!granted) return;
                                                await API.zhaoyun.deleteMatchDay(selectedMatchDay.id);
                                                refetch();
                                            }}
                                        >
                                            删 除
                                        </Button>
                                    </ButtonGroup>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Page;
