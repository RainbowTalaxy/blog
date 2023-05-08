interface Token {
    prefix: string;
    origin: string;
    suffix: string;
}

export const tokenize = (text: string) => {
    const tokens: Token[] = [];
    const words = text.split(/\s+/g);
    words.forEach((word) => {
        const prefix = word.match(/^\W+/g)?.[0] ?? '';
        const suffix = word.match(/\W+$/g)?.[0] ?? '';
        const origin = word.replace(/^\W+/g, '').replace(/\W+$/g, '');
        if (origin) {
            tokens.push({
                prefix,
                origin,
                suffix,
            });
        }
    });
    return tokens;
};

// 根据句末标点分割段落中的句子，保留句末标点
export const sentenceSplit = (text: string) => {
    const sentences: string[] = [];
    const words = text.split(/\s+/g);
    let sentence = [];
    words
        .filter((word) => word)
        .forEach((word) => {
            sentence.push(word);
            if (word.match(/[.?!。？！]/g)) {
                sentences.push(sentence.join(' '));
                sentence = [];
            }
        });
    if (sentence.length) {
        sentences.push(sentence.join(' '));
    }
    return sentences;
};
