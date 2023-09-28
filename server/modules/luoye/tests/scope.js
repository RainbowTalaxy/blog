const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { Scope } = require('../constants');
const Controller = require('../controller');

async function test() {
    const testCase = new TestCase('Luoye - Scope', true);

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
        await noLogin.negPut(`/workspace/${workspace.id}`, body);

        // 创建文档
        body = {
            workspaceId: workspace.id,
        };
        await user.post('/doc', body);
        await visitor.negPost('/doc', body);
        await noLogin.negPost('/doc', body);

        // 删除工作区
        await noLogin.negDelete(`/workspace/${workspace.id}`);
        await visitor.negDelete(`/workspace/${workspace.id}`);
        await user.delete(`/workspace/${workspace.id}`);
    });

    await testCase.pos('workspace scope - private', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
            scope: Scope.Private,
        });
        Assert.expect(workspace.scope, Scope.Private);

        let body;

        // 获取工作区信息
        await user.get(`/workspace/${workspace.id}`);
        await visitor.negGet(`/workspace/${workspace.id}`);
        await noLogin.negGet(`/workspace/${workspace.id}`);

        // 更新工作区信息
        body = {};
        await user.put(`/workspace/${workspace.id}`, body);
        await visitor.negPut(`/workspace/${workspace.id}`, body);
        await noLogin.negPut(`/workspace/${workspace.id}`, body);

        // 创建文档
        body = {
            workspaceId: workspace.id,
        };
        await user.post('/doc', body);
        await visitor.negPost('/doc', body);
        await noLogin.negPost('/doc', body);

        // 删除工作区
        await noLogin.negDelete(`/workspace/${workspace.id}`);
        await visitor.negDelete(`/workspace/${workspace.id}`);
        await user.delete(`/workspace/${workspace.id}`);
    });

    await testCase.pos('doc scope - public', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
        });
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc',
            scope: Scope.Public,
        });
        Assert.expect(doc.scope, Scope.Public);

        let body;

        // 获取文档信息
        await user.get(`/doc/${doc.id}`);
        await visitor.get(`/doc/${doc.id}`);
        await noLogin.get(`/doc/${doc.id}`);

        // 更新文档信息
        body = {};
        await user.put(`/doc/${doc.id}`, body);
        await visitor.negPut(`/doc/${doc.id}`, body);
        await noLogin.negPut(`/doc/${doc.id}`, body);

        // 删除文档
        await noLogin.negDelete(`/doc/${doc.id}`);
        await visitor.negDelete(`/doc/${doc.id}`);
        await user.delete(`/doc/${doc.id}`);
    });

    await testCase.pos('doc scope - private', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
        });
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
            scope: Scope.Private,
        });
        Assert.expect(doc.scope, Scope.Private);

        let body;

        // 获取文档信息
        await user.get(`/doc/${doc.id}`);
        await visitor.negGet(`/doc/${doc.id}`);
        await noLogin.negGet(`/doc/${doc.id}`);

        // 更新文档信息
        body = {};
        await user.put(`/doc/${doc.id}`, body);
        await visitor.negPut(`/doc/${doc.id}`, body);
        await noLogin.negPut(`/doc/${doc.id}`, body);

        // 删除文档
        await noLogin.negDelete(`/doc/${doc.id}`);
        await visitor.negDelete(`/doc/${doc.id}`);
        await user.delete(`/doc/${doc.id}`);
    });

    Controller.clear();

    return testCase;
}

module.exports = test;
