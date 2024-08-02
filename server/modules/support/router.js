const File = require('../../utils/file');
const { Dir } = require('../../config');
const { adminLogin, weakLogin } = require('../../middlewares');
const { readJSON, uuid, writeJSON } = require('../../utils');
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
    /**
     * 读取日志
     * @param {string} date 格式 'YYYY-MM-DD'
     * @returns
     */
    readLog(date) {
        const logFilePath = path.join(Dir.storage.log, `${date}.txt`);
        return File.readText(logFilePath);
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

router.post('/admin/log-token', adminLogin, async (req, res, next) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).send({
                error: 'Bad Request',
                message: '缺少标题',
            });
        }

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
    const { date } = req.params;

    if (date.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
        return res.status(400).send({
            error: 'Bad Request',
            message: '日期格式错误',
        });
    }
    try {
        const log = Controller.readLog(date);
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

        if (!Controller.isLogTokenValid(token) && !req.isAdmin) {
            return res.status(403).send({
                error: 'Forbidden',
                message: '无权访问',
            });
        }

        if (!message) {
            return res.status(400).send({
                error: 'Bad Request',
                message: '缺少日志内容',
            });
        }

        const now = new Date();
        const date = dayjs(now).format('YYYY-MM-DD');
        const content = message
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => `[${now.toLocaleString()}] ${line}\n`)
            .join('');
        const logFilePath = path.join(Dir.storage.log, `${date}.txt`);
        File.appendText(logFilePath, content);

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
