const { Server } = require('../config');
const { Rocket, TestCase } = require('../utils/test');

const testDir = 'assets';

async function test() {
    const testCase = new TestCase('Statics');

    const rocket = new Rocket(Server + '/statics');
    await rocket.login('talaxy', 'talaxy');

    // 获取静态资源列表
    await testCase.pos('list', async () => {
        await rocket.get('/');
    });

    // 获取指定静态资源
    await testCase.pos('target list', async () => {
        await rocket.get(`/${testDir}`);
    });

    // 获取非法的静态资源路径
    await testCase.neg('invalid path', async () => {
        await rocket.get('/../invalid');
    });

    return testCase.stat();
}

module.exports = test;
