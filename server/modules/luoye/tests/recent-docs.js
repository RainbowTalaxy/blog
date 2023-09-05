const { Server } = require('../../../config');
const { Rocket, TestCase } = require('../../../utils/test');

async function test() {
    const testCase = new TestCase('Luoye - Recent Docs');

    const talaxy = new Rocket(Server + '/luoye');
    await talaxy.login('talaxy', 'talaxy');

    // 访问 & 删除最近文档记录
    await testCase.pos('check and delete recent doc', async () => {
        const { id: workspaceId } = await talaxy.post('/workspace', {
            name: 'test workspace',
        });
        const { id: docId } = await talaxy.post(`/doc`, {
            workspaceId,
            name: 'test doc',
        });

        await talaxy.get(`/doc/${docId}`);
        const recentDocs = await talaxy.get('/recent-docs');
        if (!recentDocs.find((d) => d.id === docId))
            throw new Error('recent doc not found');
        // 删除最近文档记录
        await talaxy.delete(`/doc/${docId}`);
        const updatedRecentDocs = await talaxy.get('/recent-docs');
        if (updatedRecentDocs.find((d) => d.id === docId))
            throw new Error('recent doc not deleted');
    });
}

module.exports = test;
