/**
 * dictionary 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const { Server } = require('../config');
const { Rocket, testCase } = require('./utils');

const testDir = 'assets';

async function test() {
    const rocket = new Rocket(Server + '/statics');
    await rocket.login('talaxy', 'talaxy');

    await testCase.pos('[Statics] list', async () => {
        await rocket.get('/');
    });

    await testCase.pos('[Statics] target list', async () => {
        await rocket.get(`/${testDir}`);
    });
}

module.exports = test;
