const { Dir } = require('./config');
const { readJSON } = require('./utils');

function parseKeyValueString(str) {
    const result = {};
    if (!str) {
        return result;
    }
    str.split(';').forEach((item) => {
        const [key, value] = item.split('=');
        if (key && value) {
            result[key.trim()] = value.trim();
        }
    });
    return result;
}

// 帮我写一个中间件，用来校验 cookie
const authority = (key) => {
    return (req, res, next) => {
        const config = readJSON(Dir.storage.whitelist);
        const authorization = req.headers.authorization;
        const keys = parseKeyValueString(authorization);
        if (keys?.[key] && config?.[key].includes(keys[key])) {
            next();
        } else {
            res.status(401).send({
                error: 'Unauthorized',
            });
        }
    };
};

module.exports = {
    authority,
};
