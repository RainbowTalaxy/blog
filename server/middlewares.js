const jwt = require('jsonwebtoken');
const { Dir, User } = require('./config');
const { readJSON } = require('./utils');

// 帮我写一个中间件，用来校验用户 id 和 key 是否匹配
const login = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res
            .status(401)
            .send({ error: 'Please login first', message: '请先登录' });
    const config = readJSON(Dir.storage.config);
    try {
        const { id, updateTime } = jwt.verify(token, config.secret);
        const user = User.find(id);
        const invalid = !user || user.updateTime !== updateTime;
        if (invalid)
            return res
                .status(401)
                .send({ error: 'Please login again', message: '请重新登录' });
        req.userId = user.id;
        if (User.isAdmin(id)) req.isAdmin = true;
        next();
    } catch (error) {
        return res
            .status(401)
            .send({ error: 'Please login first', message: '用户身份过期' });
    }
};

const weakLogin = (req, _, next) => {
    const token = req.cookies.token;
    if (!token) return next();
    const config = readJSON(Dir.storage.config);
    try {
        const { id } = jwt.verify(token, config.secret);
        req.userId = id;
        if (User.isAdmin(id)) req.isAdmin = true;
    } catch (error) {}
    next();
};

const adminLogin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res
            .status(401)
            .send({ error: 'Please login first', message: '请先登录' });
    const config = readJSON(Dir.storage.config);
    try {
        const { id, updateTime } = jwt.verify(token, config.secret);
        const user = User.find(id);
        const invalid = !user || user.updateTime !== updateTime;
        if (invalid)
            return res
                .status(401)
                .send({ error: 'Please login again', message: '请重新登录' });
        req.userId = user.id;
        if (!User.isAdmin(id))
            return res
                .status(403)
                .send({ error: 'Forbidden', message: '无权访问' });
        next();
    } catch (error) {
        return res
            .status(401)
            .send({ error: 'Please login first', message: '用户身份过期' });
    }
};

module.exports = {
    login,
    weakLogin,
    adminLogin,
};
