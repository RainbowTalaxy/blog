const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const { DocType, Scope } = require('../constants');
const Controller = require('../controller');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Luoye - User', true);

    const talaxy = new Rocket(Server + '/luoye');
    await talaxy.login('talaxy', 'talaxy');

    Controller.clear();

    await testCase.pos('check workspaceItems update', async () => {
        await talaxy.post('/workspace', {
            name: 'workspace1',
        });
        await talaxy.post('/workspace', {
            name: 'workspace2',
        });
        const workspaceItems = await talaxy.get('/workspaces');
        Assert.array(workspaceItems, 3);
        workspaceItems.forEach((wItem) =>
            Assert.props(wItem, PropList.user.workspaceItem),
        );
        Assert.expect(workspaceItems[0].name, 'workspace2');
        Assert.expect(workspaceItems[1].name, 'workspace1');
        await talaxy.put('/workspaces', {
            workspaceIds: workspaceItems.map((wItem) => wItem.id).reverse(),
        });
        const workspaceItems2 = await talaxy.get('/workspaces');
        Assert.array(workspaceItems2, 3);
        workspaceItems2.forEach((wItem) =>
            Assert.props(wItem, PropList.user.workspaceItem),
        );
        Assert.expect(workspaceItems[0].id, workspaceItems2[2].id);
        Assert.expect(workspaceItems[1].id, workspaceItems2[1].id);
        Assert.expect(workspaceItems[2].id, workspaceItems2[0].id);
    });

    await testCase.neg('update workspaceItems - lack of props', async () => {
        await talaxy.put('/workspaces', {});
    });

    await testCase.neg('update workspaceItems - invalid ids', async () => {
        await talaxy.put('/workspaces', {
            workspaceIds: ['invalid-id'],
        });
    });

    await testCase.neg('update workspaceItems - ids not match', async () => {
        const workspaceItems = await talaxy.get('/workspaces');
        await talaxy.put('/workspaces', {
            workspaceIds: Array(workspaceItems.length).fill(
                workspaceItems[0].id,
            ),
        });
    });

    Controller.clear();

    await testCase.pos('check docItem update', async () => {
        const workspace = await talaxy.post('/workspace', {
            name: 'workspace',
        });
        await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc',
        });
        const docItems = await talaxy.get('/docs');
        Assert.array(docItems, 1);
        docItems.forEach((dItem) => Assert.props(dItem, PropList.user.docItem));
        Assert.expect(docItems[0].name, 'doc');
        await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc2',
        });
        const docItems2 = await talaxy.get('/docs');
        Assert.array(docItems2, 2);
        Assert.expect(docItems2[0].name, 'doc2');
        await talaxy.delete(`/doc/${docItems2[0].id}`);
        const docItems3 = await talaxy.get('/docs');
        Assert.array(docItems3, 1);
        Assert.expect(docItems3[0].name, 'doc');
    });

    Controller.clear();

    await testCase.pos('check recent doc update', async () => {
        const workspace = await talaxy.post('/workspace', {
            name: 'workspace',
        });
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc',
        });
        const recentDocs = await talaxy.get('/recent-docs');
        Assert.array(recentDocs, 1);
        recentDocs.forEach((dItem) =>
            Assert.props(dItem, PropList.user.docItem),
        );
        Assert.expect(recentDocs[0].name, 'doc');
        Assert.expect(recentDocs[0].creator, 'talaxy');
        Assert.expect(recentDocs[0].scope, Scope.Private);
        Assert.expect(recentDocs[0].docType, DocType.Text);
        await talaxy.delete(`/doc/${doc.id}`);
        const recentDocs2 = await talaxy.get('/recent-docs');
        Assert.array(recentDocs2, 0);
    });

    Controller.clear();

    await testCase.pos('check doc bin update', async () => {
        const workspace = await talaxy.post('/workspace', {
            name: 'workspace',
        });
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc',
        });
        const docBin = await talaxy.get('/doc-bin');
        Assert.array(docBin, 0);
        await talaxy.delete(`/doc/${doc.id}`);
        const docBin2 = await talaxy.get('/doc-bin');
        Assert.array(docBin2, 1);
        docBin2.forEach((dItem) =>
            Assert.props(dItem, PropList.user.docBinItem),
        );
        Assert.expect(docBin2[0].name, 'doc');
        Assert.expect(docBin2[0].executor, 'talaxy');
    });

    return testCase;
}

module.exports = test;
