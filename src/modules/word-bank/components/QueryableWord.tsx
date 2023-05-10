import { Word } from '@site/src/api/word-bank';
import QueryPanel from './QueryPanel';

interface Props {
    query?: (word: string) => void;
    word: Word;
}

const QueryableWord = ({ word }: Props) => {
    function split(phrase: string): [number, string][] {
        const words = phrase.split(' ');
        return Array.from(words.entries());
    }

    function isFadeWord(word: string): boolean {
        if (word.includes('.')) {
            return true;
        }
        return false;
    }

    if (word.name && word.name.length > 0) {
        return (
            <div style={{ display: 'flex' }}>
                {split(word.name).map(([index, word]) => (
                    <span
                        key={index}
                        style={{
                            opacity: isFadeWord(word) ? 0.5 : 1,
                            marginRight: '5px',
                            cursor: isFadeWord(word) ? 'default' : 'pointer',
                        }}
                        onClick={(e) => {
                            if (!isFadeWord(word)) {
                                QueryPanel.lookup(String(word));
                                // 禁止事件冒泡
                                e.stopPropagation();
                            }
                        }}
                    >
                        {word}
                    </span>
                ))}
            </div>
        );
    } else {
        return <span style={{ fontSize: '18px' }}>N/A</span>;
    }
};

export default QueryableWord;
