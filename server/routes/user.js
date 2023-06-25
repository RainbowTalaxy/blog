/**
 * 写一个路由，用于处理用户相关的请求。它包括
 *
 * - 登记用户
 */

const express = require('express');
const { login } = require('../middlewares');
const { uuid } = require('../utils');
const { User } = require('../config');
const router = express.Router();

// 生成 token
router.post('/token', login, async (req, res) => {
    try {
        if (!req.isAdmin)
            return res.status(403).send({
                error: 'Unauthorized',
            });
        const { id } = req.body;
        if (!id)
            return res.status(400).send({
                error: 'id is required',
            });
        const result = {
            id,
            token: uuid(),
            time: Date.now(),
        };
        User.tokens.push(result);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

// 登记用户, 参数为 token
router.post('/register', async (req, res) => {
    const { id, key, token } = req.body;
    if (!id || !key)
        return res.status(400).send({
            error: 'id and key are required',
        });
    if (!User.digestToken(id, token))
        return res.status(403).send({
            error: 'Unauthorized',
        });
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
            return res.status(403).send({
                error: 'Unauthorized',
            });
        res.send(User.config);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message,
        });
    }
});

module.exports = { userRouter: router };
