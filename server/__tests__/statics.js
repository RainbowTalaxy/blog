/**
 * dictionary 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const { request, curl } = require('./utils');

const BASE_PATH = '/statics';

const testDir = 'assets';

async function test() {
    try {
        await request(
            'Statics - root',
            curl(`${BASE_PATH}`, 'GET'),
            (response, resolve, reject) => {
                if (response.error) return reject('Expect "success"');

                // 放行
                resolve();
            },
        );

        await request(
            'Statics - files',
            curl(`${BASE_PATH}/${testDir}`, 'GET'),
            (response, resolve, reject) => {
                if (response.error) return reject('Expect "success"');

                // 放行
                resolve();
            },
        );
    } catch {}
}

module.exports = test;
