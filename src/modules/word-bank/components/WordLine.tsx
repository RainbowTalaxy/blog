import { Word } from '@site/src/api/word-bank';
import styles from '../index.module.css';
import QueryableWord from './QueryableWord';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

const EditableSpan = ({
    className,
    onChange,
    text,
    eleRef,
    onEnter,
}: {
    className?: string;
    eleRef?: React.RefObject<HTMLSpanElement>;
    text: string;
    onChange: (text: string) => void;
    onEnter?: () => void;
}) => {
    return (
        <span
            ref={eleRef}
            className={clsx(styles.input, className)}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
                const text = e.currentTarget.innerText;
                if (text.includes('\n')) {
                    e.currentTarget.innerText = text.replace(/\n/g, '');
                    e.currentTarget.blur();
                    onEnter?.();
                }
                onChange(e.currentTarget.innerText || '');
            }}
        >
            {text}
        </span>
    );
};

interface Props {
    word: Word;
    isLoading: boolean;
    isEditing: boolean;
    onReturn: () => void;
}

const WordLine = ({ word, isLoading, isEditing, onReturn }: Props) => {
    const nameRef = useRef<HTMLDivElement>(null);
    const partRef = useRef<HTMLDivElement>(null);
    const defRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && word.name === '') {
            nameRef.current?.focus();
        }
    }, []);

    return (
        <div className={styles.word} key={word.id}>
            {!isLoading &&
                (isEditing ? (
                    <EditableSpan
                        eleRef={nameRef}
                        className={styles.wordName}
                        text={word.name}
                        onChange={(str) => {
                            word.name = str;
                        }}
                        onEnter={() => partRef.current?.focus()}
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
                        eleRef={partRef}
                        className={styles.wordPartOfSpeech}
                        text={word.part}
                        onChange={(str) => {
                            word.part = str;
                        }}
                        onEnter={() => defRef.current?.focus()}
                    />
                ) : (
                    word.part && (
                        <div className={styles.wordPartOfSpeech}>
                            <span>{word.part}</span>
                        </div>
                    )
                ))}

            {!isLoading &&
                (isEditing ? (
                    <EditableSpan
                        eleRef={defRef}
                        className={styles.wordDefinition}
                        text={word.def}
                        onChange={(str) => {
                            word.def = str;
                        }}
                        onEnter={() => onReturn()}
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
