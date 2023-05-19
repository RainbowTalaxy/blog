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
        tokens.push({
            prefix: origin ? prefix : '',
            origin,
            suffix,
        });
    });
    return tokens;
};

const SPLIT_MIN = 70;
const START_MAX = 100;
const SPLIT_MAX = 120;

// 根据句末标点分割段落中的句子，保留句末标点
export const sentenceSplit = (text: string) => {
    if (text.length < START_MAX) return [text];
    const sentences: string[] = [];
    const words = text.split(/\s+/g);
    let sentence = [];
    words
        .filter((word) => word)
        .forEach((word) => {
            sentence.push(word);
            if (word.match(/[.?!。？！]/g) && !word.includes('...')) {
                sentences.push(sentence.join(' '));
                sentence = [];
            }
        });
    if (sentence.length) {
        sentences.push(sentence.join(' '));
    }
    // 对 sentences 做一些合并操作，使得句子不会太短
    const limited = [];
    let mergeFlag = false;
    sentences.forEach((sentence, idx) => {
        if (mergeFlag) {
            limited[limited.length - 1] += ' ' + sentence;
            mergeFlag =
                idx < sentences.length - 1 &&
                limited[limited.length - 1].length + sentences[idx + 1].length <
                    SPLIT_MAX;
            return;
        }
        if (sentence.length > SPLIT_MIN || idx === sentences.length - 1) {
            limited.push(sentence);
        } else if (sentence.length + sentences[idx + 1].length < SPLIT_MAX) {
            mergeFlag = true;
            limited.push(sentence);
        } else {
            limited.push(sentence);
        }
    });
    console.log(limited);
    return limited;
};
