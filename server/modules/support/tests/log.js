const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const dayjs = require('dayjs');

async function test() {
    const testCase = new TestCase('Support - log', true);

    const baseUrl = Server + '/support';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');
    const allay = new Rocket(baseUrl);
    await allay.login('allay', 'allay');
    const visitor = new Rocket(baseUrl);

    const today = dayjs().format('YYYY-MM-DD');

    // ## POST `/admin/log-token`

    // 创建新的日志权限 - 缺少标题
    await testCase.neg('create new log token - wrong params', async () => {
        await talaxy.post(`/admin/log-token`, {
            title: '',
        });
    });

    // 创建新的日志权限 - 非管理员
    await testCase.neg('create new log token - not admin', async () => {
        await allay.post(`/admin/log-token`, {
            title: 'test',
        });
        await visitor.post(`/admin/log-token`, {
            title: 'test',
        });
    });

    // 创建新的日志权限 - 管理员
    const testLogTokenTitle = '测试日志权限 1';
    const logToken = await testCase.pos('create new log token', async () => {
        const logTokens = await talaxy.post(`/admin/log-token`, {
            title: testLogTokenTitle,
        });
        Assert.array(logTokens, 1);
        Assert.props(logTokens[0], ['title', 'token']);
        Assert.expect(logTokens[0].title, testLogTokenTitle);
        return logTokens[0].token;
    });

    // ## GET `/admin/log-tokens`

    // 获取日志权限列表
    await testCase.pos('get log tokens', async () => {
        const logTokens = await talaxy.get(`/admin/log-tokens`);
        Assert.array(logTokens, 1);
        Assert.props(logTokens[0], ['title', 'token']);
        Assert.expect(logTokens[0].title, testLogTokenTitle);
        Assert.expect(logTokens[0].token, logToken);
    });

    // 获取日志权限列表 - 非管理员
    await testCase.neg('get log tokens - not admin', async () => {
        await allay.get(`/admin/log-tokens`);
        await visitor.get(`/admin/log-tokens`);
    });

    // ## POST `/log`

    // 添加日志 - 缺少内容
    await testCase.neg('add log - wrong params', async () => {
        await visitor.post(`/log`, {
            token: logToken,
            message: '',
        });
    });

    // 添加日志 - 无权限
    await testCase.neg('add log - no admin', async () => {
        await allay.post(`/log`, {
            message: 'test log',
        });
        await visitor.post(`/log`, {
            message: 'test log',
        });
    });

    // 添加日志 & 查看日志 - 管理员 & 日志权限
    await testCase.pos('add log - admin or log token', async () => {
        const message = 'test log';
        await talaxy.post(`/log`, { message });

        const message2 = 'test log 2';
        const message2p = 'test log 2 second line';
        await allay.post(`/log`, {
            message: message2 + '\n' + message2p,
            token: logToken,
        });

        const message3 = 'test log 3';
        await visitor.post(`/log`, { message: message3, token: logToken });

        const logs = (await talaxy.get(`/admin/log/${today}`)).split('\n');

        const checkLog = (message, log) => {
            if (
                log.match(new RegExp(`^\\[[0-9:\\- /]*\\] ${message}$`)) ===
                null
            )
                throw new Error(`Log not found: ${message}`);
        };

        checkLog(message, logs[0]);
        checkLog(message2, logs[1]);
        checkLog(message2p, logs[2]);
        checkLog(message3, logs[3]);
    });

    // ## GET `/admin/log/:date`

    // 获取日志 - 日期格式错误
    await testCase.neg('get log - wrong date', async () => {
        await talaxy.get(`/admin/log/test`);
    });

    // 获取日志 - 管理员
    await testCase.pos('get log', async () => {
        await talaxy.get(`/admin/log/${today}`);
    });

    // 获取日志 - 非管理员
    await testCase.neg('get log - not admin', async () => {
        await allay.get(`/admin/log/${today}`);
        await visitor.get(`/admin/log/${today}`);
    });

    // ## DELETE `/admin/log-token`

    // 移除日志权限 - 非管理员
    await testCase.neg(`remove log token - not admin`, async () => {
        await allay.delete(`/admin/log-token/${logToken}`);
        await visitor.delete(`/admin/log-token/${logToken}`);
    });

    // 移除日志权限 - 管理员
    await testCase.pos(`remove log token`, async () => {
        const logTokens = await talaxy.delete(`/admin/log-token/${logToken}`);
        Assert.array(logTokens, 0);
    });

    return testCase;
}

module.exports = test;
