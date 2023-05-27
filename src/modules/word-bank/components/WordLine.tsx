import { Word } from '@site/src/api/word-bank';
import styles from '../index.module.css';
import QueryableWord from './QueryableWord';
import clsx from 'clsx';

const EditableSpan = ({
    className,
    onChange,
    text,
}: {
    className?: string;
    text: string;
    onChange: (text: string) => void;
}) => {
    return (
        <span
            className={clsx(styles.input, className)}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onChange(e.currentTarget.textContent || '')}
        >
            {text}
        </span>
    );
};

interface Props {
    word: Word;
    isLoading: boolean;
    isEditing: boolean;
}

const WordLine = ({ word, isLoading, isEditing }: Props) => {
    return (
        <div className={styles.word} key={word.id}>
            {!isLoading &&
                (isEditing ? (
                    <EditableSpan
                        className={styles.wordName}
                        text={word.name}
                        onChange={(str) => {
                            word.name = str;
                        }}
                    />
                ) : (
                    <div className={styles.wordName}>
                        <QueryableWord word={word} />
                    </div>
                ))}

            <div className={styles.spacer} />
            {!isLoading &&
                (isEditing ? (
                    <EditableSpan
                        className={styles.wordPartOfSpeech}
                        text={word.part}
                        onChange={(str) => {
                            word.part = str;
                        }}
                    />
                ) : (
                    <div className={styles.wordPartOfSpeech}>
                        <span>{word.part}</span>
                    </div>
                ))}

            {!isLoading &&
                (isEditing ? (
                    <EditableSpan
                        className={styles.wordDefinition}
                        text={word.def}
                        onChange={(str) => {
                            word.def = str;
                        }}
                    />
                ) : (
                    <div className={styles.wordDefinition}>
                        <span>{word.def}</span>
                    </div>
                ))}
        </div>
    );
};

export default WordLine;
