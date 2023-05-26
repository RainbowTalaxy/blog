import { COLORS } from '../constants';
import { Dependency } from '../constants/Dependency';
import { Token } from '../types';

export const linkToken = (tokens: Token[], breakRel: Dependency[]) => {
    // 清除旧的 link
    tokens.forEach((token) => {
        delete token.link;
    });
    tokens = tokens.slice().map((token) => ({ ...token }));
    tokens.forEach((token) => {
        if (breakRel.includes(token.dep)) return;
        const { id, head } = token;
        if (head !== id) {
            token.link = tokens[head];
        }
    });
    return tokens;
};

export const findLinkHead = (token: Token): Token => {
    if (token.leg) return findLinkHead(token.leg);
    if (!token.link) return token;
    return findLinkHead(token.link);
};

// 扁平化 token 的 head
export const flattenTokenHead = (tokens: Token[]) => {
    tokens.forEach((token) => {
        token.flatHead = findLinkHead(token).id;
    });
};

// 给 token 上色，对于同一条链路上的 token，使用相同的颜色
export const colorToken = (tokens: Token[]) => {
    // 清除旧的 color
    tokens.forEach((token) => {
        delete token.color;
    });
    let colorIdx = 0;
    tokens.forEach((token) => {
        const head = findLinkHead(token);
        if (!head.color) {
            head.color = COLORS[colorIdx];
            colorIdx = (colorIdx + 1) % COLORS.length;
        }
        token.color = head.color;
    });
};
