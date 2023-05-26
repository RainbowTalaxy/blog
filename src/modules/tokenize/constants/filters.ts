import { CodeEffect } from '../utils/codeEffect';
import { Dependency } from './Dependency';

export const TOKENIZE_FILTER_V1 = [
    'acl',
    'acomp',
    'advcl',
    'agent',
    'appos',
    'cc',
    'conj',
    'csubj',
    'csubjpass',
    'dative',
    'dep',
    'expl',
    'intj',
    'meta',
    'nounmod',
    'npmod',
    'oprd',
    'parataxis',
    'pcomp',
    'preconj',
    'predet',
    'prep',
    'prt',
    'quantmod',
    'relcl',
    'root',
    'xcomp',
] as Dependency[];

export const TOKENIZE_FILTER_V2 = [
    'advcl',
    'conj',
    'prep',
    'relcl',
] as Dependency[];

export const TOKENIZE_FILTER_V3 = {
    relations: ['advcl', 'conj', 'prep', 'relcl'] as Dependency[],
    codeEffects: [CodeEffect.ConjHandle, CodeEffect.CcompFilter],
};
