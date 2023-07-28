/**
 * dictionary 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const { Server } = require('../config');
const { Rocket, TestCase } = require('./utils');

const testDir = 'assets';

async function test() {
    const testCase = new TestCase('Statics');

    const rocket = new Rocket(Server + '/statics');
    await rocket.login('talaxy', 'talaxy');

    await testCase.pos('list', async () => {
        await rocket.get('/');
    });

    await testCase.pos('target list', async () => {
        await rocket.get(`/${testDir}`);
    });
}

module.exports = test;
