const { TestCase, Rocket } = require('./utils');
const { uuid } = require('../utils');
const { Server } = require('../config');

async function test() {
    const testCase = new TestCase('User');

    const adminInfo = {
        id: 'talaxy',
        key: 'talaxy',
    };

    const userInfo = {
        id: 'test',
        key: 'test_key',
    };

    const admin = new Rocket(Server + '/user');
    await admin.login(adminInfo.id, adminInfo.key);
    const user = new Rocket(Server + '/user');

    // 测试登录
    await testCase.pos('test login', async () => {
        const data = await admin.get('/test');
        if (data.id !== adminInfo.id) throw new Error('Expect "id"');
    });

    // 管理员生成 token
    const generatedToken = await testCase.pos(
        'admin generate token',
        async () => {
            return await admin.post('/token', {
                id: userInfo.id,
            });
        },
    );

    // 用户使用假 token 登记信息
    await testCase.neg('user register by fake token', async () => {
        await user.post('/register', {
            ...userInfo,
            token: uuid(),
        });
    });

    // 用户使用过短的 key 登记信息
    await testCase.neg('user register by too short key length', async () => {
        await user.post('/register', {
            ...userInfo,
            key: '12345',
            token: uuid(),
        });
    });

    // 用户使用 token 登记信息
    await testCase.pos('user register by token', async () => {
        await user.post('/register', {
            ...userInfo,
            token: generatedToken.token,
        });
    });

    await user.login(userInfo.id, userInfo.key);

    // 用户生成 token
    await testCase.neg('user generate token', async () => {
        await user.post('/token', {
            id: 'someone',
        });
    });

    // 更改 key 流程

    // 管理员再次生成 token 用于更改 key
    const generatedToken2 = await testCase.pos(
        'admin generate token',
        async () => {
            return await admin.post('/token', {
                id: userInfo.id,
            });
        },
    );

    const newUserInfo = {
        id: 'test',
        key: 'another_key',
    };

    // 用户使用 token 登记信息
    await testCase.pos('user register by token', async () => {
        await user.post('/register', {
            ...newUserInfo,
            token: generatedToken2.token,
        });
    });

    // 用户用旧账号登录
    await testCase.neg('user old key login', async () => {
        await user.get('/test');
    });

    await user.login(newUserInfo.id, newUserInfo.key);

    // 用户用新账号登录
    await testCase.pos('user new key login', async () => {
        await user.get('/test');
    });

    // 列出用户信息（管理员）
    await testCase.pos('admin list users', async () => {
        await admin.get('/list');
    });
}

module.exports = test;
