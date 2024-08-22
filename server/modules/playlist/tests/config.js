const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Playlist - config', true);

    const baseUrl = Server + '/playlist';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');
    const visitor = new Rocket(Server + '/playlist');

    // ## GET /playlist/config

    // 获取配置
    await testCase.pos('get playlist config', async () => {
        const config = await talaxy.get('/config');
        Assert.props(config, PropList.config);
    });

    // 获取配置 - 游客
    await testCase.pos('get playlist config - no admin', async () => {
        await visitor.get('/config');
    });

    // ## PUT /playlist/config

    // 更新配置
    await testCase.pos('put playlist config', async () => {
        const original = await talaxy.get('/config');
        const data = {
            version: '1.2.3',
            resourcePrefix: 'https://some.prefix.com',
        };
        const config = await talaxy.put('/config', data);
        Assert.props(config, PropList.config);
        Assert.expect(config.version, original.version);
        Assert.expect(config.resourcePrefix, data.resourcePrefix);
    });

    // 更新配置 - 游客
    await testCase.neg('put playlist config - no admin', async () => {
        await visitor.put('/config', {});
    });

    return testCase;
}

module.exports = test;
