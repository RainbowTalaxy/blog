import styles from './index.module.css';
import clsx from 'clsx';
import { Dependency } from './constants/Dependency';
import { useLocalStorage } from 'usehooks-ts';
import { TOKENIZE_FILTER_V2 } from './constants/filters';
import { REFERENCES, SENTENCES } from './constants';
import SentenceParser from './SentenceParser';
import ContentWithSidebar from '@site/src/components/ContentWithSidebar';
import { CodeEffect, CodeEffectInfo } from './utils/codeEffect';

const RELATIONS = Object.values(Dependency);
const CODE_EFFECTS = Object.values(CodeEffect);

const FILTER = TOKENIZE_FILTER_V2;

const TokenizePage = () => {
    const [relations, setRelations] = useLocalStorage(
        'tokenize-relations',
        FILTER,
    );

    const [codeEffects, setCodeEffects] = useLocalStorage(
        'tokenize-code-effects',
        CODE_EFFECTS,
    );

    return (
        <ContentWithSidebar
            title="句子解析"
            sidebarWidth={400}
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
                    <span>代码加工</span>
                    <div className={styles.optionBar}>
                        {CODE_EFFECTS.map((effect) => {
                            const isActive = codeEffects.includes(effect);
                            return (
                                <button
                                    key={effect}
                                    className={clsx(
                                        styles.option,
                                        isActive && styles.active,
                                    )}
                                    onClick={() =>
                                        setCodeEffects(
                                            isActive
                                                ? codeEffects.filter(
                                                      (e) => e !== effect,
                                                  )
                                                : [...codeEffects, effect],
                                        )
                                    }
                                >
                                    {CodeEffectInfo[effect]}
                                </button>
                            );
                        })}
                        <button
                            className={clsx(styles.option, styles.other)}
                            onClick={() => {
                                setCodeEffects(CODE_EFFECTS);
                            }}
                        >
                            重置
                        </button>
                    </div>
                    <span>参考文档</span>
                    <div className={styles.list}>
                        {REFERENCES.map((reference) => (
                            <li key={reference.name}>
                                <a href={reference.url}>{reference.name}</a>
                            </li>
                        ))}
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
                        codeEffects={codeEffects}
                    />
                ))}
            </div>
        </ContentWithSidebar>
    );
};

export default TokenizePage;
