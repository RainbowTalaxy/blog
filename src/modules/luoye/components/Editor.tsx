import clsx from 'clsx';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import styles from '../styles/document.module.css';
import useKeyboard from '@site/src/hooks/useKeyboard';

interface Props {
    className?: string;
    visible: boolean;
    keyId: string;
    onSave: (text: string) => void;
}

export interface EditorRef {
    focus: () => void;
    setText: (text: string) => void;
    getText: () => string;
}

const PLACE_HOLDER = '点击此处直接输入正文';

const Editor = forwardRef(({ className, visible, keyId, onSave }: Props, ref: ForwardedRef<EditorRef>) => {
    const eleRef = useRef<HTMLPreElement>(null);

    useKeyboard('Tab', () => {
        if (visible && eleRef.current) document.execCommand('insertText', false, '\t');
    });

    useKeyboard(
        's',
        () => {
            if (visible && eleRef.current) onSave(eleRef.current.innerText);
        },
        {
            ctrl: true,
        },
    );

    useImperativeHandle(ref, () => ({
        focus: () => eleRef.current?.focus(),
        setText: (text: string) => {
            eleRef.current!.innerText = text;
            eleRef.current!.dataset.placeholder = text ? '' : PLACE_HOLDER;
        },
        getText: () => {
            let text = eleRef.current!.innerText;
            // 去除行间多余的空行
            text = text.replace(/\n{3,}/g, '\n\n');
            return text;
        },
    }));

    useEffect(() => {
        if (visible && !eleRef.current?.innerText) eleRef.current?.focus();
    }, [visible, keyId]);

    return (
        <pre
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
        ></pre>
    );
});

export default Editor;
