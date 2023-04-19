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
const path = require('path');

// 用来存放用户上传的单词书的目录
const booksDir = 'temp/books';
// 错误日志的文件路径
const errorLogPath = booksDir + '/error.log';

// 往错误日志文件中写入错误信息
const logError = (error) => {
    console.error(error);
    fs.appendFileSync(errorLogPath, error);
};

// 给定用户 id ，返回该用户的单词书目录，如果不存在则创建
const getUserDir = (userId) => {
    const dir = path.join(booksDir, userId);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
};

// 在指定目录下创建一个 JSON 文件，文件名为 id ，内容为 book
const updateBook = (userDir, book) => {
    const bookPath = path.join(userDir, `${book.id}.json`);
    // 如果文件不存在，则创建
    if (!fs.existsSync(bookPath)) {
        fs.writeFileSync(bookPath, JSON.stringify(book));
    }
    // 以覆盖的方式往 filePath 写入 book 数据
    fs.writeFileSync(bookPath, JSON.stringify(book));
};

// 用户上传单词书
router.put('/books', async (req, res) => {
    try {
        // 获取请求的 body
        const { userId, book } = req.body;
        // 获取用户的单词书目录
        const userDir = getUserDir(userId);
        // 更新单词书
        updateBook(userDir, book);
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
router.get('/books', async (req, res) => {
    try {
        // 获取请求的 query
        const { userId } = req.query;
        // 获取用户的单词书目录
        const userDir = getUserDir(userId);
        // 获取该目录下的所有文件名
        const fileNames = fs.readdirSync(userDir);
        // 过滤掉非 JSON 文件
        const jsonFileNames = fileNames
            .filter((fileName) => {
                return fileName.endsWith('.json');
            })
            .map((fileName) => {
                return fileName.replace('.json', '');
            });
        // 返回文件名列表
        res.status(200).send({
            books: jsonFileNames,
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
router.get('/books/:bookId', async (req, res) => {
    try {
        // 获取请求的 query
        const { userId } = req.query;
        // 获取请求的 params
        const { bookId } = req.params;
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
    } catch {
        // 记录错误
        logError(error);
        res.status(500).send({
            error: 'An error occurred while getting the book content.',
        });
    }
});

module.exports = router;

// 谢谢 Copilot 的帮助，这里的代码是 Copilot 自动写的，我只是稍微修改了一下

// 帮我写一些 curl 的命令，用来测试一下这些 API

// 这是一个 Book 的示例
const book = {
    id: 'some_uuid',
    date: '2023/04/19',
    title: 'some_title',
    words: [
        {
            id: 'some_uuid',
            date: '2023/04/19',
            name: 'word',
            partOfSpeech: 'n',
            definition: '单词',
        },
        {
            id: 'some_uuid',
            date: '2023/04/19',
            name: 'word',
            partOfSpeech: 'n',
            definition: '单词',
        },
    ],
};

// 上传单词书
const uploadBookScript = `
curl -X PUT \
    http://localhost:4000/word-bank/books \
    -H 'Content-Type: application/json' \
    -d '{
        "userId": "some_user_id",
        "book": {
            "id": "some_uuid",
            "date": "2023/04/19",
            "title": "some_title",
            "words": [
                {
                    "id": "some_uuid",
                    "date": "2023/04/19",
                    "name": "word",
                    "partOfSpeech": "n",
                    "definition": "单词"
                },
                {
                    "id": "some_uuid",
                    "date": "2023/04/19",
                    "name": "word",
                    "partOfSpeech": "n",
                    "definition": "单词"
                }
            ]
        }
    }'
`;

// 获取单词书列表
const getBookListScript = `
curl -X GET \
    'http://localhost:4000/word-bank/books?userId=some_user_id' \
    -H 'Content-Type: application/json'
`;

// 获取单词书内容
const getBookContentScript = `
curl -X GET \
    'http://localhost:4000/word-bank/books/some_uuid?userId=some_user_id' \
    -H 'Content-Type: application/json'
`;
