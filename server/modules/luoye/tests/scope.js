const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { Scope } = require('../constants');
const Controller = require('../controllerV2');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Luoye - Scope');

    const baseUrl = Server + '/luoye';
    const user = new Rocket(baseUrl);
    await user.login('talaxy', 'talaxy');
    const visitor = new Rocket(baseUrl);
    await visitor.login('allay', 'allay');
    const noLogin = new Rocket(baseUrl);

    await testCase.pos('workspace scope - public', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
            scope: Scope.Public,
        });
        Assert.expect(workspace.scope, Scope.Public);
        let body;
        // 获取工作区信息
        await user.get(`/workspace/${workspace.id}`);
        await visitor.get(`/workspace/${workspace.id}`);
        await noLogin.get(`/workspace/${workspace.id}`);
        // 更新工作区信息
        body = {};
        await user.put(`/workspace/${workspace.id}`, body);
        await visitor.negPut(`/workspace/${workspace.id}`, body);
        // 创建文档
        body = {
            workspaceId: workspace.id,
        };
        await user.post('/doc', body);
        await visitor.negPost('/doc', body);
    });

    Controller.clear();
}

module.exports = test;
