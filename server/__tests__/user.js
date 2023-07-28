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
        key: 'test',
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

    // 列出用户信息（管理员）
    await testCase.pos(' admin list users', async () => {
        const data = await admin.get('/list');
    });
}

module.exports = test;
