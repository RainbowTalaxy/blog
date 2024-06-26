/**
 * 写一个路由，用于处理用户相关的请求。它包括
 *
 * - 登记用户
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { login } = require('../middlewares');
const { User, Dir } = require('../config');
const { readJSON } = require('../utils');
const router = express.Router();

const MAX_DAY = 120;
const COOKIE_EXPIRE = MAX_DAY * 24 * 60 * 60 * 1000;

// 生成注册 token
router.post('/token', login, async (req, res) => {
    try {
        if (!req.isAdmin)
            return res.status(403).send({ error: 'Unauthorized' });
        const { id } = req.body;
        if (!id) return res.status(400).send({ error: 'id is required' });
        const token = User.generateRegisterToken(id);
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
});

// 登记用户, 参数为 token
router.post('/register', async (req, res) => {
    const { id, password, token } = req.body;
    if (!id || !password)
        return res.status(400).send({
            error: 'id and password are required',
        });
    if (password.length < 6) {
        return res.status(400).send({ error: 'password is too short' });
    }
    if (!User.digestRegisterToken(id, token))
        return res.status(403).send({ error: 'Unauthorized' });
    try {
        User.register(id, password);
        res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

// 列出所有用户
router.get('/list', login, async (req, res) => {
    try {
        if (!req.isAdmin)
            return res.status(403).send({ error: 'Unauthorized' });
        const config = User.config;
        res.send({
            ...config,
            users: config.users.map((user) => user.id),
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { id, password, expireTime = MAX_DAY } = req.body;
    if (!id || !password)
        return res.status(400).send({
            error: 'id and password are required',
            message: '请提供 ID 或密码',
        });
    if (expireTime > MAX_DAY) {
        return res.status(400).send({
            error: 'expireTime is too long',
            message: '过期时间太长',
        });
    }
    if (expireTime < 1) {
        return res.status(400).send({
            error: 'expireTime is too short',
            message: '过期时间太短',
        });
    }
    try {
        const user = User.validate(id, password);
        if (!user) {
            return res.status(401).send({
                error: 'Wrong id or password',
                message: 'ID 或密码错误',
            });
        }
        const config = readJSON(Dir.storage.config);
        const token = jwt.sign(
            { id, updateTime: user.updateTime },
            config.secret,
            {
                expiresIn: `${expireTime}d`,
            },
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: COOKIE_EXPIRE,
        });
        return res.send({
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: error.message,
            message: '登录失败',
        });
    }
});

router.post('/digest', async (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.status(400).send({
            error: 'token is required',
            message: '请提供 token',
        });
    try {
        const config = readJSON(Dir.storage.config);
        const { id, updateTime } = jwt.verify(token, config.secret);
        const user = User.find(id);
        if (!user || user.updateTime !== updateTime) {
            return res.status(401).send({
                error: 'wrong token or expired',
                message: 'token 错误或失效',
            });
        }
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: COOKIE_EXPIRE,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: error.message,
            message: '验证失败',
        });
    }
});

router.post('/logout', login, async (req, res) => {
    res.clearCookie('token');
    res.send({
        success: true,
    });
});

router.get('/test', login, async (req, res) => {
    res.send({ id: req.userId });
});

router.get('/', login, async (req, res) => {
    res.send({ id: req.userId });
});

module.exports = { userRouter: router };
