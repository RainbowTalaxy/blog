import bookStyles from '../book.module.css';
import { Word } from '@site/src/api/word-bank';
import QueryPanel from './QueryPanel';
import clsx from 'clsx';

function split(phrase: string): [number, string][] {
    const words = phrase.split(/(?=[\s\/]+)/);
    return Array.from(words.entries());
}

function isFadeWord(word: string): boolean {
    if (word.includes('.')) {
        return true;
    }
    return false;
}

interface Props {
    query?: (word: string) => void;
    word: Word;
    showTranslation?: boolean;
}

const QueryableWord = ({ word, showTranslation = false }: Props) => {
    if (word.name && word.name.length > 0) {
        return (
            <div style={{ wordSpacing: '0.1em' }}>
                {split(word.name).map(([index, word]) => {
                    const originWord = String(word).replace(/[\s\/]/, '');
                    const isFade = isFadeWord(originWord);
                    return (
                        <span
                            key={index}
                            style={{
                                whiteSpace: 'pre',
                                opacity: isFade ? 0.5 : 1,
                                cursor: isFade ? 'default' : 'pointer',
                            }}
                            onClick={(e) => {
                                if (!isFade) {
                                    QueryPanel.lookup(originWord);
                                    // 禁止事件冒泡
                                    e.stopPropagation();
                                }
                            }}
                        >
                            {word}
                        </span>
                    );
                })}
                {showTranslation && (
                    <span
                        className={clsx(bookStyles.translation, bookStyles.inlineTranslation)}
                        style={{ margin: '0 0 0 6px', verticalAlign: 'middle' }}
                        onClick={(e) => {
                            QueryPanel.lookup(String(word.name));
                            e.stopPropagation();
                        }}
                    >
                        译
                    </span>
                )}
            </div>
        );
    } else {
        return <span style={{ fontSize: '18px' }}>N/A</span>;
    }
};

export default QueryableWord;
