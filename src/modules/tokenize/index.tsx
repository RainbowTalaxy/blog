import data1 from './constants/sentence_1.json';
import data2 from './constants/sentence_2.json';
import pageStyles from '../../pages/index.module.css';
import styles from './index.module.css';
import clsx from 'clsx';
import { Fragment, useEffect } from 'react';
import { Dependency } from './constants/Dependency';
import { useLocalStorage } from 'usehooks-ts';
import { TOKENIZE_FILTER_V1 } from './constants/filters';
import { Token } from './types';
import { COLORS } from './constants';
import API from '@site/src/api';

interface Sentence {
    text: string;
    ents: Array<{ start: string; end: string; label: string }>;
    tokens: Array<Token>;
}

const sentences = [data1, data2] as Sentence[];

const linkToken = (tokens: Token[], breakRel: Dependency[]) => {
    tokens = tokens.slice().map((token) => ({ ...token }));
    tokens.forEach((token) => {
        if (breakRel.includes(token.dep)) return;
        const { id, head } = token;
        if (head && head !== id) {
            token.link = tokens[head];
        }
    });
    return tokens;
};

const findLinkHead = (token: Token) => {
    if (!token.link) return token;
    return findLinkHead(token.link);
};

// 给 token 上色，对于同一条链路上的 token，使用相同的颜色
const colorToken = (tokens: Token[]) => {
    let colorIdx = 0;
    tokens.forEach((token) => {
        const head = findLinkHead(token);
        if (!head.color) {
            head.color = COLORS[colorIdx];
            colorIdx = (colorIdx + 1) % COLORS.length;
        }
        token.color = head.color;
    });
};

const RELATIONS = Object.values(Dependency);

const TokenizePage = () => {
    const [relations, setRelations] = useLocalStorage(
        'tokenize-relations',
        TOKENIZE_FILTER_V1 as Dependency[],
    );

    useEffect(() => {
        API.azalea.hello();
    }, []);

    console.log(relations.sort());

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
            </div>
            {sentences.map((sentence, index) => {
                const { text, tokens } = sentence;
                const linked = linkToken(tokens, relations);
                colorToken(linked);
                return (
                    <Fragment key={index}>
                        <p>{text}</p>
                        <p>
                            {linked.map((token) => {
                                return (
                                    <span
                                        key={token.id}
                                        className={clsx(styles.token)}
                                    >
                                        <span className={styles.head}>
                                            {token.id}
                                        </span>
                                        {text.slice(token.start, token.end)}
                                        <span className={styles.head}>
                                            {token.head}
                                        </span>
                                    </span>
                                );
                            })}
                        </p>
                        <p>
                            {linked.map((token) => {
                                return (
                                    <span
                                        key={token.id}
                                        className={clsx(styles.token)}
                                        style={{
                                            backgroundColor: token.color,
                                        }}
                                    >
                                        {text.slice(token.start, token.end)}
                                    </span>
                                );
                            })}
                        </p>
                    </Fragment>
                );
            })}
        </div>
    );
};

export default TokenizePage;
