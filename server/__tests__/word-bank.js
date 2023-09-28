const { Dir, Server } = require('../config');
const { readJSON } = require('../utils');
const { Rocket, TestCase } = require('../utils/test');

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
    const testCase = new TestCase('WordBank');

    const rocket = new Rocket(Server + '/word-bank');
    await rocket.login(userId, 'talaxy');

    // 获取书本资源的 meta 信息
    await testCase.pos('literary meta', async () => {
        const data = await rocket.get('/literary', {
            bookName: 'Harry Potter and the Half-Blood Prince',
        });

        // 检查返回的数据是否正确
        if (!data) throw new Error('Expect "meta"');
        if (!data.title) throw new Error('Expect book title');
        if (!data.chapters) throw new Error('Expect book chapters');
        // chapters 应当是个数组
        if (!Array.isArray(data.chapters))
            throw new Error('Expect chapters to be an array');
    });

    // 上传单词书
    await testCase.pos('upload book', async () => {
        await rocket.put('/books', book);

        // 读取测试数据中的 meta 文件
        let userMeta = Object.values(
            readJSON(`${BOOKS_DIR}/${userId}/list-meta.json`),
        );
        if (userMeta.length !== 1) return reject('Expect 1 book');
        const targetBook = userMeta[0];
        // 校验数据是否正确
        if (
            targetBook.id !== book.id ||
            targetBook.title !== book.title ||
            targetBook.date !== book.date
        )
            throw new Error('Wrong book content');
    });

    // 获取单词书列表
    await testCase.pos('book list', async () => {
        const data = await rocket.get('/books', { userId });

        // 检查返回的数据是否正确
        if (!data.books) throw new Error('Expect "books"');
        if (data.books.length !== 1) throw new Error('Expect 1 book');
        let targetBook = data.books[0];
        if (targetBook.id !== book.id) throw new Error('Wrong book id');
        if (targetBook.title !== book.title)
            throw new Error('Wrong book title');
        if (targetBook.date !== book.date) throw new Error('Wrong book date');
    });

    // 获取单词书详情
    await testCase.pos('book detail', async () => {
        const data = await rocket.get(`/books/${book.id}`, { userId });

        // 检查返回的数据是否正确
        if (!data.book) throw new Error('Expect "book"');
        if (data.book.id !== book.id) throw new Error('Wrong book id');
        if (data.book.title !== book.title) throw new Error('Wrong book title');
        if (data.book.date !== book.date) throw new Error('Wrong book date');
        if (!data.book.words) throw new Error('Expect "words"');
        book.words.forEach((word, index) => {
            if (word.id !== data.book.words[index].id)
                throw new Error('Wrong word id');
            if (word.date !== data.book.words[index].date)
                throw new Error('Wrong word date');
            if (word.name !== data.book.words[index].name)
                throw new Error('Wrong word name');
            if (word.part !== data.book.words[index].part)
                throw new Error('Wrong word part');
            if (word.def !== data.book.words[index].def)
                throw new Error('Wrong word def');
        });
    });

    // 删除单词书
    await testCase.pos('delete book', async () => {
        await rocket.delete(`/books/${book.id}`);

        // 读取测试数据中的 meta 文件
        let userMeta = Object.values(
            readJSON(`${BOOKS_DIR}/${userId}/list-meta.json`),
        );
        if (userMeta.length !== 0) return reject('Expect 0 book');
    });

    return testCase.stat();
}

module.exports = test;
