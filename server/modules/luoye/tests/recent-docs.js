const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const Controller = require('../controller');

async function test() {
    const testCase = new TestCase('Luoye - Recent Docs', true);

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
        await talaxy.delete(`/recent-docs/${docId}`);
        const updatedRecentDocs = await talaxy.get('/recent-docs');
        if (updatedRecentDocs.find((d) => d.id === docId))
            throw new Error('recent doc not deleted');
    });

    Controller.clear();

    // 验证 recent-docs 数据结构正确（不包含完整 Doc 的额外字段）
    await testCase.pos(
        'recent doc item should not contain full doc fields',
        async () => {
            const ws = await talaxy.post('/workspace', {
                name: 'recent-docs-structure-test',
            });
            await talaxy.post('/doc', {
                workspaceId: ws.id,
                name: 'structure-test-doc',
                tags: ['testTag1', 'testTag2'],
            });
            const recentDocs = await talaxy.get('/recent-docs');
            const recentDoc = recentDocs.find(
                (d) => d.name === 'structure-test-doc',
            );
            Assert.expect(recentDoc !== undefined, true);
            // 应包含 DocItem 字段
            Assert.expect(recentDoc.id !== undefined, true);
            Assert.expect(recentDoc.name, 'structure-test-doc');
            Assert.expect(recentDoc.creator !== undefined, true);
            Assert.expect(recentDoc.scope !== undefined, true);
            Assert.expect(recentDoc.docType !== undefined, true);
            Assert.expect(recentDoc.createdAt !== undefined, true);
            Assert.expect(recentDoc.updatedAt !== undefined, true);
            Assert.expect(Array.isArray(recentDoc.tags), true);
            Assert.array(recentDoc.tags, 2);
            // 不应包含完整 Doc 的字段
            Assert.expect(recentDoc.content, undefined);
            Assert.expect(recentDoc.admins, undefined);
            Assert.expect(recentDoc.members, undefined);
            Assert.expect(recentDoc.workspaces, undefined);
        },
    );

    // 验证更新文档时 recent-docs 数据结构仍然正确
    await testCase.pos(
        'recent doc item should not contain full doc fields after update',
        async () => {
            const docItems = await talaxy.get('/docs');
            const docItem = docItems.find(
                (d) => d.name === 'structure-test-doc',
            );
            // 更新文档
            await talaxy.put(`/doc/${docItem.id}`, {
                name: 'updated-structure-test-doc',
                tags: ['updatedTag1', 'updatedTag2', 'updatedTag3'],
                content: 'some content',
            });
            const recentDocs = await talaxy.get('/recent-docs');
            const recentDoc = recentDocs.find(
                (d) => d.name === 'updated-structure-test-doc',
            );
            Assert.expect(recentDoc !== undefined, true);
            // 应包含更新后的 tags
            Assert.expect(Array.isArray(recentDoc.tags), true);
            Assert.array(recentDoc.tags, 3);
            Assert.expect(recentDoc.tags.includes('updatedTag1'), true);
            Assert.expect(recentDoc.tags.includes('updatedTag2'), true);
            Assert.expect(recentDoc.tags.includes('updatedTag3'), true);
            // 不应包含完整 Doc 的字段
            Assert.expect(recentDoc.content, undefined);
            Assert.expect(recentDoc.admins, undefined);
            Assert.expect(recentDoc.members, undefined);
            Assert.expect(recentDoc.workspaces, undefined);
        },
    );

    return testCase;
}

module.exports = test;
