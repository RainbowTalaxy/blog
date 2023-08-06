import ReactMarkdown from 'react-markdown';
import '../../css/markdown.css';
import MDXImg from '@site/src/theme/MDXComponents/Img';

interface Props {
    children: string;
}

const Markdown = ({ children }: Props) => {
    return (
        <ReactMarkdown
            components={{
                img: MDXImg,
            }}
        >
            {children}
        </ReactMarkdown>
    );
};

export default Markdown;
