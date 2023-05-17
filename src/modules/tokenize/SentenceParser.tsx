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
                    let borderColor = 'transparent';
                    const isHead = activeTokenHead?.id === token.id;
                    const isActive = activeToken?.id === token.id;
                    if (isHead) {
                        borderColor = 'red';
                    } else if (isActive) {
                        borderColor = 'gray';
                    }
                    return (
                        <span
                            key={token.id}
                            className={clsx(styles.token)}
                            style={{
                                backgroundColor: token.color + '7b',
                                borderBottom: `2px solid ${borderColor}`,
                            }}
                            onMouseOver={() => setActiveToken(token)}
                            onMouseOut={() => setActiveToken(null)}
                        >
                            {text.slice(token.start, token.end)}
                            <span className={styles.head}>
                                {isHead ? 'Head' : token.id}
                            </span>
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
                    <span>
                        <strong>词性：</strong>
                        {activeToken.pos}
                    </span>{' '}
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
