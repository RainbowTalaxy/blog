import styles from './styles/project.module.css';
import commonStyles from './styles/index.module.css';
import { CycleInfo, ProjectInfo } from '@site/src/api/weaver';
import { useCallback, useEffect, useState } from 'react';
import API from '@site/src/api';
import ContentWithSidebar from '@site/src/components/ContentWithSidebar';
import useQuery from '@site/src/hooks/useQuery';
import dayjs from 'dayjs';
import { isBetween, queryString } from '@site/src/utils';
import clsx from 'clsx';
import { useHistory } from '@docusaurus/router';
import GlobalStyle from './styles/GlobalStyle';
import CycleDetailView from './components/CycleDetailView';
import { TASK_POOL_NAME } from './constants';
import useTitle from '@site/src/hooks/useTitle';
import ProjectForm from './components/ProjectForm';

const POOL_CYCLE: CycleInfo = {
    id: TASK_POOL_NAME,
    idx: -1,
    start: 0,
    end: 0,
};

interface Props {
    project: ProjectInfo;
    refetch: () => Promise<void>;
}

const CYCLE_FOLD_THRESHOLD = 5;

const ProjectView = ({ project, refetch }: Props) => {
    const query = useQuery();
    const history = useHistory();
    const [cycles, setCycles] = useState<CycleInfo[]>();
    const [targetCycle, setCycle] = useState<CycleInfo>();
    const [isCycleListFolded, setCycleListFolded] = useState(true);
    const [isFormVisible, setFormVisible] = useState(false);

    const cycleId = query.get('cycle');
    // 当前正在进行中的周期
    const ongoingCycle = cycles?.find((cycle) => isBetween(cycle.start, cycle.end));
    const foldedCycles = isCycleListFolded ? cycles?.slice(0, CYCLE_FOLD_THRESHOLD) : cycles;

    useTitle('Weaver', '/weaver');

    const refetchCycle = useCallback(async () => {
        if (!project.id) return;
        try {
            const cycles = await API.weaver.cycles(project.id);
            if (cycles.length <= CYCLE_FOLD_THRESHOLD) setCycleListFolded(false);
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
            // 如果当前没有进行中的周期，则指向任务池
            setCycle(ongoingCycle ?? POOL_CYCLE);
        }
    }, [cycleId, cycles, ongoingCycle]);

    return (
        <>
            <GlobalStyle />
            <ContentWithSidebar
                title={
                    <div className={styles.titleBar}>
                        <span className={styles.title} onClick={() => setFormVisible(true)}>
                            {project.name}
                        </span>
                        <span className={styles.addCycle} onClick={handleAddCycle}>
                            新建周期
                        </span>
                    </div>
                }
                sidebar={
                    <>
                        <div
                            className={clsx(
                                styles.cycleOption,
                                commonStyles.itemCard,
                                cycleId === TASK_POOL_NAME && commonStyles.active,
                            )}
                            onClick={() => {
                                if (project.id)
                                    history.replace(
                                        queryString({
                                            project: project.id,
                                            cycle: TASK_POOL_NAME,
                                        }),
                                    );
                            }}
                        >
                            任务池
                        </div>
                        {foldedCycles?.map((cycle) => (
                            <div
                                key={cycle.id}
                                className={clsx(
                                    styles.cycle,
                                    commonStyles.itemCard,
                                    cycle.id === targetCycle?.id && commonStyles.active,
                                    cycle.id === ongoingCycle?.id && commonStyles.bordered,
                                )}
                                onClick={() => {
                                    if (project.id && cycle.id) {
                                        history.replace(
                                            queryString({
                                                project: project.id,
                                                cycle: cycle.id === ongoingCycle?.id ? null : cycle.id,
                                            }),
                                        );
                                    }
                                }}
                            >
                                <div className={styles.cycleName}>
                                    第 {cycle.idx + 1} 周
                                    {cycle.id === ongoingCycle?.id && (
                                        <div className={styles.ongoing}>
                                            <div className={styles.activeDot} />
                                            <span>进行中</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cycleDate}>
                                    {dayjs(cycle.start).format('YYYY年M月D日')} -{' '}
                                    {dayjs(cycle.end).add(-1, 'day').format('YYYY年M月D日')}
                                </div>
                            </div>
                        ))}
                        {isCycleListFolded && (
                            <div
                                className={clsx(styles.cycleOption, commonStyles.itemCard)}
                                onClick={() => setCycleListFolded(false)}
                            >
                                显示更多周期...
                            </div>
                        )}
                    </>
                }
            >
                {targetCycle && cycles && (
                    <CycleDetailView
                        project={project}
                        cycleInfo={targetCycle}
                        cycles={cycles}
                        addCycle={handleAddCycle}
                    />
                )}
                {isFormVisible && (
                    <ProjectForm
                        project={project}
                        onClose={async (success) => {
                            if (success) await refetch();
                            setFormVisible(false);
                        }}
                    />
                )}
            </ContentWithSidebar>
        </>
    );
};

export default ProjectView;
