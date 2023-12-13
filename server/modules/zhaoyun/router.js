const express = require('express');
const Controller = require('./controller');
const { login } = require('../../middlewares');
const router = express.Router();

// 获取比赛所有信息
router.get('/statistics', (req, res, next) => {
    try {
        const statistics = Controller.statistics.content;
        return res.send(statistics);
    } catch (error) {
        res.error = 'Failed to get statistics';
        res.message = '获取统计数据失败';
        next(error);
    }
});

// 获取比赛日信息
router.get('/match-day/:matchDayId', login, (req, res, next) => {
    try {
        const { matchDayId } = req.params;
        const matchDay = Controller.matchDay.ctr(matchDayId);
        if (!matchDay) {
            return res.status(404).send({
                error: 'Match day not found',
                message: '比赛日不存在',
            });
        }
        return res.send(matchDay.content);
    } catch (error) {
        res.error = 'Failed to get match day';
        res.message = '获取比赛日失败';
        next(error);
    }
});

// 创建比赛日
router.post('/match-day', login, (req, res, next) => {
    try {
        const userId = req.userId;
        const { date, description, matches } = req.body;
        if (!date) {
            return res.status(400).send({
                error: '`date` is required',
                message: '日期不能为空',
            });
        }
        if (description === undefined) {
            return res.status(400).send({
                error: '`description` is required',
                message: '描述信息不能为空',
            });
        }
        if (!matches) {
            return res.status(400).send({
                error: '`matches` is required',
                message: '比赛信息不能为空',
            });
        }
        const matchDay = Controller.matchDay.add(
            {
                date,
                description: description,
                matches: matches,
            },
            userId,
        );
        return res.send(matchDay);
    } catch (error) {
        res.error = 'Failed to add match day';
        res.message = '添加比赛日失败';
        next(error);
    }
});

// 更新比赛日
router.put('/match-day/:matchDayId', login, (req, res, next) => {
    try {
        const userId = req.userId;
        const { matchDayId } = req.params;
        const { date, description, matches } = req.body;
        if (!date) {
            return res.status(400).send({
                error: '`date` is required',
                message: '日期不能为空',
            });
        }
        if (description === undefined) {
            return res.status(400).send({
                error: '`description` is required',
                message: '描述信息不能为空',
            });
        }
        if (!matches) {
            return res.status(400).send({
                error: '`matches` is required',
                message: '比赛信息不能为空',
            });
        }
        const matchDay = Controller.matchDay.ctr(matchDayId);
        if (!matchDay) {
            return res.status(404).send({
                error: 'Match day not found',
                message: '比赛日不存在',
            });
        }
        const newMatchDay = matchDay.update(
            {
                date,
                description: description,
                matches: matches,
            },
            userId,
        );
        return res.send(newMatchDay);
    } catch (error) {
        res.error = 'Failed to update match day';
        res.message = '更新比赛日失败';
        next(error);
    }
});

// 删除比赛日
router.delete('/match-day/:matchDayId', login, (req, res, next) => {
    try {
        const userId = req.userId;
        const { matchDayId } = req.params;
        const matchDay = Controller.matchDay.ctr(matchDayId);
        if (!matchDay) {
            return res.status(404).send({
                error: 'Match day not found',
                message: '比赛日不存在',
            });
        }
        matchDay.remove(userId);
        return res.send({
            success: true,
        });
    } catch (error) {
        res.error = 'Failed to delete match day';
        res.message = '删除比赛日失败';
        next(error);
    }
});

module.exports = router;
