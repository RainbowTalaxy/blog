const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const Controller = require('../controller');

async function test() {
    const testCase = new TestCase('Luoye - Tags', true);

    const baseUrl = Server + '/luoye';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');

    Controller.clear();

    // 创建测试用工作区
    const workspace = await talaxy.post('/workspace', {
        name: 'tags-test-workspace',
    });

    // === GET /tags 测试 ===

    await testCase.pos('get tags - initial empty', async () => {
        const tags = await talaxy.get('/tags');
        Assert.array(tags, 0);
    });

    // === POST /doc 创建文档时设置 tags ===

    await testCase.pos('create doc with tags', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-with-tags',
            tags: ['tag1', 'tag2'],
        });
        Assert.expect(Array.isArray(doc.tags), true);
        Assert.array(doc.tags, 2);
        Assert.expect(doc.tags.includes('tag1'), true);
        Assert.expect(doc.tags.includes('tag2'), true);
    });

    await testCase.pos('get tags - after create doc with tags', async () => {
        const tags = await talaxy.get('/tags');
        Assert.array(tags, 2);
        Assert.expect(tags.includes('tag1'), true);
        Assert.expect(tags.includes('tag2'), true);
    });

    await testCase.pos('create doc without tags', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-without-tags',
        });
        Assert.expect(doc.tags, undefined);
    });

    await testCase.pos('create doc with empty tags array', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-empty-tags',
            tags: [],
        });
        Assert.array(doc.tags, 0);
    });

    await testCase.neg('create doc - invalid tags (not array)', async () => {
        await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-invalid-tags',
            tags: 'invalid-tags',
        });
    });

    await testCase.neg(
        'create doc - invalid tags (array with non-string)',
        async () => {
            await talaxy.post('/doc', {
                workspaceId: workspace.id,
                name: 'doc-invalid-tags',
                tags: ['tag1', 123],
            });
        },
    );

    await testCase.neg(
        'create doc - invalid tags (array with empty string)',
        async () => {
            await talaxy.post('/doc', {
                workspaceId: workspace.id,
                name: 'doc-invalid-tags',
                tags: ['tag1', ''],
            });
        },
    );

    await testCase.neg(
        'create doc - invalid tags (array with whitespace only)',
        async () => {
            await talaxy.post('/doc', {
                workspaceId: workspace.id,
                name: 'doc-invalid-tags',
                tags: ['tag1', '   '],
            });
        },
    );

    // === PUT /doc/:id 更新文档时设置 tags ===

    await testCase.pos('update doc - add tags', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-to-update',
        });
        const updatedDoc = await talaxy.put(`/doc/${doc.id}`, {
            tags: ['newTag1', 'newTag2'],
        });
        Assert.expect(Array.isArray(updatedDoc.tags), true);
        Assert.array(updatedDoc.tags, 2);
        Assert.expect(updatedDoc.tags.includes('newTag1'), true);
        Assert.expect(updatedDoc.tags.includes('newTag2'), true);
    });

    await testCase.pos(
        'get tags - after update doc with new tags',
        async () => {
            const tags = await talaxy.get('/tags');
            // 应该包含 tag1, tag2, newTag1, newTag2
            Assert.expect(tags.includes('tag1'), true);
            Assert.expect(tags.includes('tag2'), true);
            Assert.expect(tags.includes('newTag1'), true);
            Assert.expect(tags.includes('newTag2'), true);
        },
    );

    await testCase.pos('update doc - modify existing tags', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-modify-tags',
            tags: ['oldTag'],
        });
        const updatedDoc = await talaxy.put(`/doc/${doc.id}`, {
            tags: ['modifiedTag'],
        });
        Assert.array(updatedDoc.tags, 1);
        Assert.expect(updatedDoc.tags[0], 'modifiedTag');
    });

    await testCase.pos('update doc - clear tags', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-clear-tags',
            tags: ['tagToRemove'],
        });
        const updatedDoc = await talaxy.put(`/doc/${doc.id}`, {
            tags: [],
        });
        Assert.array(updatedDoc.tags, 0);
    });

    await testCase.neg('update doc - invalid tags (not array)', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-invalid-update',
        });
        await talaxy.put(`/doc/${doc.id}`, {
            tags: 'invalid-tags',
        });
    });

    await testCase.neg(
        'update doc - invalid tags (array with non-string)',
        async () => {
            const doc = await talaxy.post('/doc', {
                workspaceId: workspace.id,
                name: 'doc-invalid-update-2',
            });
            await talaxy.put(`/doc/${doc.id}`, {
                tags: [123, 456],
            });
        },
    );

    await testCase.neg(
        'update doc - invalid tags (array with empty string)',
        async () => {
            const doc = await talaxy.post('/doc', {
                workspaceId: workspace.id,
                name: 'doc-invalid-update-3',
            });
            await talaxy.put(`/doc/${doc.id}`, {
                tags: ['valid', ''],
            });
        },
    );

    // === 验证 tags 在获取文档时正确返回 ===

    await testCase.pos('get doc - verify tags returned', async () => {
        const doc = await talaxy.post('/doc', {
            workspaceId: workspace.id,
            name: 'doc-verify-tags',
            tags: ['verifyTag1', 'verifyTag2'],
        });
        const fetchedDoc = await talaxy.get(`/doc/${doc.id}`);
        Assert.expect(Array.isArray(fetchedDoc.tags), true);
        Assert.array(fetchedDoc.tags, 2);
        Assert.expect(fetchedDoc.tags.includes('verifyTag1'), true);
        Assert.expect(fetchedDoc.tags.includes('verifyTag2'), true);
    });

    // === 验证 tags 去重功能 ===

    await testCase.pos(
        'tags deduplication - same tags not duplicated',
        async () => {
            Controller.clear();
            const ws = await talaxy.post('/workspace', {
                name: 'dedup-test-workspace',
            });
            // 创建第一个文档
            await talaxy.post('/doc', {
                workspaceId: ws.id,
                name: 'doc1',
                tags: ['dupTag1', 'dupTag2'],
            });
            // 创建第二个文档，使用部分相同的标签
            await talaxy.post('/doc', {
                workspaceId: ws.id,
                name: 'doc2',
                tags: ['dupTag1', 'dupTag3'],
            });
            const tags = await talaxy.get('/tags');
            // dupTag1 应该只出现一次
            const dupTag1Count = tags.filter((t) => t === 'dupTag1').length;
            Assert.expect(dupTag1Count, 1);
            Assert.expect(tags.includes('dupTag2'), true);
            Assert.expect(tags.includes('dupTag3'), true);
        },
    );

    return testCase;
}

module.exports = test;
