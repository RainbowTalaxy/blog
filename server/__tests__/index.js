/**
 * 我准备写一些测试用例，我希望这个文件先测一些测试接口，然后引入其他测试文件执行测试
 *
 * 我打算简单地跑 curl 命令，然后检查返回值
 */

const { LOCAL_SERVER_URL } = require('../constants');
const { request, cmd } = require('../utils');

async function test() {
    // 清除 temp 目录的内容
    await cmd('rm -rf temp/*');

    // 咱们先测一下 echo 接口
    await request(
        'Hello',
        `curl -X POST ${LOCAL_SERVER_URL}/echo \
        -H 'Content-Type: application/json' \
        -d '{"data": "hello"}' \
        `,
        (response, resolve, reject) => {
            if (response?.data !== 'hello') return reject('Expect "hello');
            // 放行
            resolve();
        },
    );

    // 跑子测试
    await require('./word-bank');
}

test();
