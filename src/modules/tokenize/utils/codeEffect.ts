import { findLinkHead } from '.';
import { Dependency } from '../constants/Dependency';
import { POS } from '../constants/POS';
import { Token } from '../types';

export enum CodeEffect {
    ConjHandle = 'conj_handle',
    CcompFilter = 'ccomp_filter',
    SpanCombine = 'span_combine',
}

export const CodeEffectInfo: { [key in CodeEffect]: string } = {
    [CodeEffect.ConjHandle]: '连词合并',
    [CodeEffect.CcompFilter]: '从句补充断裂',
    [CodeEffect.SpanCombine]: '合并短句（测试中）',
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

// 计算同 flatHead 的 token 的数量
const calcSpans = (tokens: Token[]) => {
    const spans: Array<{ root: number; count: number; head?: number }> = [];
    tokens.forEach((token) => {
        const { flatHead } = token;
        let span = spans.find((span) => span.root === flatHead);
        if (span) {
            span.count += 1;
        } else {
            span = { root: flatHead, count: 1 };
            spans.push(span);
        }
        if (token.id === span.root && token.head !== token.id) {
            span.head = tokens[token.head].flatHead;
        }
    });
    return spans;
};

// 若相邻的 span 都小于 minLength，则合并为一个 span。合并方式为将后一个 span 的 head 指向前一个 span 的 head
const spanCombine = (tokens: Token[], minLength: number) => {
    const spans = calcSpans(tokens);
    console.log(spans);
    let preLength = 0;
    let preSpans = [];
    spans.forEach((span) => {
        if (preLength + span.count > minLength) {
            preLength = span.count;
            preSpans = [span];
        } else {
            const parent = preSpans.find(
                (preSpan) => preSpan.root === span.head,
            );
            if (parent) {
                tokens[span.root].link = tokens[parent.root];
                preLength += span.count;
                preSpans.push(span);
                return;
            }
            const son = spans.find((s) => s.head === span.root);
            if (son) {
                tokens[son.root].link = tokens[span.root];
                preLength += span.count;
                preSpans.push(span);
                return;
            }
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
                break;
            case CodeEffect.SpanCombine:
                spanCombine(tokens, 10);
                break;
            default:
                break;
        }
    });
};
