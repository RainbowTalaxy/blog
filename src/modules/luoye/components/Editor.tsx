import clsx from 'clsx';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import styles from '../styles/document.module.css';

interface Props {
    className?: string;
    visible: boolean;
    keyId: string;
}

export interface EditorRef {
    focus: () => void;
    setText: (text: string) => void;
    getText: () => string;
}

const PLACE_HOLDER = '点击此处直接输入正文';

const Editor = forwardRef(({ className, visible, keyId }: Props, ref: ForwardedRef<EditorRef>) => {
    const eleRef = useRef<HTMLDivElement>();

    useImperativeHandle(ref, () => ({
        focus: () => {
            eleRef.current?.focus();
        },
        setText: (text: string) => {
            eleRef.current!.innerText = text;
            eleRef.current!.dataset.placeholder = text ? '' : PLACE_HOLDER;
        },
        getText: () => {
            return eleRef.current!.innerText;
        },
    }));

    useEffect(() => {
        if (visible && !eleRef.current.innerText) eleRef.current?.focus();
    }, [visible, keyId]);

    return (
        <div
            ref={eleRef}
            className={clsx(styles.docInput, className)}
            style={{ display: visible ? '' : 'none' }}
            contentEditable
            spellCheck={false}
            data-placeholder={PLACE_HOLDER}
            onInput={(e) => {
                const text = e.currentTarget.innerText.trim();
                e.currentTarget.dataset.placeholder = text ? '' : PLACE_HOLDER;
            }}
            onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            }}
        ></div>
    );
});

export default Editor;
