import ReactMarkdown from 'react-markdown';
import '../../css/markdown.css';

interface Props {
    children: string;
}

const Markdown = ({ children }: Props) => {
    return <ReactMarkdown>{children}</ReactMarkdown>;
};

export default Markdown;
