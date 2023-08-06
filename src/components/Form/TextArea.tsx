import { RefObject } from 'react';
import '@site/src/css/form.css';
import clsx from 'clsx';

interface Props {
    className?: string;
    raf?: RefObject<HTMLTextAreaElement>;
}

const TextArea = ({ raf, className }: Props) => {
    return <textarea className={clsx('textarea', className)} ref={raf} />;
};

export default TextArea;