const { Server } = require('../config');
const { Rocket, TestCase } = require('./utils');

async function test() {
    const testCase = new TestCase('Luoye 2');

    const talaxy = new Rocket(Server + '/luoye');
    await talaxy.login('talaxy', 'talaxy');
    const allay = new Rocket(Server + '/luoye');
    await allay.login('allay', 'allay');

    // 基本功能覆盖
    await testCase.pos('general tests', async () => {
        const { id: workspaceId } = await talaxy.post('/workspace', {
            name: 'test workspace',
        });
        await talaxy.get(`/workspace/${workspaceId}`);
        const workspaces = await talaxy.get('/workspaces');
        if (!workspaces.find((w) => w.id === workspaceId))
            throw new Error('workspace not found');
        await talaxy.put(`/workspace/${workspaceId}`, {
            name: 'test workspace(updated)',
        });
        const { id: docId } = await talaxy.post(`/doc`, {
            workspaceId,
            name: 'test doc',
        });
        await talaxy.get(`/doc/${docId}`);
        await talaxy.put(`/doc/${docId}`, {
            name: 'test doc(updated)',
        });
        await talaxy.delete(`/doc/${docId}`);
        await talaxy.delete(`/workspace/${workspaceId}`);
    });

    const testWorkspace = await talaxy.post('/workspace', {
        name: 'test workspace',
    });

    // 删除工作区
    await testCase.pos('delete workspace', async () => {
        const { id: workspaceId } = await talaxy.post('/workspace', {
            name: 'test workspace',
        });
        const { id: docId } = await talaxy.post(`/doc`, {
            workspaceId,
            name: 'test doc',
        });
        await talaxy.delete(`/workspace/${workspaceId}`);
        const workspaces = await talaxy.get('/workspaces');
        if (workspaces.find((w) => w.id === workspaceId))
            throw new Error('workspace not deleted');
        // 检查文档是否还在
        const deletedDoc = await talaxy.silentGet(`/doc/${docId}`);
        if (deletedDoc) throw new Error('doc not deleted');
    });

    // 删除文档
    await testCase.pos('delete doc', async () => {
        const { id: docId } = await talaxy.post(`/doc`, {
            workspaceId: testWorkspace.id,
            name: 'test doc',
        });
        await talaxy.delete(`/doc/${docId}`);
        const bin = await talaxy.get('/doc-bin');
        // 检查回收站
        if (!bin.find((d) => d.docId === docId))
            throw new Error('doc not in bin');
        // 检查工作区是否还有文档
        const updatedWorkspace = await talaxy.get(
            `/workspace/${testWorkspace.id}`,
        );
        if (updatedWorkspace.docs.find((d) => d.docId === docId))
            throw new Error('doc not removed from workspace');
        // 检查文档的删除标记
        const deletedDoc = await talaxy.silentGet(`/doc/${docId}`);
        if (!deletedDoc.deletedAt) throw new Error('doc not marked as deleted');
    });
}

module.exports = test;
