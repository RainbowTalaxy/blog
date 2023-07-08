import { Word } from '@site/src/api/word-bank';
import styles from '../index.module.css';
import bookStyles from '../book.module.css';
import QueryableWord from './QueryableWord';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export const EditableSpan = ({
    className,
    tabIndex,
    onChange,
    text,
    rightAlign = false,
    placeholder,
    eleRef,
    onEnter,
}: {
    className?: string;
    tabIndex: number;
    eleRef: React.RefObject<HTMLSpanElement>;
    text: string;
    rightAlign?: boolean;
    placeholder?: string;
    onChange: (text: string) => void;
    onEnter?: () => void;
}) => {
    const placeholderRef = useRef<HTMLSpanElement>(null);
    const preText = useRef<string>('');

    preText.current = text;

    return (
        <span className={clsx(styles.inputBox, className)} onClick={() => eleRef?.current?.focus()}>
            {rightAlign && (
                <span
                    ref={placeholderRef}
                    className={clsx(styles.inputPlaceholder, text && styles.hide)}
                    onClick={() => {
                        eleRef?.current?.focus();
                    }}
                >
                    {placeholder}
                </span>
            )}
            <span
                ref={eleRef}
                tabIndex={tabIndex}
                className={clsx(styles.input)}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                    const text = e.currentTarget.innerText;
                    if (text.includes('\n')) {
                        e.currentTarget.innerText = preText.current;
                        e.currentTarget.blur();
                        onEnter?.();
                        const nextInput = document.querySelector(`[tabindex="${tabIndex + 1}"]`) as HTMLDivElement;
                        if (nextInput) {
                            const selection = window.getSelection();
                            const range = document.createRange();
                            selection.removeAllRanges();
                            range.selectNodeContents(nextInput);
                            range.collapse(false);
                            selection.addRange(range);
                            nextInput.focus();
                        }
                    }
                    preText.current = e.currentTarget.innerHTML;
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
                    className={clsx(styles.inputPlaceholder, text && styles.hide)}
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
    index: number;
    word: Word;
    isLoading: boolean;
    isEditing: boolean;
    onReturn: () => void;
}

const WordLine = ({ index, word, isLoading, isEditing, onReturn }: Props) => {
    const nameRef = useRef<HTMLDivElement>(null);
    const partRef = useRef<HTMLDivElement>(null);
    const defRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && word.name === '') {
            nameRef.current?.focus();
        }
    }, []);

    return (
        <div className={clsx(styles.word, bookStyles.wordLine)} key={word.id}>
            {!isLoading &&
                (isEditing ? (
                    <EditableSpan
                        eleRef={nameRef}
                        className={styles.wordName}
                        tabIndex={index * 3 + 1}
                        text={word.name}
                        placeholder="单词"
                        onChange={(str) => {
                            word.name = str;
                        }}
                    />
                ) : (
                    <div className={styles.wordName}>
                        <QueryableWord word={word} showTranslation />
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
                            tabIndex={index * 3 + 2}
                            text={word.part}
                            placeholder="词性"
                            rightAlign
                            onChange={(str) => {
                                word.part = str;
                            }}
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
                        tabIndex={index * 3 + 3}
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
