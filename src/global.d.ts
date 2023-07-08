declare module '*.module.css';
declare module '*.md';
declare module '*.mdx';
declare module '*.json';

declare global {
    interface Window {
        __docusaurus: HTMLDivElement;
    }
}

export {};
