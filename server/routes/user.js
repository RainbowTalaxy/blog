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

// 生成 token
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
    const { id, key, token } = req.body;
    if (!id || !key)
        return res.status(400).send({
            error: 'id and key are required',
        });
    if (key.length < 6) {
        return res.status(400).send({ error: 'key is too short' });
    }
    if (!User.digestToken(id, token))
        return res.status(403).send({ error: 'Unauthorized' });
    try {
        User.register(id, key);
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
    const { id, key } = req.body;
    if (!id || !key)
        return res.status(400).send({ error: 'id and key are required' });
    try {
        const config = readJSON(Dir.storage.config);
        if (!User.validate(id, key)) {
            return res.status(401).send({
                error: 'Wrong id or key',
            });
        }
        const token = jwt.sign({ id, key }, config.secret, {
            expiresIn: `${MAX_DAY}d`,
        });
        return res.send({
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: error.message,
        });
    }
});

router.get('/test', login, async (req, res) => {
    res.send({ id: req.userId });
});

module.exports = { userRouter: router };
