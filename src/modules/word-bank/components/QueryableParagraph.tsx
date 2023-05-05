import { Fragment } from 'react';
import QueryPanel from './QueryPanel';
import { sentenceSplit, tokenize } from '../utils';
import styles from '../book.module.css';

interface Props {
    query?: (word: string) => void;
    paragraph: string;
}

const QueryableParagraph = ({ paragraph }: Props) => {
    return (
        <p>
            {sentenceSplit(paragraph).map((sentence, index) => (
                <Fragment key={index}>
                    {tokenize(sentence).map((word, wordIdx) => (
                        <Fragment key={wordIdx}>
                            {word.prefix}
                            <span
                                className={styles.word}
                                onClick={(e) => {
                                    QueryPanel.lookup(String(word.origin));
                                    // 禁止事件冒泡
                                    e.stopPropagation();
                                }}
                            >
                                {word.origin}
                            </span>
                            {word.suffix + ' '}
                        </Fragment>
                    ))}
                    <span
                        className={styles.translation}
                        onClick={(e) => {
                            QueryPanel.lookup(String(sentence));
                            e.stopPropagation();
                        }}
                    >
                        译
                    </span>
                </Fragment>
            ))}
        </p>
    );
};

export default QueryableParagraph;
