const { Dir } = require('./config');
const { readJSON } = require('./utils');

// 帮我写一个中间件，用来校验 cookie
const authority = (key) => {
    return (req, res, next) => {
        const config = readJSON(Dir.storage.whitelist);
        if (req.cookies[key] && config?.[key].includes(req.cookies[key])) {
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
