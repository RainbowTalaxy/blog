/**
 * 我准备写一些测试用例，我希望这个文件先测一些测试接口，然后引入其他测试文件执行测试
 *
 * 我打算简单地跑 curl 命令，然后检查返回值
 */

const fs = require('fs');
const { request, cmd, curl } = require('./utils');
const wordBank = require('./word-bank');
const dictionary = require('./dictionary');
const statics = require('./statics');
const weaver = require('./weaver');

async function test() {
    try {
        // 咱们先测一下 echo 接口
        await request(
            'Echo',
            curl('/echo', 'POST', { data: 'hello' }),
            (response, resolve, reject) => {
                if (response?.data !== 'hello') return reject('Expect "hello"');
                // 放行
                resolve();
            },
        );

        // word-bank 测试
        await wordBank();

        // dictionary 测试
        await dictionary();

        // statics 测试
        await statics();

        // weaver 测试
        await weaver();
    } catch (error) {
        console.log(error);
    }
}

test();
