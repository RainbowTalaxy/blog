class Scope {
    static Private = 'private';
    static Public = 'public';
}

class DocType {
    static Markdown = 'markdown';
}

class Access {
    static Forbidden = 0;
    static Visitor = 10;
    static Member = 50;
    static Admin = 100;
}

module.exports = {
    DocType,
    Scope,
    Access,
};