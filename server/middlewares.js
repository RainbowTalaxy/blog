const jwt = require('jsonwebtoken');
const { Dir, User } = require('./config');
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

// 帮我写一个中间件，用来校验用户 id 和 key 是否匹配
const login = (req, res, next) => {
    const authorization = req.headers.authorization;
    const keys = parseKeyValueString(authorization);
    if (!keys.token)
        return res
            .status(401)
            .send({ error: 'Please login first', message: '请先登录' });
    const config = readJSON(Dir.storage.config);
    try {
        const { id, password } = jwt.verify(keys.token, config.secret);
        if (!User.validate(id, password))
            return res
                .status(401)
                .send({ error: 'Please login again', message: '请重新登录' });
        req.userId = id;
        if (User.isAdmin(id)) req.isAdmin = true;
        next();
    } catch (error) {
        return res
            .status(401)
            .send({ error: 'Please login first', message: '用户身份过期' });
    }
};

const weakLogin = (req, _, next) => {
    const authorization = req.headers.authorization;
    const keys = parseKeyValueString(authorization);
    if (!keys.token) return next();
    const config = readJSON(Dir.storage.config);
    try {
        const { id } = jwt.verify(keys.token, config.secret);
        req.userId = id;
        if (User.isAdmin(id)) req.isAdmin = true;
    } catch (error) {}
    next();
};

module.exports = {
    login,
    weakLogin,
};
