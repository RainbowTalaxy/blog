import ReactMarkdown from 'react-markdown';
import '../../css/markdown.css';
import MDXImg from '@site/src/theme/MDXComponents/Img';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

interface Slug {
    title: string;
    slug: string;
}

const toSlug = (str: string, prev: Array<Slug>) => {
    const count = prev.filter((item) => item.title === str).length;
    return (
        str
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[/?:=&]/g, '') + (count ? `-${count}` : '')
    );
};

interface Props {
    toc: (slugs: Array<Slug>) => ReactNode;
    children: string;
}

const Markdown = ({ children, toc }: Props) => {
    const [slugs, setSlugs] = useState<Array<Slug>>([]);
    const slugsRef = useRef<Array<Slug>>([]);

    // TODO: 极其丑陋的代码
    useEffect(() => {
        if (slugsRef.current.length === 0) setSlugs([]);
    }, [children]);

    slugsRef.current = [];

    return (
        <>
            {useMemo(() => {
                return (
                    <ReactMarkdown
                        components={{
                            h2: ({ node, ...props }) => {
                                const title = props.children[0] as string;
                                const slug = toSlug(title, slugsRef.current);
                                slugsRef.current.push({ title, slug });

                                useEffect(() => {
                                    setSlugs(slugsRef.current.slice());
                                }, [title]);

                                return <h2 id={slug} {...props} />;
                            },
                            img: MDXImg,
                        }}
                    >
                        {children}
                    </ReactMarkdown>
                );
            }, [children])}
            {toc(slugs)}
        </>
    );
};

export default Markdown;
