import API from '@site/src/api';
import { SentenceData } from '@site/src/api/azalea';
import { Fragment, useEffect, useState } from 'react';
import styles from './index.module.css';
import { Token } from './types';
import { Dependency } from './constants/Dependency';
import { COLORS } from './constants';
import clsx from 'clsx';

const linkToken = (tokens: Token[], breakRel: Dependency[]) => {
    // 清除旧的 link
    tokens.forEach((token) => {
        delete token.link;
    });
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
    // 清除旧的 color
    tokens.forEach((token) => {
        delete token.color;
    });
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

interface Props {
    sentence: string;
    relations: Dependency[];
}

const SentenceParser = ({ sentence, relations }: Props) => {
    const [activeToken, setActiveToken] = useState<Token>(null);
    const [data, setData] = useState<SentenceData>(null);

    useEffect(() => {
        API.azalea.sentence(sentence).then(({ data }) => setData(data));
    }, [sentence]);

    if (!data) return null;

    const { text, tokens } = data;
    const linked = linkToken(tokens, relations);
    colorToken(linked);

    const activeTokenHead = activeToken ? tokens[activeToken.head] : null;

    return (
        <Fragment>
            <p>{text}</p>
            <p className={styles.sentence}>
                {linked.map((token) => {
                    return (
                        <span
                            key={token.id}
                            className={clsx(styles.token)}
                            style={{
                                backgroundColor: token.color,
                                borderBottom:
                                    activeTokenHead?.id === token.id
                                        ? '2px solid red'
                                        : `2px solid transparent`,
                            }}
                            onMouseOver={() => setActiveToken(token)}
                            onMouseOut={() => setActiveToken(null)}
                        >
                            <span className={styles.head}>{token.id}</span>
                            {text.slice(token.start, token.end)}
                        </span>
                    );
                })}
            </p>
            {activeToken && (
                <p className={styles.tokenInfo}>
                    <strong>
                        「{text.slice(activeToken.start, activeToken.end)}」
                    </strong>{' '}
                    <span>{activeToken.lemma}</span>{' '}
                    <span>{activeToken.pos}</span>{' '}
                    <span>
                        <strong>依存关系：</strong>
                        {activeToken.dep}
                    </span>{' '}
                    {activeTokenHead && (
                        <span>
                            <strong>前继：</strong>
                            {text.slice(
                                activeTokenHead.start,
                                activeTokenHead.end,
                            )}
                        </span>
                    )}
                </p>
            )}
        </Fragment>
    );
};

export default SentenceParser;
