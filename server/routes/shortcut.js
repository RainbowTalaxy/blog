/**
 * # 短链服务 Shortcut
 *
 * ## 需求概要
 *
 * 一个 URL 缩短工具，可以将长链接转换为短链接，支持自定义短链标识和访问统计。
 *
 * ## 模型
 *
 * - 短链 Shortcut
 *   + 短链标识 id
 *   + 原始长链接 url
 *   + 是否为自定义短链标识 isCustom
 *   + 短链名称 name
 *   + 创建时间戳 createdAt
 *   + 访问次数 visits
 *   + 最后访问时间戳 lastVisit
 *
 * ## 数据存储方案
 *
 * - shortcuts 文件下用一个 list.json 文件存储所有短链数据 { [id: string]: Shortcut }
 *
 * ## 接口
 *
 * - 创建短链              POST   /
 * - 获取短链信息          GET    /:shortcutId
 * - 访问短链（重定向）    GET    /:shortcutId/redirect
 * - 更新短链              PUT    /:shortcutId
 * - 删除短链              DELETE /:shortcutId
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { Dir } = require('../config');
const { uuid, readJSON, writeJSON } = require('../utils');
const { adminLogin } = require('../middlewares');
const router = express.Router();

const LIST_PATH = path.join(Dir.storage.shortcuts, 'list.json');

// 内存缓存，避免频繁读写文件
let shortcutListCache = null;

// 初始化数据文件
const FileHandler = {
    // 获取短链列表（优先使用缓存）
    readList: () => {
        if (shortcutListCache !== null) {
            return shortcutListCache;
        }
        if (fs.existsSync(LIST_PATH)) {
            shortcutListCache = readJSON(LIST_PATH) || {};
        } else {
            shortcutListCache = {};
        }
        return shortcutListCache;
    },
    // 写入短链列表（同时更新缓存）
    writeList: (list) => {
        shortcutListCache = list;
        writeJSON(LIST_PATH, list);
    },
    // 重新加载缓存（用于外部文件变更时）
    reloadCache: () => {
        shortcutListCache = null;
        return FileHandler.readList();
    },
};

// 生成随机短链 ID（6位字符）
const generateShortId = () => {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
};

// 验证 URL 格式
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// 验证自定义 ID 格式（3-20位字母/数字/下划线/中划线）
const isValidCustomId = (id) => {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(id);
};

/**
 * GET 获取所有短链列表（管理员）
 */
router.get('/list', adminLogin, (req, res, next) => {
    try {
        const list = FileHandler.readList();
        // 转换为数组并按创建时间倒序排列
        const shortcuts = Object.values(list).sort(
            (a, b) => b.createdAt - a.createdAt,
        );
        res.send(shortcuts);
    } catch (error) {
        res.error = 'Failed to get shortcuts list';
        res.message = '获取短链列表失败';
        next(error);
    }
});

/**
 * GET 获取单个短链信息（管理员）
 * Params: shortcutId
 */
router.get('/info/:shortcutId', adminLogin, (req, res, next) => {
    try {
        const { shortcutId } = req.params;

        const list = FileHandler.readList();
        const shortcut = list[shortcutId];

        if (!shortcut) {
            return res.status(404).send({
                error: 'Shortcut not found',
                message: '短链不存在',
            });
        }

        res.send(shortcut);
    } catch (error) {
        res.error = 'Failed to get shortcut info';
        res.message = '获取短链信息失败';
        next(error);
    }
});

/**
 * POST 创建短链
 * Body: { url: string, customId?: string, name?: string }
 */
router.post('/', adminLogin, (req, res, next) => {
    try {
        const { url, customId, name } = req.body;

        // 验证必填参数
        if (!url) {
            return res.status(400).send({
                error: '`url` is required',
                message: '原始链接不能为空',
            });
        }

        // 验证 URL 格式
        if (!isValidUrl(url)) {
            return res.status(400).send({
                error: '`url` format is invalid',
                message: 'URL 格式不正确',
            });
        }

        // 验证自定义 ID 格式
        if (customId && !isValidCustomId(customId)) {
            return res.status(400).send({
                error: '`customId` format is invalid (3-20 characters, letters/numbers/underscore/hyphen only)',
                message:
                    '自定义短链标识格式不正确（3-20位字母/数字/下划线/中划线）',
            });
        }

        const list = FileHandler.readList();

        // 生成或使用自定义 ID
        let shortcutId;
        if (customId) {
            // 检查自定义 ID 是否已存在
            if (list[customId]) {
                return res.status(400).send({
                    error: '`customId` already exists',
                    message: '该短链标识已被使用',
                });
            }
            shortcutId = customId;
        } else {
            // 生成随机 ID，确保不重复
            do {
                shortcutId = generateShortId();
            } while (list[shortcutId]);
        }

        // 创建短链对象
        const shortcut = {
            id: shortcutId,
            url,
            isCustom: !!customId,
            name: name || undefined,
            createdAt: Date.now(),
            visits: 0,
        };

        // 保存到列表
        list[shortcutId] = shortcut;
        FileHandler.writeList(list);

        res.send(shortcut);
    } catch (error) {
        res.error = 'Failed to create shortcut';
        res.message = '创建短链失败';
        next(error);
    }
});

/**
 * GET 访问短链（重定向）
 * Params: shortcutId
 */
router.get('/:shortcutId', (req, res, next) => {
    try {
        const { shortcutId } = req.params;

        const list = FileHandler.readList();
        const shortcut = list[shortcutId];

        if (!shortcut) {
            return res.status(404).send({
                error: 'Shortcut not found',
                message: '短链不存在',
            });
        }

        // 更新访问统计
        shortcut.visits = (shortcut.visits || 0) + 1;
        shortcut.lastVisit = Date.now();
        list[shortcutId] = shortcut;
        FileHandler.writeList(list);

        // 重定向到原始链接
        res.redirect(shortcut.url);
    } catch (error) {
        res.error = 'Failed to redirect shortcut';
        res.message = '短链重定向失败';
        next(error);
    }
});

/**
 * PUT 更新短链
 * Params: shortcutId
 * Body: { url?: string, name?: string }
 */
router.put('/:shortcutId', adminLogin, (req, res, next) => {
    try {
        const { shortcutId } = req.params;
        const { url, name } = req.body;

        const list = FileHandler.readList();
        const shortcut = list[shortcutId];

        if (!shortcut) {
            return res.status(404).send({
                error: 'Shortcut not found',
                message: '短链不存在',
            });
        }

        // 验证 URL 格式（如果提供）
        if (url !== undefined) {
            if (!url) {
                return res.status(400).send({
                    error: '`url` cannot be empty',
                    message: 'URL 不能为空',
                });
            }
            if (!isValidUrl(url)) {
                return res.status(400).send({
                    error: '`url` format is invalid',
                    message: 'URL 格式不正确',
                });
            }
            shortcut.url = url;
        }

        // 更新名称（允许设为空）
        if (name !== undefined) {
            shortcut.name = name || undefined;
        }

        list[shortcutId] = shortcut;
        FileHandler.writeList(list);

        res.send(shortcut);
    } catch (error) {
        res.error = 'Failed to update shortcut';
        res.message = '更新短链失败';
        next(error);
    }
});

/**
 * DELETE 删除短链
 * Params: shortcutId
 */
router.delete('/:shortcutId', adminLogin, (req, res, next) => {
    try {
        const { shortcutId } = req.params;

        const list = FileHandler.readList();

        if (!list[shortcutId]) {
            return res.status(404).send({
                error: 'Shortcut not found',
                message: '短链不存在',
            });
        }

        delete list[shortcutId];
        FileHandler.writeList(list);

        res.send({ success: true });
    } catch (error) {
        res.error = 'Failed to delete shortcut';
        res.message = '删除短链失败';
        next(error);
    }
});

const shortcutRouter = router;

module.exports = {
    shortcutRouter,
};
