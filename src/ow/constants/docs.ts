import { Card } from '../models/card';

export const DOCS_DATA: Array<Card> = [
    {
        primary: 'TypeScript',
        title: '官方文档',
        subtitle: 'typescriptlang.org/docs',
        bg: '/logo/typescript.svg',
        link: '/docs/ts/手册/基础知识',
        style: {
            objectFit: 'contain',
            backgroundColor: '#3178c6',
        },
    },
    {
        primary: 'JavaScript',
        title: '权威指南',
        subtitle: '《JavaScript权威指南》第7版',
        bg: '/logo/javascript.svg',
        link: '/docs/js/dg7/JavaScript-语法概要',
        style: {
            objectFit: 'contain',
            backgroundColor: '#f0db4f',
        },
    },
    {
        primary: 'CSS',
        title: 'Learn CSS',
        subtitle: 'web.dev/learn/css',
        bg: 'https://web.dev/images/courses/css/card.svg',
        link: '/docs/css/learn-css/Box-模型',
        style: {
            objectFit: 'cover',
            objectPosition: 'left',
            backgroundColor: '#fff',
        },
    },
    {
        primary: 'More',
        title: '更多',
        subtitle: '浏览更多笔记',
        bg: 'https://r.photo.store.qq.com/psc?/V53zNsw50AU6SY3IaO3s4AEy7E1ioe76/bqQfVz5yrrGYSXMvKr.cqVVfPptUuCxDj2VYqVILlvxdnbbxEORiOf3y646zEmcHTtDVyeasbMHX1ITnI.ELG1CoD*taNcwk3C1fr42*RmA!/r',
        link: '/docs/doc-intro',
    },
];
