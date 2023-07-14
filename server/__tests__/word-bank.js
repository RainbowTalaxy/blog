/**
 * word-bank 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const fs = require('fs');
const { Dir, APIKey } = require('../config');
const { request, curl } = require('./utils');

const BASE_PATH = '/word-bank';
const BOOKS_DIR = Dir.storage.books;

// 定义一个单词书的测试数据
const book = {
    id: 'some_uuid',
    date: '2023/04/19',
    title: 'some_title',
    words: [
        {
            id: 'some_uuid',
            date: '2023/04/19',
            name: 'word',
            part: 'n',
            def: '单词',
        },
        {
            id: 'some_uuid',
            date: '2023/04/19',
            name: 'word',
            part: 'n',
            def: '单词',
        },
    ],
};

const userId = 'talaxy';

async function test() {
    let token;
    const user = {
        id: userId,
        key: 'talaxy',
    };

    // 用户登录
    await request(
        'User - login',
        curl(`/user/login`, 'POST', user),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            token = response.token;

            resolve();
        },
    );

    const auth = { token };

    // 咱们先测一下上传单词书（未授权）
    await request(
        'Word bank - upload book (unauthorized)',
        curl(`${BASE_PATH}/books`, 'PUT', book),
        (response, resolve, reject) => {
            if (response.error) return resolve();
            reject('Expect "success"');
        },
    );

    // 咱们先测一下上传单词书
    await request(
        'Word bank - upload book',
        curl(`${BASE_PATH}/books`, 'PUT', book, auth),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            // 读取测试数据中的 meta 文件
            let userMeta = fs.readFileSync(
                `${BOOKS_DIR}/${userId}/list-meta.json`,
            );
            userMeta = Object.values(JSON.parse(userMeta));
            if (userMeta.length !== 1) return reject('Expect 1 book');
            const targetBook = userMeta[0];
            // 校验数据是否正确
            if (
                targetBook.id !== book.id ||
                targetBook.title !== book.title ||
                targetBook.date !== book.date
            )
                return reject('Wrong book content');

            // 放行
            resolve();
        },
    );

    // 咱们再测一下获取单词书列表
    await request(
        'Word bank - book list',
        curl(`${BASE_PATH}/books`, 'GET', {
            userId,
        }),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            // 检查返回的数据是否正确
            if (!response.books) return reject('Expect "books"');
            if (response.books.length !== 1) return reject('Expect 1 book');
            let targetBook = response.books[0];
            if (targetBook.id !== book.id) return reject('Wrong book id');
            if (targetBook.title !== book.title)
                return reject('Wrong book title');
            if (targetBook.date !== book.date) return reject('Wrong book date');

            // 放行
            resolve();
        },
    );

    // 咱们再测一下获取单词书详情
    await request(
        'Word bank - book detail',
        curl(`${BASE_PATH}/books/${book.id}`, 'GET', {
            userId,
        }),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            // 检查返回的数据是否正确
            if (!response.book) return reject('Expect "book"');
            if (response.book.id !== book.id) return reject('Wrong book id');
            if (response.book.title !== book.title)
                return reject('Wrong book title');
            if (response.book.date !== book.date)
                return reject('Wrong book date');
            if (!response.book.words) return reject('Expect "words"');
            book.words.forEach((word, index) => {
                if (word.id !== response.book.words[index].id)
                    return reject('Wrong word id');
                if (word.date !== response.book.words[index].date)
                    return reject('Wrong word date');
                if (word.name !== response.book.words[index].name)
                    return reject('Wrong word name');
                if (word.part !== response.book.words[index].part)
                    return reject('Wrong word part');
                if (word.def !== response.book.words[index].def)
                    return reject('Wrong word def');
            });

            // 放行
            resolve();
        },
    );

    // 咱们再测一下删除单词书
    await request(
        'Word bank - delete book',
        curl(`${BASE_PATH}/books/${book.id}`, 'DELETE', null, auth),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            // 读取测试数据中的 meta 文件
            let userMeta = fs.readFileSync(
                `${BOOKS_DIR}/${userId}/list-meta.json`,
            );
            userMeta = Object.values(JSON.parse(userMeta));
            if (userMeta.length !== 0) return reject('Expect 0 book');

            // 放行
            resolve();
        },
    );

    // 测一下获取书本资源的 meta 信息
    await request(
        'Word bank - literary meta',
        curl(`${BASE_PATH}/literary`, 'GET', {
            bookName: 'Harry Potter and the Half-Blood Prince',
        }),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            // 检查返回的数据是否正确
            if (!response) return reject('Expect "meta"');
            if (!response.title) return reject('Expect book title');
            if (!response.chapters) return reject('Expect book chapters');
            // chapters 应当是个数组
            if (!Array.isArray(response.chapters))
                return reject('Expect chapters to be an array');

            // 放行
            resolve();
        },
    );
}

module.exports = test;
