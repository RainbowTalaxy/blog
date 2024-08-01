const File = require('../../utils/file');
const { Dir } = require('../../config');
const { adminLogin, weakLogin } = require('../../middlewares');
const { readJSON, uuid } = require('../../utils');
const express = require('express');
const dayjs = require('dayjs');
const router = express.Router();
const path = require('path');

const Controller = {
    config: readJSON(Dir.storage.config),
    getLogTokens() {
        return Controller.config.log_access_tokens;
    },
    addLogToken(title) {
        const token = uuid();
        Controller.config.log_access_tokens.push({
            title,
            token,
        });
        writeJSON(Dir.storage.config, Controller.config);
        return Controller.config.log_access_tokens;
    },
    removeLogToken(token) {
        Controller.config.log_access_tokens =
            Controller.config.log_access_tokens.filter(
                (item) => item.token !== token,
            );
        writeJSON(Dir.storage.config, Controller.config);
        return Controller.config.log_access_tokens;
    },
    isLogTokenValid(token) {
        return Controller.config.log_access_tokens.some(
            (item) => item.token === token,
        );
    },
};

router.get('/admin/log-tokens', adminLogin, async (_, res, next) => {
    try {
        res.send(Controller.getLogTokens());
    } catch (error) {
        res.error = 'Failed to access log tokens';
        res.message = '获取日志 token 失败';
        next(error);
    }
});

router.post('/admin/log-token', adminLogin, async (res, req, next) => {
    try {
        const { title } = req.body;
        const newTokens = Controller.addLogToken(title);
        res.send(newTokens);
    } catch (error) {
        res.error = 'Failed to add log token';
        res.message = '添加日志 token 失败';
        next(error);
    }
});

router.delete('/admin/log-token/:token', adminLogin, async (req, res, next) => {
    try {
        const newTokens = Controller.removeLogToken(req.params.token);
        res.send(newTokens);
    } catch (error) {
        res.error = 'Failed to remove log token';
        res.message = '移除日志 token 失败';
        next(error);
    }
});

router.get('/admin/log/:date', adminLogin, async (req, res, next) => {
    try {
        const logFilePath = path.join(
            Dir.storage.log,
            `${req.params.date}.txt`,
        );
        const log = File.readText(logFilePath);
        res.send(log);
    } catch (error) {
        res.error = 'Failed to access log';
        res.message = '获取日志失败';
        next(error);
    }
});

router.post('/log', weakLogin, async (req, res, next) => {
    try {
        const { token, message } = req.body;

        if (!Controller.isLogTokenValid(token) || !req.isAdmin) {
            return res.status(403).send({
                error: 'Forbidden',
                message: '无权访问',
            });
        }

        const now = new Date();
        const date = dayjs(now).format('YYYY-MM-DD');
        const line = `[${now.toLocaleString()}] ${message}\n`;
        const logFilePath = path.join(Dir.storage.log, `${date}.txt`);
        File.appendText(logFilePath, line);

        res.send({
            success: true,
        });
    } catch (error) {
        res.error = 'Failed to upload log';
        res.message = '提交日志失败';
        next(error);
    }
});

module.exports = { logRouter: router };
