import API from '@site/src/api';
import { SentenceData } from '@site/src/api/azalea';
import { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './index.module.css';
import { Token } from './types';
import { Dependency } from './constants/Dependency';
import clsx from 'clsx';
import { CodeEffect, codeEffect } from './utils/codeEffect';
import { colorToken, flattenTokenHead, linkToken } from './utils';

interface Props {
    sentence: string;
    relations: Dependency[];
    codeEffects: CodeEffect[];
}

const SentenceParser = ({ sentence, relations, codeEffects }: Props) => {
    const [activeToken, setActiveToken] = useState<Token>(null);
    const [data, setData] = useState<SentenceData>(null);

    useEffect(() => {
        API.azalea.sentence(sentence).then(({ data }) => setData(data));
    }, [sentence]);

    const linked = useMemo(() => {
        if (!data) return [];
        console.log(sentence);
        const { tokens } = data;
        const linked = linkToken(tokens, relations);
        flattenTokenHead(linked);
        codeEffect(linked, codeEffects);
        colorToken(linked);
        return linked;
    }, [data, relations, codeEffects]);

    if (!data) return null;

    const { text, tokens } = data;
    const activeTokenHead = activeToken ? tokens[activeToken.head] : null;

    return (
        <Fragment>
            <p>{text}</p>
            <div className={styles.sentence}>
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
                                backgroundColor: token.color + '64',
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
                {activeToken && (
                    <div className={styles.tokenInfo}>
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
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default SentenceParser;
