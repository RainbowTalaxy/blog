import { CSSProperties } from 'react';

export interface Card {
    primary: string;
    title: string;
    subtitle: string;
    bg: string;
    link: string;
    style?: CSSProperties;
}
