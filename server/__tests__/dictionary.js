/**
 * dictionary 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const { request, curl } = require('./utils');

const BASE_PATH = '/dictionary';

const text = 'government’s';

async function test() {
    try {
        await request(
            'Dictionary - query',
            curl(`${BASE_PATH}`, 'GET', {
                word: text,
            }),
            (response, resolve, reject) => {
                if (response.error) return reject('Expect "success"');

                // 放行
                resolve();
            },
        );
    } catch (error) {
        console.log(error);
    }
}

test();
