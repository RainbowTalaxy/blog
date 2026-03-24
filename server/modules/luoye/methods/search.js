// @ts-check

const Controller = require('../controller');

/** @type {import('./search').search} */
const search = (userId, keyword, options = {}) => {
    const { workspaceId, limit = 15 } = options;
    if (!keyword) return [];
    const keywords = Array.from(
        new Set(keyword.trim().split(/\s+/).filter(Boolean)),
    );
    let docIds;
    if (workspaceId) {
        const workspaceCtr = Controller.workspace.ctr(workspaceId);
        if (!workspaceCtr) return null;
        const workspace = workspaceCtr.content;
        docIds = workspace.docs.map((d) => d.docId);
    } else {
        const docItems = Controller.user(userId).docItems.content;
        docIds = docItems.map((d) => d.id);
    }

    const CONTEXT_LEN = 50;
    const results = [];

    const buildAutomaton = (patterns) => {
        const nodes = [{ next: {}, fail: 0, outputs: new Array(0) }];
        for (const pattern of patterns) {
            let state = 0;
            for (const ch of pattern) {
                if (nodes[state].next[ch] === undefined) {
                    nodes[state].next[ch] = nodes.length;
                    nodes.push({
                        next: {},
                        fail: 0,
                        outputs: new Array(0),
                    });
                }
                state = nodes[state].next[ch];
            }
            nodes[state].outputs.push(pattern.length);
        }
        const queue = [];
        for (const ch in nodes[0].next) {
            const nextState = nodes[0].next[ch];
            nodes[nextState].fail = 0;
            queue.push(nextState);
        }
        while (queue.length > 0) {
            const state = queue.shift();
            for (const ch in nodes[state].next) {
                const nextState = nodes[state].next[ch];
                queue.push(nextState);
                let failState = nodes[state].fail;
                while (
                    failState !== 0 &&
                    nodes[failState].next[ch] === undefined
                ) {
                    failState = nodes[failState].fail;
                }
                if (nodes[failState].next[ch] !== undefined) {
                    nodes[nextState].fail = nodes[failState].next[ch];
                } else {
                    nodes[nextState].fail = 0;
                }
                nodes[nextState].outputs = nodes[nextState].outputs.concat(
                    nodes[nodes[nextState].fail].outputs,
                );
            }
        }
        return nodes;
    };

    const automaton = buildAutomaton(keywords);

    const searchRanges = (text) => {
        if (!text) return [];
        const ranges = [];
        let state = 0;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            while (state !== 0 && automaton[state].next[ch] === undefined) {
                state = automaton[state].fail;
            }
            if (automaton[state].next[ch] !== undefined) {
                state = automaton[state].next[ch];
            } else {
                state = 0;
            }
            if (automaton[state].outputs.length > 0) {
                for (const len of automaton[state].outputs) {
                    const end = i + 1;
                    const start = end - len;
                    const rangeStart = Math.max(0, start - CONTEXT_LEN);
                    const rangeEnd = Math.min(text.length, end + CONTEXT_LEN);
                    ranges.push({ start: rangeStart, end: rangeEnd });
                }
            }
        }
        return ranges;
    };

    const mergeRanges = (ranges) => {
        if (ranges.length === 0) return [];
        const sorted = [...ranges].sort((a, b) => a.start - b.start);
        const merged = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
            const last = merged[merged.length - 1];
            if (sorted[i].start <= last.end) {
                last.end = Math.max(last.end, sorted[i].end);
            } else {
                merged.push(sorted[i]);
            }
        }
        return merged;
    };

    for (const docId of docIds) {
        const docCtr = Controller.doc.ctr(docId);
        if (!docCtr) continue;
        const doc = docCtr.content;
        if (doc.deletedAt) continue;
        let hasAllKeywords = true;
        for (const word of keywords) {
            if (!doc.name.includes(word) && !doc.content.includes(word)) {
                hasAllKeywords = false;
                break;
            }
        }
        if (!hasAllKeywords) continue;

        const nameRanges = searchRanges(doc.name);
        const contentRanges = searchRanges(doc.content);

        const matches = [
            ...mergeRanges(nameRanges).map((r) => ({
                field: /** @type {'name' | 'content'} */ ('name'),
                context: doc.name.slice(r.start, r.end),
            })),
            ...mergeRanges(contentRanges).map((r) => ({
                field: /** @type {'name' | 'content'} */ ('content'),
                context: doc.content.slice(r.start, r.end),
            })),
        ];

        if (matches.length > 0) {
            results.push({
                id: doc.id,
                name: doc.name,
                updatedAt: doc.updatedAt,
                matches,
            });
        }
    }

    results.sort((a, b) => b.updatedAt - a.updatedAt);
    return results.slice(0, limit);
};

module.exports = {
    search,
};
