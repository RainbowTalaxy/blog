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
        try {
            await talaxy.get(`/doc/${docId}`);
            throw new Error('doc not deleted');
        } catch {}
    });
}

module.exports = test;
