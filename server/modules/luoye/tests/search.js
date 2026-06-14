const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const Controller = require('../controller');

const day = (date) => new Date(`${date}T00:00:00`).getTime();

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const shiftDate = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return formatDate(date);
};

async function test() {
    const testCase = new TestCase('Luoye - Search', true);

    const baseUrl = Server + '/luoye';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');

    Controller.clear();

    const searchResponse = (params) => talaxy.get('/search', params);
    const searchItems = async (params) => (await searchResponse(params)).items;

    const today = shiftDate(0);
    const tomorrow = shiftDate(1);

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
        date: day('2024-01-10'),
    });
    await talaxy.put(`/doc/${doc1.id}`, {
        content: 'This is a test content with Hello keyword.',
    });

    const doc2 = await talaxy.post('/doc', {
        workspaceId: workspace1.id,
        name: 'Another Document',
        date: day('2024-02-10'),
    });
    await talaxy.put(`/doc/${doc2.id}`, {
        content: 'Some text without the keyword.',
    });

    const doc3 = await talaxy.post('/doc', {
        workspaceId: workspace2.id,
        name: 'Workspace2 Doc',
        date: day('2024-03-10'),
    });
    await talaxy.put(`/doc/${doc3.id}`, {
        content: 'Hello from workspace2, Hello again.',
    });

    // doc4: 两个关键词间距较远，不会合并
    const doc4 = await talaxy.post('/doc', {
        workspaceId: workspace1.id,
        name: 'FarApart Doc',
        date: day('2024-01-20'),
    });
    await talaxy.put(`/doc/${doc4.id}`, {
        content:
            'Hello beginning of text' + '.'.repeat(120) + 'Hello end of text',
    });

    const indexDoc = await talaxy.post('/doc', {
        workspaceId: workspace1.id,
        name: 'Index Sync Document',
        date: day('2024-04-10'),
    });

    // === 基础搜索 ===

    await testCase.pos('search - missing keyword returns docs', async () => {
        const response = await searchResponse({});
        Assert.expect(response.total >= 5, true);
        Assert.expect(response.items.length <= 30, true);
        Assert.expect(
            response.items.every((item) => item.matches.length === 0),
            true,
        );
    });

    await testCase.pos('search - blank keyword returns docs', async () => {
        const response = await searchResponse({ keyword: '   ' });
        Assert.expect(response.total >= 5, true);
        Assert.expect(response.items.length <= 30, true);
        Assert.expect(
            response.items.every((item) => item.matches.length === 0),
            true,
        );
    });

    await testCase.pos('search - keyword in name', async () => {
        const results = await searchItems({ keyword: 'Hello' });
        Assert.array(results);
        // doc1 标题含 Hello, doc3 正文含 Hello
        Assert.expect(results.length >= 2, true);
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc1.id), true);
        Assert.expect(ids.includes(doc3.id), true);
    });

    await testCase.pos('search - keyword in content', async () => {
        const results = await searchItems({
            keyword: 'test content',
        });
        Assert.array(results, 1);
        Assert.expect(results[0].id, doc1.id);
        Assert.expect(results[0].matches.length >= 1, true);
        Assert.expect(results[0].matches[0].field, 'content');
    });

    await testCase.pos('search - no match', async () => {
        const results = await searchItems({
            keyword: 'nonexistent-xyz',
        });
        Assert.array(results, 0);
    });

    // === 大小写敏感 ===

    await testCase.pos('search - case sensitive', async () => {
        const upper = await searchItems({ keyword: 'Hello' });
        const lower = await searchItems({ keyword: 'hello' });
        // "Hello" 应匹配到结果，"hello" 不应匹配
        Assert.expect(upper.length >= 1, true);
        Assert.expect(lower.length, 0);
    });

    // === 多匹配项归入同一文档 ===

    await testCase.pos('search - nearby matches merged', async () => {
        const results = await searchItems({ keyword: 'Hello' });
        const doc3Result = results.find((r) => r.id === doc3.id);
        Assert.expect(doc3Result !== undefined, true);
        // doc3 正文有两个 Hello 但距离很近，上下文窗口重叠，应合并为 1 条 content match
        const contentMatches = doc3Result.matches.filter(
            (m) => m.field === 'content',
        );
        Assert.expect(contentMatches.length, 1);
        // 合并后的 context 应同时包含两个 Hello
        const ctx = contentMatches[0].context;
        Assert.expect(ctx.indexOf('Hello') !== ctx.lastIndexOf('Hello'), true);
    });

    await testCase.pos('search - far apart matches not merged', async () => {
        const results = await searchItems({ keyword: 'Hello' });
        const doc4Result = results.find((r) => r.id === doc4.id);
        Assert.expect(doc4Result !== undefined, true);
        // doc4 正文有两个 Hello 但距离很远，不应合并
        const contentMatches = doc4Result.matches.filter(
            (m) => m.field === 'content',
        );
        Assert.expect(contentMatches.length, 2);
    });

    // === limit 参数 ===

    await testCase.pos('search - limit', async () => {
        const results = await searchItems({
            keyword: 'Hello',
            limit: 1,
        });
        Assert.array(results, 1);
    });

    await testCase.pos('search - limit capped at 30 with total', async () => {
        for (let i = 0; i < 35; i++) {
            await talaxy.post('/doc', {
                workspaceId: workspace1.id,
                name: `BulkSearch ${i}`,
            });
        }
        const response = await searchResponse({
            keyword: 'BulkSearch',
            limit: 100,
        });
        Assert.expect(response.total, 35);
        Assert.array(response.items, 30);
    });

    await testCase.neg('search - invalid limit', async () => {
        await talaxy.get('/search', { keyword: 'Hello', limit: 'abc' });
    });

    // === 按工作区限定搜索 ===

    await testCase.pos('search - filter by workspaceId', async () => {
        const results = await searchItems({
            keyword: 'Hello',
            workspaceId: workspace2.id,
        });
        Assert.array(results, 1);
        Assert.expect(results[0].id, doc3.id);
    });

    await testCase.pos('search - workspaceId with no match', async () => {
        const results = await searchItems({
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

    // === 时间范围筛选 ===

    await testCase.pos('search - filter by doc date range', async () => {
        const results = await searchItems({
            keyword: 'Hello',
            timeField: 'date',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        });
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc1.id), true);
        Assert.expect(ids.includes(doc4.id), true);
        Assert.expect(ids.includes(doc3.id), false);
    });

    await testCase.pos(
        'search - filter by doc date range with workspace and limit',
        async () => {
            const results = await searchItems({
                keyword: 'Hello',
                workspaceId: workspace2.id,
                timeField: 'date',
                startDate: '2024-03-01',
                endDate: '2024-03-31',
                limit: 1,
            });
            Assert.array(results, 1);
            Assert.expect(results[0].id, doc3.id);
        },
    );

    await testCase.pos('search - filter by createdAt range', async () => {
        const results = await searchItems({
            keyword: 'Hello',
            timeField: 'createdAt',
            startDate: today,
            endDate: today,
        });
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc1.id), true);
        Assert.expect(ids.includes(doc3.id), true);
    });

    await testCase.pos(
        'search - filter by createdAt range excludes future',
        async () => {
            const results = await searchItems({
                keyword: 'Hello',
                timeField: 'createdAt',
                startDate: tomorrow,
            });
            Assert.array(results, 0);
        },
    );

    await testCase.pos('search - default time field is updatedAt', async () => {
        const results = await searchItems({
            keyword: 'Hello',
            startDate: today,
            endDate: today,
        });
        Assert.expect(results.length >= 1, true);
    });

    await testCase.pos('search - startDate only', async () => {
        const results = await searchItems({
            keyword: 'Hello',
            timeField: 'date',
            startDate: '2024-03-01',
        });
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc3.id), true);
        Assert.expect(ids.includes(doc1.id), false);
    });

    await testCase.pos('search - endDate only', async () => {
        const results = await searchItems({
            keyword: 'Hello',
            timeField: 'date',
            endDate: '2024-01-31',
        });
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc1.id), true);
        Assert.expect(ids.includes(doc4.id), true);
        Assert.expect(ids.includes(doc3.id), false);
    });

    await testCase.neg('search - invalid timeField', async () => {
        await talaxy.get('/search', {
            keyword: 'Hello',
            timeField: 'created',
        });
    });

    await testCase.neg('search - invalid startDate', async () => {
        await talaxy.get('/search', {
            keyword: 'Hello',
            startDate: '2024-02-31',
        });
    });

    await testCase.neg('search - invalid date range', async () => {
        await talaxy.get('/search', {
            keyword: 'Hello',
            startDate: '2024-02-01',
            endDate: '2024-01-01',
        });
    });

    // === 索引字段同步 ===

    await testCase.pos('search - doc time fields indexed on create', async () => {
        const docItem = Controller.user('talaxy').docItems.content.find(
            (item) => item.id === indexDoc.id,
        );
        const docDir = Controller.workspace
            .ctr(workspace1.id)
            .content.docs.find((item) => item.docId === indexDoc.id);

        Assert.expect(typeof docItem.createdAt, 'number');
        Assert.expect(docItem.date, day('2024-04-10'));
        Assert.expect(typeof docItem.updatedAt, 'number');
        Assert.expect(typeof docDir.createdAt, 'number');
        Assert.expect(docDir.date, day('2024-04-10'));
        Assert.expect(typeof docDir.updatedAt, 'number');
    });

    await testCase.pos('search - doc date indexed on update', async () => {
        await talaxy.put(`/doc/${indexDoc.id}`, {
            date: day('2024-04-11'),
        });
        const docItem = Controller.user('talaxy').docItems.content.find(
            (item) => item.id === indexDoc.id,
        );
        const docDir = Controller.workspace
            .ctr(workspace1.id)
            .content.docs.find((item) => item.docId === indexDoc.id);

        Assert.expect(docItem.date, day('2024-04-11'));
        Assert.expect(docDir.date, day('2024-04-11'));
    });

    // === 结果排序：按 updatedAt 降序 ===

    await testCase.pos('search - sorted by updatedAt desc', async () => {
        const results = await searchItems({ keyword: 'Hello' });
        for (let i = 1; i < results.length; i++) {
            Assert.expect(
                results[i - 1].updatedAt >= results[i].updatedAt,
                true,
            );
        }
    });

    // === 返回数据结构校验 ===

    await testCase.pos('search - result item structure', async () => {
        const response = await searchResponse({ keyword: 'Hello' });
        Assert.expect(typeof response.total, 'number');
        Assert.array(response.items);
        const results = response.items;
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
        const before = await searchItems({ keyword: 'DeleteMe' });
        Assert.expect(before.length >= 1, true);
        // 删除文档
        await talaxy.delete(`/doc/${tempDoc.id}`);
        // 确认搜索不再找到
        const after = await searchItems({ keyword: 'DeleteMe' });
        Assert.array(after, 0);
    });

    // === 多词搜索（AND 匹配） ===

    await testCase.pos('search - multi-word AND match both', async () => {
        const results = await searchItems({
            keyword: 'Hello World',
        });
        Assert.array(results, 1);
        const ids = results.map((r) => r.id);
        Assert.expect(ids.includes(doc1.id), true);
    });

    await testCase.pos('search - multi-word AND missing second', async () => {
        const results = await searchItems({
            keyword: 'Hello nonexistent',
        });
        Assert.array(results, 0);
    });

    await testCase.pos('search - multi-word AND missing first', async () => {
        const results = await searchItems({
            keyword: 'nonexistent World',
        });
        Assert.array(results, 0);
    });

    await testCase.pos('search - multi-word no match', async () => {
        const results = await searchItems({
            keyword: 'foo bar',
        });
        Assert.array(results, 0);
    });

    await testCase.pos(
        'search - multi-word overlapping matches merged',
        async () => {
            const results = await searchItems({
                keyword: 'Hello World',
            });
            const doc1Result = results.find((r) => r.id === doc1.id);
            Assert.expect(doc1Result !== undefined, true);
            const nameMatches = doc1Result.matches.filter(
                (m) => m.field === 'name',
            );
            Assert.expect(nameMatches.length, 1);
        },
    );

    await testCase.pos(
        'search - multi-word with whitespace trimming',
        async () => {
            const results = await searchItems({
                keyword: '  Hello   World  ',
            });
            Assert.array(results, 1);
        },
    );

    return testCase;
}

module.exports = test;
