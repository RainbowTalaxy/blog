import data1 from './constants/sentence_1.json';
import data2 from './constants/sentence_2.json';
import pageStyles from '../../pages/index.module.css';
import styles from './index.module.css';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { Dependency } from './constants/index';
import { useLocalStorage } from 'usehooks-ts';
import { TOKENIZE_FILTER_V1 } from './constants/filters';

interface Token {
    id: number;
    start: number;
    end: number;
    tag: string;
    pos: string;
    morph: string;
    lemma: string;
    dep: Dependency;
    head: number;
    color?: string;
    link?: Token;
}

interface Sentence {
    text: string;
    ents: Array<{ start: string; end: string; label: string }>;
    tokens: Array<Token>;
}

const sentences = [data1, data2] as Sentence[];

// 生成 30 种不同的静态颜色，用数组
const colors = [
    '#ffeb3b',
    '#ff9800',
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#009688',
    '#4caf50',
    '#795548',
    '#607d8b',
].map((color) => color + '7b');

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
            head.color = colors[colorIdx];
            colorIdx = (colorIdx + 1) % colors.length;
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
