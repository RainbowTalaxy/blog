import { Statistics } from '@site/src/api/zhaoyun';
import styles from '../styles/index.module.css';
import API from '@site/src/api';
import Layout from '@theme/Layout';
import { useCallback, useEffect, useState } from 'react';
import MatchDayInfo from '../components/MatchDayInfo';
import { Button } from '@site/src/components/Form';
import useUser from '@site/src/hooks/useUser';
import DayBar from '../components/DayBar';
import MatchForm from '../components/MatchForm';

const Page = () => {
    const [statistics, setStatistics] = useState<Statistics | null>();
    const [selectedMatchDay, setMatchDay] =
        useState<Statistics['matchDays'][number]>();
    const [isEditing, setEditing] = useState(true);

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
                {!isEditing && (
                    <>
                        <h1>赵云杯</h1>
                        <p>
                            统计榜正在开发中。
                            <a target="_blank" href="/zhaoyun/2022">
                                → 第一届赵云杯 ←
                            </a>
                        </p>
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
                <MatchForm />
                {selectedMatchDay && (
                    <>
                        {isEditing ? (
                            <MatchForm matchDayId={selectedMatchDay.id} />
                        ) : (
                            <MatchDayInfo matchDay={selectedMatchDay} />
                        )}
                        {user.id && !isEditing && (
                            <Button type="primary" style={{ marginBottom: 16 }}>
                                编 辑
                            </Button>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Page;
