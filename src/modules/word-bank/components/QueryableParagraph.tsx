import { Fragment } from 'react';
import { Word } from '../type';
import QueryPanel from './QueryPanel';

interface Props {
    query?: (word: string) => void;
    paragraph: string;
}

const QueryableParagraph = ({ paragraph }: Props) => {
    function split(phrase: string): [number, string][] {
        const words = phrase.split(' ');
        return Array.from(words.entries());
    }

    return (
        <p>
            {split(paragraph).map(([index, word]) => (
                <Fragment key={index}>
                    <span
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={(e) => {
                            QueryPanel.lookup(String(word));
                            // 禁止事件冒泡
                            e.stopPropagation();
                        }}
                    >
                        {word}
                    </span>{' '}
                </Fragment>
            ))}
        </p>
    );
};

export default QueryableParagraph;
