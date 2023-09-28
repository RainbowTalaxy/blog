const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { Scope } = require('../constants');
const Controller = require('../controller');
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

    // ## 更新工作区的文档列表顺序

    await testCase.pos('update workspace docs sequence', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
        });
        await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc1',
        });
        await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc2',
        });
        await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc3',
        });
        const workspace2 = await user.get(`/workspace/${workspace.id}`);
        Assert.array(workspace2.docs, 3);
        Assert.expect(workspace2.docs[0].name, 'doc1');
        Assert.expect(workspace2.docs[1].name, 'doc2');
        Assert.expect(workspace2.docs[2].name, 'doc3');
        await user.put(`/workspace/${workspace.id}`, {
            docs: workspace2.docs.slice().reverse(),
        });
        const workspace3 = await user.get(`/workspace/${workspace.id}`);
        Assert.array(workspace3.docs, 3);
        Assert.expect(workspace3.docs[0].name, workspace2.docs[2].name);
        Assert.expect(workspace3.docs[1].name, workspace2.docs[1].name);
        Assert.expect(workspace3.docs[2].name, workspace2.docs[0].name);
    });

    await testCase.neg(
        'update workspace docs sequence - invalid doc',
        async () => {
            const workspace = await user.post('/workspace', {
                name: 'workspace',
            });
            await user.post('/doc', {
                workspaceId: workspace.id,
                name: 'doc',
            });
            const workspace2 = await user.get(`/workspace/${workspace.id}`);
            Assert.array(workspace2.docs, 3);
            Assert.expect(workspace2.docs[0].name, 'doc');
            await user.put(`/workspace/${workspace.id}`, {
                docs: workspace2.docs.slice().reverse().concat({
                    id: 'invalid-doc-id',
                }),
            });
        },
    );

    await testCase.neg(
        'update workspace docs sequence - lack of docs',
        async () => {
            const workspace = await user.post('/workspace', {
                name: 'workspace',
            });
            await user.post('/doc', {
                workspaceId: workspace.id,
                name: 'doc',
            });
            const workspace2 = await user.get(`/workspace/${workspace.id}`);
            Assert.array(workspace2.docs, 3);
            Assert.expect(workspace2.docs[0].name, 'doc');
            await user.put(`/workspace/${workspace.id}`, {
                docs: workspace2.docs.slice(1),
            });
        },
    );

    Controller.clear();

    // ## 删除工作区

    await testCase.pos('delete workspace', async () => {
        const workspace = await user.post('/workspace', {
            name: 'workspace',
        });
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc',
        });
        await user.delete(`/workspace/${workspace.id}`);
        await user.negGet(`/workspace/${workspace.id}`);
        await user.negGet(`/doc/${doc.id}`);
        const workspaceItems = await user.get('/workspaces');
        const docItems = await user.get('/docs');
        Assert.array(workspaceItems, 1);
        Assert.expect(workspaceItems[0].id, 'talaxy');
        Assert.array(docItems, 0);
    });

    await testCase.neg('delete workspace - invalid id', async () => {
        await user.delete('/workspace/invalid-id');
    });

    return testCase;
}

module.exports = test;
