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

// 生成注册 token
router.post('/token', login, async (req, res) => {
    try {
        if (!req.isAdmin)
            return res.status(403).send({ error: 'Unauthorized' });
        const { id } = req.body;
        if (!id) return res.status(400).send({ error: 'id is required' });
        const token = User.generateToken(id);
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
    if (!User.digestToken(id, token))
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

const MAX_DAY = 120;

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
        if (!User.validate(id, password)) {
            return res.status(401).send({
                error: 'Wrong id or password',
                message: 'ID 或密码错误',
            });
        }
        const config = readJSON(Dir.storage.config);
        const token = jwt.sign({ id, password }, config.secret, {
            expiresIn: `${expireTime}d`,
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

router.get('/test', login, async (req, res) => {
    res.send({ id: req.userId });
});

module.exports = { userRouter: router };
