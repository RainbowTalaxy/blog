import styles from './index.module.css';
import clsx from 'clsx';
import { Dependency } from './constants/Dependency';
import { useLocalStorage } from 'usehooks-ts';
import { TOKENIZE_FILTER_V2 } from './constants/filters';
import { SENTENCES } from './constants';
import SentenceParser from './SentenceParser';
import ContentWithSidebar from '@site/src/components/ContentWithSidebar';

const RELATIONS = Object.values(Dependency);

const FILTER = TOKENIZE_FILTER_V2;

const TokenizePage = () => {
    const [relations, setRelations] = useLocalStorage(
        'tokenize-relations',
        FILTER,
    );

    return (
        <ContentWithSidebar
            title="句子解析"
            sidebarWidth={440}
            sidebar={
                <>
                    <span>依存关系断裂</span>
                    <div className={styles.optionBar}>
                        {RELATIONS.map((relation) => {
                            const isActive = relations.includes(relation);
                            return (
                                <button
                                    key={relation}
                                    className={clsx(
                                        styles.option,
                                        isActive && styles.active,
                                    )}
                                    onClick={() =>
                                        setRelations(
                                            isActive
                                                ? relations.filter(
                                                      (r) => r !== relation,
                                                  )
                                                : [...relations, relation],
                                        )
                                    }
                                >
                                    {relation}
                                </button>
                            );
                        })}
                        <button
                            className={clsx(styles.option, styles.other)}
                            onClick={() => {
                                setRelations(FILTER);
                            }}
                        >
                            重置
                        </button>
                        <button
                            className={clsx(styles.option, styles.other)}
                            onClick={() => {
                                const output = relations.sort();
                                console.log(output);
                                window.navigator.clipboard.writeText(
                                    JSON.stringify(output),
                                );
                            }}
                        >
                            打印/复制
                        </button>
                    </div>
                </>
            }
        >
            <div className={styles.page}>
                {SENTENCES.map((sentence, index) => (
                    <SentenceParser
                        key={index}
                        sentence={sentence}
                        relations={relations}
                    />
                ))}
            </div>
        </ContentWithSidebar>
    );
};

export default TokenizePage;
