const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { DocType, Scope } = require('../constants');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Luoye - Doc', true);

    const baseUrl = Server + '/luoye';
    const user = new Rocket(baseUrl);
    await user.login('talaxy', 'talaxy');

    const workspace = await user.post('/workspace', {
        name: 'workspace',
    });

    await testCase.pos('create workspace', async () => {
        const now = Date.now();
        const data = await user.post(`/doc`, {
            workspaceId: workspace.id,
            name: 'doc',
            date: now,
            docType: DocType.Markdown,
        });
        const doc = await user.get(`/doc/${data.id}`);
        Assert.props(doc, PropList.doc);
        Assert.expect(doc.name, 'doc');
        Assert.expect(doc.creator, 'talaxy');
        Assert.array(doc.admins, 1);
        Assert.expect(doc.admins[0], 'talaxy');
        Assert.array(doc.members, 1);
        Assert.expect(doc.members[0], 'talaxy');
        Assert.expect(doc.scope, Scope.Private);
        Assert.expect(doc.date, now);
        Assert.array(doc.workspaces, 1);
        Assert.expect(doc.workspaces[0], workspace.id);
        Assert.expect(doc.docType, DocType.Markdown);
        Assert.expect(doc.content, '');
        Assert.expect(doc.deletedAt, null);
    });

    await testCase.neg('create doc - lack of props', async () => {
        await user.post('/doc', {});
    });

    await testCase.neg('create doc - invalid scope', async () => {
        await user.post('/doc', {
            workspaceId: workspace.id,
            scope: 'invalid-scope',
        });
    });

    await testCase.neg('create doc - invalid workspaceId', async () => {
        await user.post('/doc', {
            workspaceId: 'invalid-id',
        });
    });

    await testCase.pos('create doc - extra props', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc',
            extra: 'extra',
        });
        Assert.expect(doc.extra, undefined);
    });

    await testCase.pos('update doc', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        const now = Date.now();
        const doc2 = await user.put(`/doc/${doc.id}`, {
            name: 'doc2',
            date: now,
            scope: Scope.Public,
            content: 'content',
        });
        Assert.props(doc2, PropList.doc);
        Assert.expect(doc2.name, 'doc2');
        Assert.expect(doc2.date, now);
        Assert.expect(doc2.scope, Scope.Public);
        Assert.expect(doc2.content, 'content');
    });

    await testCase.pos('update doc - extra props', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        const doc2 = await user.put(`/doc/${doc.id}`, {
            extra: 'extra',
        });
        Assert.expect(doc2.extra, undefined);
    });

    await testCase.neg('update doc - invalid scope', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        await user.put(`/doc/${doc.id}`, {
            scope: 'invalid-scope',
        });
    });

    await testCase.pos('update doc - change workspaces', async () => {
        const workspace2 = await user.post('/workspace', {
            name: 'workspace2',
        });
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        Assert.array(doc.workspaces, 1);
        Assert.expect(doc.workspaces[0], workspace.id);

        // 修改为包含两个工作区
        const doc2 = await user.put(`/doc/${doc.id}`, {
            workspaces: [workspace.id, workspace2.id],
        });
        Assert.array(doc2.workspaces, 2);
        Assert.expect(doc2.workspaces.includes(workspace.id), true);
        Assert.expect(doc2.workspaces.includes(workspace2.id), true);

        // 验证两个工作区都包含此文档
        const ws1 = await user.get(`/workspace/${workspace.id}`);
        const ws2 = await user.get(`/workspace/${workspace2.id}`);
        Assert.expect(
            ws1.docs.some((d) => d.docId === doc.id),
            true,
        );
        Assert.expect(
            ws2.docs.some((d) => d.docId === doc.id),
            true,
        );

        // 修改为仅包含第二个工作区
        const doc3 = await user.put(`/doc/${doc.id}`, {
            workspaces: [workspace2.id],
        });
        Assert.array(doc3.workspaces, 1);
        Assert.expect(doc3.workspaces[0], workspace2.id);

        // 验证第一个工作区不再包含此文档
        const ws1After = await user.get(`/workspace/${workspace.id}`);
        const ws2After = await user.get(`/workspace/${workspace2.id}`);
        Assert.expect(
            ws1After.docs.some((d) => d.docId === doc.id),
            false,
        );
        Assert.expect(
            ws2After.docs.some((d) => d.docId === doc.id),
            true,
        );
    });

    await testCase.neg(
        'update doc - invalid workspaces (empty array)',
        async () => {
            const doc = await user.post('/doc', {
                workspaceId: workspace.id,
            });
            await user.put(`/doc/${doc.id}`, {
                workspaces: [],
            });
        },
    );

    await testCase.neg(
        'update doc - invalid workspaces (not array)',
        async () => {
            const doc = await user.post('/doc', {
                workspaceId: workspace.id,
            });
            await user.put(`/doc/${doc.id}`, {
                workspaces: 'invalid',
            });
        },
    );

    await testCase.neg('update doc - workspace not found', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        await user.put(`/doc/${doc.id}`, {
            workspaces: ['invalid-workspace-id'],
        });
    });

    await testCase.pos('delete doc', async () => {
        const data = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        await user.delete(`/doc/${data.id}`);
        const doc = await user.get(`/doc/${data.id}`);
        Assert.negExpect(doc.deletedAt, null);
    });

    await testCase.neg('delete doc - invalid id', async () => {
        await user.delete(`/doc/invalid-id`);
    });

    await testCase.pos('restore doc', async () => {
        const data = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        await user.delete(`/doc/${data.id}`);
        await user.put(`/doc/${data.id}/restore`);
        const doc = await user.get(`/doc/${data.id}`);
        Assert.expect(doc.deletedAt, null);
    });

    await testCase.neg('restore doc - normal doc', async () => {
        const data = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        await user.put(`/doc/${data.id}/restore`);
    });

    return testCase;
}

module.exports = test;
