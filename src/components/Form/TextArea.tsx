import { RefObject } from 'react';
import '@site/src/css/form.css';

interface Props {
    raf?: RefObject<HTMLTextAreaElement>;
}

const TextArea = ({ raf }: Props) => {
    return <textarea className="textarea" ref={raf} />;
};

export default TextArea;
