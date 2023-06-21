/**
 * user 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const { request, curl } = require('./utils');
const { uuid } = require('../utils');

const BASE_PATH = '/user';

const admin = {
    id: 'talaxy',
    key: 'talaxy',
};

async function test() {
    let generateToken;

    const userId = 'allay';

    // 用管理员身份生成一个 token
    await request(
        'User - generate token',
        curl(`${BASE_PATH}/token`, 'POST', { id: userId }, admin),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            generateToken = response;

            resolve();
        },
    );

    const userKey = 'test';

    // 用户使用假的 token 登记信息
    await request(
        'User - register',
        curl(`${BASE_PATH}/register`, 'POST', {
            ...generateToken,
            key: userKey,
            token: uuid(),
        }),
        (response, resolve, reject) => {
            if (!response.error) return reject('Expect "error"');

            resolve();
        },
    );

    // 用户使用 token 登记信息
    await request(
        'User - register',
        curl(`${BASE_PATH}/register`, 'POST', {
            ...generateToken,
            key: userKey,
        }),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 用户身份生成 token
    await request(
        'User - generate token',
        curl(
            `${BASE_PATH}/token`,
            'POST',
            { id: userId },
            { id: userId, key: userKey },
        ),
        (response, resolve, reject) => {
            if (!response.error) return reject('Expect "error"');

            resolve();
        },
    );
}

module.exports = test;
