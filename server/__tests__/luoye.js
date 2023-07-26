const { Server } = require('../config');
const { Rocket, testCase } = require('./utils');

async function test() {
    const user = new Rocket(Server + '/luoye');
    await user.login('talaxy', 'talaxy');
    const visitor = new Rocket(Server + '/luoye');
    await visitor.login('allay', 'allay');

    // 获取工作区列表
    await testCase.pos('[Luoye] workspace list', async () => {
        await user.get('/workspaces');
    });

    // 创建工作区
    const workspace = await testCase.pos(
        '[Luoye] create workspace',
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
    await testCase.neg('[Luoye] create workspace - empty name', async () => {
        await user.post('/workspace', {
            description: 'some description',
            scope: 'public',
        });
    });

    // 创建工作区- 非法的 `scope`
    await testCase.neg('[Luoye] create workspace - wrong scope', async () => {
        await user.post('/workspace', {
            name: 'test 2',
            description: 'some description',
            scope: 'xxx',
        });
    });

    // 获取工作区信息
    await testCase.pos('[Luoye] workspace info', async () => {
        await user.get(`/workspace/${workspace.id}`);
    });

    // 获取工作区信息 - 假 id
    await testCase.neg('[Luoye] workspace info', async () => {
        await user.get(`/workspace/fake`);
    });

    // 获取工作区信息 - 访客
    await testCase.neg('[Luoye] workspace info - visitor', async () => {
        await visitor.get(`/workspace/${workspace.id}`);
    });

    // 更新工作区
    await testCase.pos('[Luoye] update workspace', async () => {
        const params = {
            name: 'test 3',
            description: 'new description',
            scope: 'public',
            nonExistProp: 'non exist prop', // 非法属性
        };
        const data = await user.put(`/workspace/${workspace.id}`, params);
        if (data.nonExistProp) throw new Error('invalid prop exist');
        return data;
    });

    // 更新工作区 - `docs`
    await testCase.pos('[Luoye] update workspace - docs', async () => {
        await user.put(`/workspace/${workspace.id}`, {
            docs: [
                {
                    docId: 'xxx',
                    name: 'xxx',
                    docs: [],
                },
            ],
        });
    });

    // 更新工作区 - 无效的 `docs`
    await testCase.neg('[Luoye] update workspace - invalid docs', async () => {
        await user.put(`/workspace/${workspace.id}`, {
            docs: [
                {
                    docId: 'xxx',
                    name: 'xxx',
                    docs: 'xxx',
                },
            ],
        });
    });

    // 更新工作区- 假 id
    await testCase.neg('[Luoye] update workspace - fake id', async () => {
        return await user.put(`/workspace/fake`, {
            name: 'test 4',
        });
    });

    // 获取工作区信息 - 访客
    await testCase.pos('[Luoye] workspace info - visitor', async () => {
        await visitor.get(`/workspace/${workspace.id}`);
    });

    // 更新工作区 - 访客
    await testCase.neg('[Luoye] update workspace - visitor', async () => {
        const params = {
            scope: 'private',
        };
        return await visitor.put(`/workspace/${workspace.id}`, params);
    });
}

module.exports = test;
