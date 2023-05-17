import pageStyles from '../../pages/index.module.css';
import styles from './index.module.css';
import clsx from 'clsx';
import { Dependency } from './constants/Dependency';
import { useLocalStorage } from 'usehooks-ts';
import { TOKENIZE_FILTER_V1 } from './constants/filters';
import { SENTENCES } from './constants';
import SentenceParser from './SentenceParser';

const RELATIONS = Object.values(Dependency);

const TokenizePage = () => {
    const [relations, setRelations] = useLocalStorage(
        'tokenize-relations',
        TOKENIZE_FILTER_V1,
    );

    return (
        <div className={pageStyles['custom-page']}>
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
                        setRelations(TOKENIZE_FILTER_V1);
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
            {SENTENCES.map((sentence, index) => (
                <SentenceParser
                    key={index}
                    sentence={sentence}
                    relations={relations}
                />
            ))}
        </div>
    );
};

export default TokenizePage;
