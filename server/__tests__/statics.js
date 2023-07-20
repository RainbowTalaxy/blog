/**
 * dictionary 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const { request, curl } = require('./utils');

const BASE_PATH = '/statics';

const testDir = 'assets';

const userId = 'talaxy';

async function test() {
    try {
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

        await request(
            'Statics - root',
            curl(`${BASE_PATH}`, 'GET', null, auth),
            (response, resolve, reject) => {
                if (response.error) return reject('Expect "success"');

                // 放行
                resolve();
            },
        );

        await request(
            'Statics - files',
            curl(`${BASE_PATH}/${testDir}`, 'GET', null, auth),
            (response, resolve, reject) => {
                if (response.error) return reject('Expect "success"');

                // 放行
                resolve();
            },
        );
    } catch {}
}

module.exports = test;
