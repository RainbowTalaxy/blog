/**
 * 我将写一些 API ，用来支持我开发的记单词应用
 *
 * 这个单词应用本身的大致功能有：
 * 1. 创建单词书
 * 2. 在单词书中添加单词
 *
 * 这里涉及两种类型，Book 和 Word ，它们都有一个 id 属性
 *
 * 这个应用现在有一个功能需要后端支持，这是功能细节：
 * - 后端需要指定一个目录，用来存放用户上传的单词书
 * - 将本地的单词书以 JSON 格式传到服务器，服务器会将 JSON 存到指定目录的目标用户的目录下，JSON 文件名即为单词书的 id
 * - 应用能够获取目标用户的单词书列表（即目录下的所有 JSON 文件名）
 * - 应用能够获取目标单词书的单词列表（即 JSON 文件内容）
 *
 * 下面开始写 API 吧！
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const { mkdirp } = require('mkdirp');
const path = require('path');
const { Dir, Statics, APIKey } = require('../config');
const { default: axios } = require('axios');
const { authority } = require('../middlewares');

const BOOKS_DIR = Dir.storage.books;

// 用来存放用户上传的单词书的目录
mkdirp.sync(BOOKS_DIR);

// 错误日志的文件路径
const errorLogPath = path.join(BOOKS_DIR, 'error.log');

// 用户文件夹元数据文件
const USER_META_FILE = 'list-meta.json';

// 往错误日志文件中写入错误信息
const logError = (error) => {
    if (!error) return;
    console.error(error);
    // 如果错误日志文件不存在，则创建
    if (!fs.existsSync(errorLogPath)) {
        fs.writeFileSync(errorLogPath, '');
    }
    fs.appendFileSync(errorLogPath, error.toString() ?? '');
};

// 给定用户 id ，返回该用户的单词书目录，如果不存在则创建
const getUserDir = (userId) => {
    const userDir = path.join(BOOKS_DIR, userId);
    mkdirp.sync(userDir);
    return userDir;
};

// 在指定目录下创建一个 JSON 文件，文件名为 id ，内容为 book
const updateBook = (userDir, book) => {
    const bookPath = path.join(userDir, `${book.id}.json`);
    fs.writeFileSync(bookPath, JSON.stringify(book));
};

// 用户上传单词书
router.put('/books/:userId', authority(APIKey.file), async (req, res) => {
    try {
        // 获取 userId
        const { userId } = req.params;
        // 获取请求的 body
        const book = req.body;
        if (!book.id) {
            return res.status(400).send({
                error: 'The book id is required.',
            });
        }
        // 获取用户的单词书目录
        const userDir = getUserDir(userId);
        // 更新单词书
        updateBook(userDir, book);
        // 读取用户文件夹元数据内容
        const userMetaPath = path.join(userDir, USER_META_FILE);
        let userMeta = {};
        if (fs.existsSync(userMetaPath)) {
            userMeta = JSON.parse(fs.readFileSync(userMetaPath));
        }
        // 更新用户文件夹元数据
        userMeta[book.id] = { id: book.id, date: book.date, title: book.title };
        // 写入用户文件夹元数据
        fs.writeFileSync(userMetaPath, JSON.stringify(userMeta));
        // 返回成功
        res.status(200).send({
            message: 'success',
        });
    } catch (error) {
        // 记录错误
        logError(error);
        res.status(500).send({
            error: 'An error occurred while updating the book.',
        });
    }
});

// 获取用户的单词书列表
router.get('/books/:userId', async (req, res) => {
    try {
        // 获取请求参数
        const { userId } = req.params;
        // 获取用户的单词书目录
        const userDir = getUserDir(userId);
        // 读取用户文件夹元数据内容
        const userMetaPath = path.join(userDir, USER_META_FILE);
        let userMeta = {};
        if (fs.existsSync(userMetaPath)) {
            userMeta = JSON.parse(fs.readFileSync(userMetaPath));
        }
        // 返回用户文件夹元数据
        res.status(200).send({
            // [id, { id, date, title }]
            books: Object.values(userMeta),
        });
    } catch (error) {
        // 记录错误
        logError(error);
        res.status(500).send({
            error: 'An error occurred while getting the book list.',
        });
    }
});

// 获取单词书信息
router.get('/books/:userId/:bookId', async (req, res) => {
    try {
        // 获取请求参数
        const { userId, bookId } = req.params;
        // 获取用户的单词书目录
        const userDir = getUserDir(userId);
        // 获取该目录下的所有文件名
        const bookPath = path.join(userDir, `${bookId}.json`);
        // 读取文件内容
        const book = JSON.parse(fs.readFileSync(bookPath));
        // 返回文件名列表
        res.status(200).send({
            book,
        });
    } catch (error) {
        // 记录错误
        logError(error);
        res.status(500).send({
            error: 'An error occurred while getting the book content.',
        });
    }
});

/**
 * 新模块：书籍资源封装
 * 服务器端有个书本资源，url 为 `https://blog.talaxy.cn/statics/books`。其中：
 *      - 每一本书都是一个文件夹，文件夹名就是书名；
 *      - 文件夹下有一个 `meta.json` 文件，它包含了书籍信息和每个章节的标题；
 *      - 对于每个章节，文件夹下有个对应章节的 txt 文件，文件名即为章节标题。
 */

const BOOKS_STATIC_URL = `${Statics}/books`;

// 写一个接口，它接收一个书籍名，返回书籍的元数据
router.get('/literary', async (req, res) => {
    try {
        // 获取书籍名，他是 query 参数
        let { bookName } = req.query;
        // 获取书籍元数据
        const { data: bookMeta } = await axios.get(
            `${BOOKS_STATIC_URL}/${bookName}/meta.json`,
        );
        bookMeta.chapters = bookMeta.chapters.map((chapter) => ({
            title: chapter,
            resource: `${BOOKS_STATIC_URL}/${bookName}/${chapter}.txt`,
        }));
        // 返回书籍元数据
        res.status(200).send(bookMeta);
    } catch (error) {
        // 记录错误
        logError(error);
        res.status(500).send({
            error: 'An error occurred while getting the literary meta.',
        });
    }
});

module.exports = { wordBankRouter: router };

// 谢谢 Copilot 的帮助，这里的代码是 Copilot 自动写的，我只是稍微修改了一下
