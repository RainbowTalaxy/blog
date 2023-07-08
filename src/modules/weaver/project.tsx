import { CycleInfo, ProjectInfo } from '@site/src/api/weaver';
import styles from './project.module.css';
import commonStyles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import API from '@site/src/api';
import ContentWithSidebar from '@site/src/components/ContentWithSidebar';
import useQuery from '@site/src/hooks/useQuery';
import dayjs from 'dayjs';
import { isBetween } from '@site/src/utils';
import clsx from 'clsx';
import { useHistory } from '@docusaurus/router';
import GlobalStyle from './components/GlobalStyle';
import CycleDetailView from './components/CycleDetailView';
import { TASK_POOL_NAME } from './constants';

interface Props {
    project: ProjectInfo;
}

const POOL_CYCLE: CycleInfo = {
    id: TASK_POOL_NAME,
    idx: -1,
    start: 0,
    end: 0,
};

const ProjectView = ({ project }: Props) => {
    const query = useQuery();
    const history = useHistory();
    const [cycles, setCycles] = useState<CycleInfo[]>();
    const [targetCycle, setCycle] = useState<CycleInfo>();

    const cycleId = query.get('cycle');

    const refetchCycle = useCallback(async () => {
        if (!project.id) return;
        try {
            const cycles = await API.weaver.cycles(project.id);
            setCycles(cycles);
        } catch (error) {
            console.log(error);
        }
    }, [project]);

    const handleAddCycle = useCallback(async () => {
        const asked = confirm('确定新建周期吗？');
        if (!asked) return;
        if (!project.id) return alert('用户 ID 或项目 ID 不得为空');
        try {
            await API.weaver.addCycle(project.id);
            refetchCycle();
        } catch (error) {
            console.log(error);
        }
    }, [project]);

    useEffect(() => {
        refetchCycle();
    }, [project]);

    useEffect(() => {
        if (!cycles) return;
        if (cycleId === TASK_POOL_NAME) return setCycle(POOL_CYCLE);
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
                    <div className={styles.header} onClick={() => history.push('?')}>
                        Weaver
                    </div>
                }
                sidebar={
                    <>
                        <span>{project.name}</span>
                        <div
                            className={clsx(
                                styles.cycleOption,
                                commonStyles.itemCard,
                                cycleId === TASK_POOL_NAME && commonStyles.active,
                            )}
                            onClick={() => {
                                if (project.id) history.replace(`?project=${project.id}&cycle=${TASK_POOL_NAME}`);
                            }}
                        >
                            任务池
                        </div>
                        <div className={clsx(styles.cycleOption, commonStyles.itemCard)} onClick={handleAddCycle}>
                            + 新建周期
                        </div>
                        {cycles?.map((cycle) => (
                            <div
                                key={cycle.id}
                                className={clsx(
                                    styles.cycle,
                                    commonStyles.itemCard,
                                    cycle.id === targetCycle?.id && commonStyles.active,
                                )}
                                onClick={() => {
                                    if (project.id && cycle.id)
                                        history.replace(`?project=${project.id}&cycle=${cycle.id}`);
                                }}
                            >
                                <div className={styles.cycleName}>第 {cycle.idx + 1} 周</div>
                                <div className={styles.cycleDate}>
                                    {dayjs(cycle.start).format('YYYY年M月D日')} -{' '}
                                    {dayjs(cycle.end).add(-1, 'day').format('YYYY年M月D日')}
                                </div>
                            </div>
                        ))}
                    </>
                }
            >
                {targetCycle && (
                    <CycleDetailView
                        project={project}
                        cycleInfo={targetCycle}
                        cycles={cycles}
                        addCycle={handleAddCycle}
                    />
                )}
            </ContentWithSidebar>
        </>
    );
};

export default ProjectView;
