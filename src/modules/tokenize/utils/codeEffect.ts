import { Dependency } from '../constants/Dependency';
import { POS } from '../constants/POS';
import { Token } from '../types';

export enum CodeEffect {
    ConjHandle = 'conj_handle',
    CcompFilter = 'ccomp_filter',
}

export const CodeEffectInfo: { [key in CodeEffect]: string } = {
    [CodeEffect.ConjHandle]: '连词合并',
    [CodeEffect.CcompFilter]: '从句补充断裂',
};

const CONJ_POS_FILTER = [POS.VERB];

const conjHandle = (tokens: Token[]) => {
    tokens.forEach((token, idx) => {
        if (token.dep !== Dependency.cc) return;
        const { head } = token;
        for (let i = idx + 1; i < tokens.length; i += 1) {
            const targetToken = tokens[i];
            if (
                targetToken.head === head &&
                targetToken.dep === Dependency.conj
            ) {
                token.leg = targetToken;
                if (!CONJ_POS_FILTER.includes(targetToken.pos)) {
                    targetToken.link = tokens[targetToken.head];
                }
                break;
            }
        }
    });
};

const CCOMP_POS_FILTER = [POS.VERB];

const ccompFilter = (tokens: Token[]) => {
    tokens.forEach((token) => {
        if (token.dep !== Dependency.ccomp) return;
        if (CCOMP_POS_FILTER.includes(token.pos)) {
            delete token.link;
        }
    });
};

export const codeEffect = (tokens: Token[], effects: CodeEffect[]) => {
    // 清除旧的 leg
    tokens.forEach((token) => {
        delete token.leg;
    });
    effects.forEach((effect) => {
        switch (effect) {
            case CodeEffect.ConjHandle:
                conjHandle(tokens);
                break;
            case CodeEffect.CcompFilter:
                ccompFilter(tokens);
            default:
                break;
        }
    });
};