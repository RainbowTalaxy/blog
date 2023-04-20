/**
 * word-bank 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const { exec } = require('child_process');
const { LOCAL_SERVER_URL } = require('../constants');

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

// 咱们先测一下上传单词书
exec(
    `curl -X PUT ${BASE_PATH}/books \
    -H 'Content-Type: application/json' \
    -d '${JSON.stringify(uploadData)}' \
    `,
    (error, stdout, stderr) => {
        const response = JSON.parse(stdout);
        // 如果 message 不是 "success"
        if (response.message !== 'success')
            return console.error(
                '[WordBook upload]: Wrong response: expect "success"',
            );
        console.log('[WordBook upload]: OK');
    },
);
