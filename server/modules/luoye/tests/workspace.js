const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { Scope } = require('../constants');
const Controller = require('../controllerV2');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Luoye - Workspace', true);

    const baseUrl = Server + '/luoye';
    const user = new Rocket(baseUrl);
    await user.login('talaxy', 'talaxy');

    await testCase.pos('create workspace', async () => {
        const data = await user.post('/workspace', {
            name: 'workspace1',
            scope: Scope.Public,
        });
        const workspace = await user.get(`/workspace/${data.id}`);
        Assert.props(workspace, PropList.workspace);
        Assert.array(workspace.admins, 1);
        Assert.array(workspace.members, 1);
        Assert.array(workspace.docs, 0);
        Assert.expect(workspace.name, 'workspace1');
        Assert.expect(workspace.description, '');
        Assert.expect(workspace.scope, Scope.Public);
        Assert.expect(workspace.creator, 'talaxy');
        Assert.expect(workspace.admins[0], 'talaxy');
        Assert.expect(workspace.members[0], 'talaxy');
    });

    await testCase.neg('create workspace - lack of props', async () => {
        await user.post('/workspace', {});
    });

    await testCase.neg('create workspace - invalid scope', async () => {
        await user.post('/workspace', {
            name: 'workspace',
            scope: 'invalid-scope',
        });
    });

    await testCase.pos('create workspace - extra props', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
            extra: 'extra',
        });
        Assert.expect(workspace.extra, undefined);
    });

    await testCase.pos('update workspace', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace1',
        });
        const workspace2 = await user.put(`/workspace/${workspace.id}`, {
            name: 'workspace2',
            description: 'description',
            scope: Scope.Public,
            // TODO: 文档内容
        });
        Assert.props(workspace2, PropList.workspace);
        Assert.expect(workspace2.name, 'workspace2');
        Assert.expect(workspace2.description, 'description');
        Assert.expect(workspace2.scope, Scope.Public);
    });

    await testCase.pos('update workspace - extra props', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
        });
        const workspace2 = await user.put(`/workspace/${workspace.id}`, {
            extra: 'extra',
        });
        Assert.expect(workspace2.extra, undefined);
    });

    await testCase.neg('update workspace - invalid scope', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
        });
        await user.put(`/workspace/${workspace.id}`, {
            scope: 'invalid-scope',
        });
    });

    return testCase;
}

module.exports = test;
