class Scope {
    static Private = 'private';
    static Public = 'public';
}

class DocType {
    static Text = 'text';
    static Markdown = 'markdown';
}

class Access {
    static Forbidden = 0;
    static Visitor = 10;
    static Member = 50;
    static Admin = 100;
}

class ErrorMessage {
    static Forbidden = {
        error: 'Forbidden',
        message: '无权限',
    };
}

module.exports = {
    DocType,
    Scope,
    Access,
    ErrorMessage,
};
