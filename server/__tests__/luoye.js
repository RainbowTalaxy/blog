const { Server } = require('../config');
const { Rocket, TestCase } = require('./utils');

async function test() {
    const testCase = new TestCase('Luoye');

    const user = new Rocket(Server + '/luoye');
    await user.login('talaxy', 'talaxy');
    const visitor = new Rocket(Server + '/luoye');
    await visitor.login('allay', 'allay');
    // 游客（未登录）
    const viewer = new Rocket(Server + '/luoye');

    testCase.title('general tests');

    // 获取工作区列表
    await testCase.pos('workspace list', async () => {
        await user.get('/workspaces');
    });

    // 创建工作区
    const workspace = await testCase.pos(
        'create private workspace',
        async () => {
            const data = await user.post('/workspace', {
                name: 'test 1',
                description: 'some description',
                scope: 'private',
                nonExistProp: 'non exist prop', // 非法属性
            });
            if (data.nonExistProp) throw new Error('invalid prop exist');
            return data;
        },
    );

    // 创建工作区- 空 `name`
    await testCase.neg('create workspace - empty name', async () => {
        await user.post('/workspace', {
            description: 'some description',
            scope: 'public',
        });
    });

    // 创建工作区- 非法的 `scope`
    await testCase.neg('create workspace - wrong scope', async () => {
        await user.post('/workspace', {
            name: 'test 2',
            description: 'some description',
            scope: 'xxx',
        });
    });

    // 获取工作区信息
    await testCase.pos('workspace info', async () => {
        await user.get(`/workspace/${workspace.id}`);
    });

    // 获取工作区信息 - 假 `id`
    await testCase.neg('workspace info', async () => {
        await user.get(`/workspace/fake`);
    });

    // 获取工作区信息 - 访客
    await testCase.neg('private workspace info - visitor', async () => {
        await visitor.get(`/workspace/${workspace.id}`);
    });

    // 更新工作区
    await testCase.pos('update workspace to public', async () => {
        const params = {
            name: 'test 3',
            description: 'new description',
            scope: 'public',
            nonExistProp: 'non exist prop', // 非法属性
        };
        const data = await user.put(`/workspace/${workspace.id}`, params);
        if (data.name !== params.name) throw new Error('name not match');
        if (data.description !== params.description)
            throw new Error('description not match');
        if (data.scope !== params.scope) throw new Error('scope not match');
        if (data.nonExistProp) throw new Error('invalid prop exist');
        return data;
    });

    // 更新工作区- 假 `id`
    await testCase.neg('update workspace - fake id', async () => {
        return await user.put(`/workspace/fake`, {
            name: 'test 4',
        });
    });

    // 获取工作区信息 - 访客
    await testCase.pos('public workspace info - visitor', async () => {
        await visitor.get(`/workspace/${workspace.id}`);
    });

    // 获取工作区信息 - 游客
    await testCase.pos('public workspace info - visitor', async () => {
        await viewer.get(`/workspace/${workspace.id}`);
    });

    // 更新工作区 - 访客
    await testCase.neg('update workspace - visitor', async () => {
        return await visitor.put(`/workspace/${workspace.id}`, {
            scope: 'private',
        });
    });

    // 新建文档
    const doc = await testCase.pos('create public doc', async () => {
        const params = {
            workspaceId: workspace.id,
            nonExistProp: 'non exist prop', // 非法属性
        };
        const data = await user.post(`/doc`, params);
        if (!data.workspaces.includes(workspace.id))
            throw new Error('not related to workspace');
        if (data.nonExistProp) throw new Error('invalid prop exist');
        return data;
    });

    // 获取文档列表
    await testCase.pos('doc list', async () => {
        const data = await user.get('/docs');
        if (data.length !== 1) throw new Error('doc list not match');
    });

    // 获取文档
    await testCase.pos('public doc info', async () => {
        await user.get(`/doc/${doc.id}`);
    });

    // 获取文档 - 假 `id`
    await testCase.neg('public doc info - fake id', async () => {
        await user.get(`/doc/fake`);
    });

    // 获取文档 - 访客
    await testCase.pos('public doc info - visitor', async () => {
        await visitor.get(`/doc/${doc.id}`);
    });

    // 获取文档 - 游客
    await testCase.pos('public doc info - visitor', async () => {
        await viewer.get(`/doc/${doc.id}`);
    });

    // 更新文档
    await testCase.pos('update doc to private', async () => {
        const params = {
            name: 'test 5',
            content: 'some content',
            scope: 'private',
            nonExistProp: 'non exist prop', // 非法属性
        };
        const data = await user.put(`/doc/${doc.id}`, params);
        if (data.name !== params.name) throw new Error('name not match');
        if (data.content !== params.content)
            throw new Error('content not match');
        if (data.scope !== params.scope) throw new Error('scope not match');
        if (data.nonExistProp) throw new Error('invalid prop exist');
        return data;
    });

    // 更新文档 - 访客
    await testCase.neg('update private doc - visitor', async () => {
        return await visitor.put(`/doc/${doc.id}`, {
            scope: 'public',
        });
    });

    // 获取文档 - 访客
    await testCase.neg('private doc info - visitor', async () => {
        await visitor.get(`/doc/${doc.id}`);
    });

    // 删除文档 - 访客
    await testCase.neg('delete private doc - visitor', async () => {
        await visitor.delete(`/doc/${doc.id}`);
    });

    // 删除文档
    await testCase.pos('delete private doc', async () => {
        await user.delete(`/doc/${doc.id}`);
    });

    // ## 工作区与文档 `scope` 一致性测试
    testCase.title('workspace & doc scope consistency');

    // 更新工作区 `scope`
    await testCase.pos('update workspace scope to private', async () => {
        await user.put(`/workspace/${workspace.id}`, {
            scope: 'private',
        });
    });

    // 创建文档
    const doc2 = await testCase.pos('create private doc', async () => {
        return await user.post(`/doc`, {
            workspaceId: workspace.id,
            nonExistProp: 'non exist prop', // 非法属性
        });
    });

    // 获取文档 - 访客
    await testCase.neg('private doc info - visitor', async () => {
        await visitor.get(`/doc/${doc2.id}`);
    });
}

module.exports = test;
