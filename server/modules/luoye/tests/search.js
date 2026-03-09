const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const Controller = require('../controller');

async function test() {
    const testCase = new TestCase('Luoye - Search', true);

    const baseUrl = Server + '/luoye';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');

    Controller.clear();

    // 创建测试用工作区和文档
    const workspace1 = await talaxy.post('/workspace', {
        name: 'search-workspace-1',
    });
    const workspace2 = await talaxy.post('/workspace', {
        name: 'search-workspace-2',
    });

    const doc1 = await talaxy.post('/doc', {
        workspaceId: workspace1.id,
        name: 'Hello World Document',
    });
    await talaxy.put(`/doc/${doc1.id}`, {
        content: 'This is a test content with Hello keyword.',
    });

    const doc2 = await talaxy.post('/doc', {
        workspaceId: workspace1.id,
        name: 'Another Document',
    });
    await talaxy.put(`/doc/${doc2.id}`, {
        content: 'Some text without the keyword.',
    });

    const doc3 = await talaxy.post('/doc', {
        workspaceId: workspace2.id,
        name: 'Workspace2 Doc',
    });
    await talaxy.put(`/doc/${doc3.id}`, {
        content: 'Hello from workspace2, Hello again.',
    });

    // === 基础搜索 ===

    await testCase.neg('search - missing keyword', async () => {
        await talaxy.get('/search', {});
    });

    await testCase.pos('search - keyword in name', async () => {
        const results = await talaxy.get('/search', { keyword: 'Hello' });
        Assert.array(results);
        // doc1 标题含 Hello, doc3 正文含 Hello
        Assert.expect(results.length >= 2, true);
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc1.id), true);
        Assert.expect(ids.includes(doc3.id), true);
    });

    await testCase.pos('search - keyword in content', async () => {
        const results = await talaxy.get('/search', {
            keyword: 'test content',
        });
        Assert.array(results, 1);
        Assert.expect(results[0].id, doc1.id);
        Assert.expect(results[0].matches.length >= 1, true);
        Assert.expect(results[0].matches[0].field, 'content');
    });

    await testCase.pos('search - no match', async () => {
        const results = await talaxy.get('/search', {
            keyword: 'nonexistent-xyz',
        });
        Assert.array(results, 0);
    });

    // === 大小写敏感 ===

    await testCase.pos('search - case sensitive', async () => {
        const upper = await talaxy.get('/search', { keyword: 'Hello' });
        const lower = await talaxy.get('/search', { keyword: 'hello' });
        // "Hello" 应匹配到结果，"hello" 不应匹配
        Assert.expect(upper.length >= 1, true);
        Assert.expect(lower.length, 0);
    });

    // === 多匹配项归入同一文档 ===

    await testCase.pos('search - multiple matches in one doc', async () => {
        const results = await talaxy.get('/search', { keyword: 'Hello' });
        const doc3Result = results.find((r) => r.id === doc3.id);
        Assert.expect(doc3Result !== undefined, true);
        // doc3 正文有两个 Hello，matches 应 >= 2
        Assert.expect(doc3Result.matches.length >= 2, true);
    });

    // === limit 参数 ===

    await testCase.pos('search - limit', async () => {
        const results = await talaxy.get('/search', {
            keyword: 'Hello',
            limit: 1,
        });
        Assert.array(results, 1);
    });

    await testCase.neg('search - invalid limit', async () => {
        await talaxy.get('/search', { keyword: 'Hello', limit: 'abc' });
    });

    // === 按工作区限定搜索 ===

    await testCase.pos('search - filter by workspaceId', async () => {
        const results = await talaxy.get('/search', {
            keyword: 'Hello',
            workspaceId: workspace2.id,
        });
        Assert.array(results, 1);
        Assert.expect(results[0].id, doc3.id);
    });

    await testCase.pos('search - workspaceId with no match', async () => {
        const results = await talaxy.get('/search', {
            keyword: 'Hello',
            workspaceId: workspace1.id,
        });
        // workspace1 中 doc1 标题含 Hello, doc1 正文也含 Hello
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc1.id), true);
        Assert.expect(ids.includes(doc3.id), false);
    });

    await testCase.neg('search - invalid workspaceId', async () => {
        await talaxy.get('/search', {
            keyword: 'Hello',
            workspaceId: 'invalid-workspace-id',
        });
    });

    // === 结果排序：按 updatedAt 降序 ===

    await testCase.pos('search - sorted by updatedAt desc', async () => {
        const results = await talaxy.get('/search', { keyword: 'Hello' });
        for (let i = 1; i < results.length; i++) {
            Assert.expect(
                results[i - 1].updatedAt >= results[i].updatedAt,
                true,
            );
        }
    });

    // === 返回数据结构校验 ===

    await testCase.pos('search - result item structure', async () => {
        const results = await talaxy.get('/search', { keyword: 'Hello' });
        Assert.expect(results.length >= 1, true);
        const item = results[0];
        Assert.expect('id' in item, true);
        Assert.expect('name' in item, true);
        Assert.expect('updatedAt' in item, true);
        Assert.expect('matches' in item, true);
        Assert.array(item.matches);
        Assert.expect(item.matches.length >= 1, true);
        const match = item.matches[0];
        Assert.expect('field' in match, true);
        Assert.expect('context' in match, true);
        Assert.expect(['name', 'content'].includes(match.field), true);
    });

    // === 已删除文档不在搜索结果中 ===

    await testCase.pos('search - deleted doc excluded', async () => {
        const tempDoc = await talaxy.post('/doc', {
            workspaceId: workspace1.id,
            name: 'DeleteMe SearchTarget',
        });
        // 确认搜索能找到
        const before = await talaxy.get('/search', { keyword: 'DeleteMe' });
        Assert.expect(before.length >= 1, true);
        // 删除文档
        await talaxy.delete(`/doc/${tempDoc.id}`);
        // 确认搜索不再找到
        const after = await talaxy.get('/search', { keyword: 'DeleteMe' });
        Assert.array(after, 0);
    });

    return testCase;
}

module.exports = test;
