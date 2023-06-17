import { CycleInfo, ProjectInfo } from '@site/src/api/weaver';
import styles from './project.module.css';
import { useCallback, useEffect, useState } from 'react';
import API from '@site/src/api';
import { UserInfo } from '@site/src/constants/user';
import ContentWithSidebar from '@site/src/components/ContentWithSidebar';
import useQuery from '@site/src/hooks/useQuery';
import dayjs from 'dayjs';
import { isBetween } from '@site/src/utils';
import clsx from 'clsx';
import { useHistory } from '@docusaurus/router';
import GlobalStyle from './components/GlobalStyle';
import CycleDetailView from './components/CycleDetailView';

interface Props {
    project: ProjectInfo;
    user: UserInfo;
}

const ProjectView = ({ project, user }: Props) => {
    const query = useQuery();
    const history = useHistory();
    const [cycles, setCycles] = useState<CycleInfo[]>();
    const [targetCycle, setCycle] = useState<CycleInfo>();

    const cycleId = query.get('cycle');

    const refetchCycle = useCallback(async () => {
        if (!project.id || !user.id) return;
        try {
            const cycles = await API.weaver.cycles(user.id, project.id);
            setCycles(cycles);
        } catch (error) {
            console.log(error);
        }
    }, [project, user]);

    useEffect(() => {
        refetchCycle();
    }, [project, user]);

    useEffect(() => {
        if (!cycles) return;
        const cycle = cycles?.find((cycle) => cycle.id === cycleId);
        if (cycle) {
            setCycle(cycle);
        } else {
            const currentCycle = cycles.find((cycle) => {
                return isBetween(cycle.start, cycle.end);
            });
            if (currentCycle) {
                setCycle(currentCycle);
            }
        }
    }, [cycleId, cycles]);

    return (
        <>
            <GlobalStyle />
            <ContentWithSidebar
                title={
                    <div
                        className={styles.header}
                        onClick={() => history.push('?')}
                    >
                        Weaver
                    </div>
                }
                sidebar={
                    <>
                        <span>{project.name}</span>
                        <div
                            className={styles.cycleNew}
                            onClick={async () => {
                                if (!project.id || !user.id) return;
                                try {
                                    await API.weaver.addCycle(
                                        user.id,
                                        project.id,
                                    );
                                    refetchCycle();
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        >
                            + 新建周期
                        </div>
                        {cycles?.map((cycle) => (
                            <div
                                key={cycle.id}
                                className={clsx(
                                    styles.cycle,
                                    cycle.id === targetCycle?.id &&
                                        styles.active,
                                )}
                                onClick={() => {
                                    if (user.id && project.id && cycle.id)
                                        history.push(
                                            `?project=${project.id}&cycle=${cycle.id}`,
                                        );
                                }}
                            >
                                <div className={styles.cycleName}>
                                    第 {cycle.idx + 1} 周
                                </div>
                                <div className={styles.cycleDate}>
                                    {dayjs(cycle.start).format('YYYY年M月D日')}{' '}
                                    -{' '}
                                    {dayjs(cycle.end)
                                        .add(-1, 'day')
                                        .format('YYYY年M月D日')}
                                </div>
                            </div>
                        ))}
                    </>
                }
            >
                {targetCycle && (
                    <CycleDetailView
                        user={user}
                        project={project}
                        cycleInfo={targetCycle}
                        cycles={cycles}
                    />
                )}
            </ContentWithSidebar>
        </>
    );
};

export default ProjectView;
