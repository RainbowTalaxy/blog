import { Word } from '@site/src/api/word-bank';
import styles from '../index.module.css';
import QueryableWord from './QueryableWord';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export const EditableSpan = ({
    className,
    onChange,
    text,
    rightAlign = false,
    placeholder,
    eleRef,
    onEnter,
}: {
    className?: string;
    eleRef?: React.RefObject<HTMLSpanElement>;
    text: string;
    rightAlign?: boolean;
    placeholder?: string;
    onChange: (text: string) => void;
    onEnter?: () => void;
}) => {
    const placeholderRef = useRef<HTMLSpanElement>(null);

    return (
        <span className={clsx(styles.inputBox, className)}>
            {rightAlign && (
                <span
                    ref={placeholderRef}
                    className={clsx(
                        styles.inputPlaceholder,
                        text && styles.hide,
                    )}
                    onClick={() => {
                        eleRef?.current?.focus();
                    }}
                >
                    {placeholder}
                </span>
            )}
            <span
                ref={eleRef}
                className={clsx(styles.input)}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                    const text = e.currentTarget.innerText;
                    if (text.includes('\n')) {
                        e.currentTarget.innerText = text.replace(/\n/g, '');
                        e.currentTarget.blur();
                        onEnter?.();
                    }
                    if (!e.currentTarget.innerText) {
                        placeholderRef.current?.classList.remove(styles.hide);
                    } else {
                        placeholderRef.current?.classList.add(styles.hide);
                    }
                    onChange(e.currentTarget.innerText || '');
                }}
            >
                {text}
            </span>
            {!rightAlign && (
                <span
                    ref={placeholderRef}
                    className={clsx(
                        styles.inputPlaceholder,
                        text && styles.hide,
                    )}
                    onClick={() => {
                        eleRef?.current?.focus();
                    }}
                >
                    {placeholder}
                </span>
            )}
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
                        placeholder="单词"
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

            <div
                className={styles.spacer}
                onClick={() => {
                    if (isEditing) {
                        const selection = window.getSelection();
                        const range = document.createRange();
                        selection.removeAllRanges();
                        range.selectNodeContents(nameRef.current!);
                        range.collapse(false);
                        selection.addRange(range);
                        nameRef.current?.focus();
                    }
                }}
            />
            {!isLoading &&
                (isEditing ? (
                    <>
                        <EditableSpan
                            eleRef={partRef}
                            className={styles.wordPartOfSpeech}
                            text={word.part}
                            placeholder="词性"
                            rightAlign
                            onChange={(str) => {
                                word.part = str;
                            }}
                            onEnter={() => defRef.current?.focus()}
                        />
                        <div className={styles.wordPartOfSpeechDot}>
                            <span>.</span>
                        </div>
                    </>
                ) : (
                    word.part && (
                        <>
                            <div className={styles.wordPartOfSpeech}>
                                <span>{word.part}</span>
                            </div>
                            <div className={styles.wordPartOfSpeechDot}>
                                <span>.</span>
                            </div>
                        </>
                    )
                ))}
            {!isLoading &&
                (isEditing ? (
                    <EditableSpan
                        eleRef={defRef}
                        className={styles.wordDefinition}
                        text={word.def}
                        placeholder="释义"
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
