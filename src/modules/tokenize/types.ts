import { Dependency } from './constants/Dependency';
import { POS } from './constants/POS';

export interface Token {
    id: number;
    start: number;
    end: number;
    tag: string;
    pos: POS;
    morph: string;
    lemma: string;
    dep: Dependency;
    head: number;
    color?: string;
    link?: Token;
    leg?: Token;
    flatHead?: number;
}
