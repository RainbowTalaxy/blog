import { Dependency } from './constants/Dependency';

export interface Token {
    id: number;
    start: number;
    end: number;
    tag: string;
    pos: string;
    morph: string;
    lemma: string;
    dep: Dependency;
    head: number;
    color?: string;
    link?: Token;
    leg?: Token;
}
