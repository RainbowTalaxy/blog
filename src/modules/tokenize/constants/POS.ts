export enum POS {
    /**
     * POS tags
     * Universal POS Tags
     * http://universaldependencies.org/u/pos/
     */
    ADJ = 'ADJ', // adjective
    ADP = 'ADP', // adposition
    ADV = 'ADV', // adverb
    AUX = 'AUX', // auxiliary
    CONJ = 'CONJ', // conjunction
    CCONJ = 'CCONJ', // coordinating conjunction
    DET = 'DET', // determiner
    INTJ = 'INTJ', // interjection
    NOUN = 'NOUN', // noun
    NUM = 'NUM', // numeral
    PART = 'PART', // particle
    PRON = 'PRON', // pronoun
    PROPN = 'PROPN', // proper noun
    PUNCT = 'PUNCT', // punctuation
    SCONJ = 'SCONJ', // subordinating conjunction
    SYM = 'SYM', // symbol
    VERB = 'VERB', // verb
    X = 'X', // other
    EOL = 'EOL', // end of line
    SPACE = 'SPACE', // space

    /**
     * POS tags (English)
     * OntoNotes 5 / Penn Treebank
     * https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
     */
    dot = '.', // punctuation mark, sentence closer
    comma = ',', // punctuation mark, comma
    _LRB_ = '-LRB-', // left round bracket
    _RRB_ = '-RRB-', // right round bracket
    OQ = '`', // opening quotation mark
    DCQ = '""', // closing quotation mark
    SCQ = "''", // closing quotation mark
    colon = ':', // punctuation mark, colon or ellipsis
    currency = '$', // symbol, currency
    number = '#', // symbol, number sign
    AFX = 'AFX', // affix
    CC = 'CC', // conjunction, coordinating
    CD = 'CD', // cardinal number
    DT = 'DT', // determiner
    EX = 'EX', // existential there
    FW = 'FW', // foreign word
    HYPH = 'HYPH', // punctuation mark, hyphen
    IN = 'IN', // conjunction, subordinating or preposition
    JJ = 'JJ', // adjective (English), other noun-modifier (Chinese)
    JJR = 'JJR', // adjective, comparative
    JJS = 'JJS', // adjective, superlative
    LS = 'LS', // list item marker
    MD = 'MD', // verb, modal auxiliary
    NIL = 'NIL', // missing tag
    NN = 'NN', // noun, singular or mass
    NNP = 'NNP', // noun, proper singular
    NNPS = 'NNPS', // noun, proper plural
    NNS = 'NNS', // noun, plural
    PDT = 'PDT', // predeterminer
    POS = 'POS', // possessive ending
    PRP = 'PRP', // pronoun, personal
    PRP$ = 'PRP$', // pronoun, possessive
    RB = 'RB', // adverb
    RBR = 'RBR', // adverb, comparative
    RBS = 'RBS', // adverb, superlative
    RP = 'RP', // adverb, particle
    TO = 'TO', // infinitival "to"
    UH = 'UH', // interjection
    VB = 'VB', // verb, base form
    VBD = 'VBD', // verb, past tense
    VBG = 'VBG', // verb, gerund or present participle
    VBN = 'VBN', // verb, past participle
    VBP = 'VBP', // verb, non-3rd person singular present
    VBZ = 'VBZ', // verb, 3rd person singular present
    WDT = 'WDT', // wh-determiner
    WP = 'WP', // wh-pronoun, personal
    WP$ = 'WP$', // wh-pronoun, possessive
    WRB = 'WRB', // wh-adverb
    SP = 'SP', // space (English), sentence-final particle (Chinese)
    ADD = 'ADD', // email
    NFP = 'NFP', // superfluous punctuation
    GW = 'GW', // additional word in multi-word expression
    XX = 'XX', // unknown
    BES = 'BES', // auxiliary "be"
    HVS = 'HVS', // forms of "have"
    _SP = '_SP', // whitespace
}
