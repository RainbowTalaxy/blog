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
        'User - generate token (admin)',
        curl(`${BASE_PATH}/token`, 'POST', { id: userId }, admin),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            generateToken = response;

            resolve();
        },
    );

    const userKey = 'test';

    const user = {
        ...generateToken,
        key: userKey,
    };

    // 用户使用假的 token 登记信息
    await request(
        'User - register (fake)',
        curl(`${BASE_PATH}/register`, 'POST', {
            ...user,
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
        curl(`${BASE_PATH}/register`, 'POST', user),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 列出用户信息（管理员）
    await request(
        'User - list (admin)',
        curl(`${BASE_PATH}/list`, 'GET', {}, admin),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 列出用户信息（非管理员）
    await request(
        'User - list (user)',
        curl(`${BASE_PATH}/list`, 'GET', {}, user),
        (response, resolve, reject) => {
            if (!response.error) return reject('Expect "error"');

            resolve();
        },
    );

    // 用户身份生成 token
    await request(
        'User - generate token (user)',
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

    let token;

    // 用户登录
    await request(
        'User - login',
        curl(`${BASE_PATH}/login`, 'POST', admin),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            token = response.token;

            resolve();
        },
    );

    // 用户登录检验
    await request(
        'User - login test',
        curl(`${BASE_PATH}/test`, 'GET', {}, null, { token }),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            if (response.id !== admin.id) return reject('Expect "id"');

            resolve();
        },
    );
}

module.exports = test;
