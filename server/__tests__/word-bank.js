/**
 * word-bank 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const fs = require('fs');
const { LOCAL_SERVER_URL, BOOKS_DIR } = require('../constants');
const { request } = require('../utils');

const BASE_PATH = `${LOCAL_SERVER_URL}/word-bank`;

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

const uploadData = {
    userId: 'some_user_id',
    book,
};

async function test() {
    try {
        // 咱们先测一下上传单词书
        await request(
            'Word bank - upload',
            `curl -X PUT ${BASE_PATH}/books \
    -H 'Content-Type: application/json' \
    -d '${JSON.stringify(uploadData)}' \
    `,
            (response, resolve, reject) => {
                if (response.error) return reject('Expect "success"');

                // 放行
                resolve();
            },
        );

        // 咱们再测一下获取单词书列表
        await request(
            'Word bank - list',
            `curl -X GET ${BASE_PATH}/books/${uploadData.userId}`,
            (response, resolve, reject) => {
                if (response.error) return reject('Expect "success"');

                // 读取测试数据中的 meta 文件
                let userMeta = fs.readFileSync(
                    `${BOOKS_DIR}/${uploadData.userId}/list-meta.json`,
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
    } catch {}
}

test();
