import Editor from '@monaco-editor/react';
import styles from '../../styles/editor.module.css';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { EditorProps, EditorRef } from './Editor';
import PlaceholderContentWidget from './PlaceholderContentWidget';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import useKeyboard from '@site/src/hooks/useKeyboard';
import clsx from 'clsx';

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    // 控制是否展示行号
    // folding: false,
    // glyphMargin: false,
    // lineDecorationsWidth: 0,
    // lineNumbers: 'off',
    // lineNumbersMinChars: 0,

    // 折行控制
    wrappingStrategy: 'advanced',
    wordWrap: 'on',

    // 字体设置
    fontLigatures: true,
    fontSize: 16,
    fontFamily:
        "'Fira Code', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",

    // 光标宽度
    cursorWidth: 1,
    // 右侧 minimap
    minimap: {
        enabled: false,
    },
    // 编辑器边距
    padding: {
        top: 24,
    },
    // 行高亮
    renderLineHighlight: 'none',
    // 滚动条设置
    scrollbar: {
        verticalScrollbarSize: 6,
    },
    // unicode 高亮
    unicodeHighlight: {
        ambiguousCharacters: false,
    },
};

const MarkdownEditor = forwardRef(
    ({ className, visible, keyId, onSave }: EditorProps, ref: ForwardedRef<EditorRef>) => {
        const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

        useKeyboard(
            's',
            () => {
                if (visible && editorRef.current) onSave(editorRef.current.getValue());
            },
            {
                ctrl: true,
            },
        );

        useImperativeHandle(ref, () => ({
            focus: () => editorRef.current?.focus(),
            setText: (text: string) => {
                editorRef.current?.setValue(text);
            },
            getText: () => {
                return editorRef.current?.getValue() || '';
            },
        }));

        useEffect(() => {
            if (visible && !editorRef.current?.getValue()) editorRef.current?.focus();
        }, [visible, keyId]);

        // 编辑器的 visible 样式由外层控制
        return (
            <Editor
                className={clsx(styles.container, className)}
                height="100%"
                defaultLanguage="markdown"
                defaultValue=""
                loading="加载中..."
                options={options}
                onMount={(editor) => {
                    editorRef.current = editor;
                    new PlaceholderContentWidget('点击此处输入正文', editor);
                }}
            />
        );
    },
);

export default MarkdownEditor;
