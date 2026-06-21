const { Server } = require('../config');
const Assert = require('../utils/assert');
const { Rocket, TestCase } = require('../utils/test');

async function test() {
    const testCase = new TestCase('Shortcut');

    const baseUrl = Server + '/shortcut';
    const admin = new Rocket(baseUrl);
    await admin.login('talaxy', 'talaxy');

    let shortcutId1 = '';
    let shortcutId2 = '';

    // ==================== POST 创建短链 ====================

    await testCase.pos('create shortcut with random id', async () => {
        const shortcut = await admin.post('/', {
            url: 'https://www.example.com/very/long/url/path',
            name: 'Example Site',
        });
        Assert.props(shortcut, [
            'id',
            'url',
            'isCustom',
            'name',
            'createdAt',
            'visits',
        ]);
        Assert.expect(
            shortcut.url,
            'https://www.example.com/very/long/url/path',
        );
        Assert.expect(shortcut.name, 'Example Site');
        Assert.expect(shortcut.isCustom, false);
        Assert.expect(shortcut.visits, 0);
        Assert.expect(shortcut.id.length, 6);
        shortcutId1 = shortcut.id;
    });

    await testCase.pos('create shortcut with custom id', async () => {
        const shortcut = await admin.post('/', {
            url: 'https://github.com',
            customId: 'github',
            name: 'GitHub',
        });
        Assert.expect(shortcut.id, 'github');
        Assert.expect(shortcut.url, 'https://github.com');
        Assert.expect(shortcut.isCustom, true);
        Assert.expect(shortcut.visits, 0);
        shortcutId2 = shortcut.id;
    });

    await testCase.pos('create shortcut without name', async () => {
        const shortcut = await admin.post('/', {
            url: 'https://www.test.com',
        });
        Assert.expect(shortcut.name, undefined);
    });

    await testCase.neg('create shortcut - missing url', async () => {
        await admin.post('/', {
            customId: 'test',
        });
    });

    await testCase.neg('create shortcut - invalid url format', async () => {
        await admin.post('/', {
            url: 'not-a-valid-url',
        });
    });

    await testCase.neg(
        'create shortcut - invalid custom id (too short)',
        async () => {
            await admin.post('/', {
                url: 'https://example.com',
                customId: 'ab',
            });
        },
    );

    await testCase.neg(
        'create shortcut - invalid custom id (too long)',
        async () => {
            await admin.post('/', {
                url: 'https://example.com',
                customId: 'a'.repeat(21),
            });
        },
    );

    await testCase.neg(
        'create shortcut - invalid custom id (special chars)',
        async () => {
            await admin.post('/', {
                url: 'https://example.com',
                customId: 'test@123',
            });
        },
    );

    await testCase.neg('create shortcut - duplicate custom id', async () => {
        await admin.post('/', {
            url: 'https://example.com',
            customId: 'github',
        });
    });

    await testCase.neg(
        'create shortcut - unauthorized (no login)',
        async () => {
            const guest = new Rocket(baseUrl);
            await guest.post('/', {
                url: 'https://example.com',
            });
        },
    );

    // ==================== GET 访问短链（重定向） ====================
    // 注意：重定向功能需要人工测试，测试框架无法正确处理 302 重定向

    // ==================== GET 获取短链信息（管理员） ====================

    await testCase.pos('get shortcut info', async () => {
        const info = await admin.get(`/info/${shortcutId1}`);
        Assert.props(info, [
            'id',
            'url',
            'isCustom',
            'name',
            'createdAt',
            'visits',
        ]);
        Assert.expect(info.id, shortcutId1);
        Assert.expect(info.url, 'https://www.example.com/very/long/url/path');
        Assert.expect(info.visits, 0);
    });

    await testCase.pos('get shortcut info - custom id', async () => {
        const info = await admin.get(`/info/${shortcutId2}`);
        Assert.expect(info.id, 'github');
        Assert.expect(info.isCustom, true);
    });

    await testCase.neg('get shortcut info - not found', async () => {
        await admin.get('/info/nonexistent');
    });

    await testCase.neg('get shortcut info - unauthorized', async () => {
        const guest = new Rocket(baseUrl);
        await guest.get(`/info/${shortcutId1}`);
    });

    // ==================== GET 获取所有短链列表（管理员） ====================

    await testCase.pos('get shortcuts list', async () => {
        const list = await admin.get('/list');
        Assert.expect(Array.isArray(list), true);
        Assert.expect(list.length >= 3, true); // 至少创建了 3 个短链
        // 验证按创建时间倒序排列
        for (let i = 0; i < list.length - 1; i++) {
            Assert.expect(list[i].createdAt >= list[i + 1].createdAt, true);
        }
        // 验证第一个短链包含必要字段（name 是可选的）
        const firstItem = list[0];
        if (firstItem.name !== undefined) {
            Assert.props(firstItem, [
                'id',
                'url',
                'isCustom',
                'name',
                'createdAt',
                'visits',
            ]);
        } else {
            Assert.props(firstItem, [
                'id',
                'url',
                'isCustom',
                'createdAt',
                'visits',
            ]);
        }
    });

    await testCase.neg('get shortcuts list - unauthorized', async () => {
        const guest = new Rocket(baseUrl);
        await guest.get('/list');
    });

    // ==================== PUT 更新短链（管理员） ====================

    await testCase.pos('update shortcut - url only', async () => {
        const updated = await admin.put(`/${shortcutId1}`, {
            url: 'https://www.new-example.com',
        });
        Assert.expect(updated.id, shortcutId1);
        Assert.expect(updated.url, 'https://www.new-example.com');
        Assert.expect(updated.name, 'Example Site'); // name 保持不变
    });

    await testCase.pos('update shortcut - name only', async () => {
        const updated = await admin.put(`/${shortcutId2}`, {
            name: 'GitHub Official',
        });
        Assert.expect(updated.id, shortcutId2);
        Assert.expect(updated.url, 'https://github.com'); // url 保持不变
        Assert.expect(updated.name, 'GitHub Official');
    });

    await testCase.pos('update shortcut - url and name', async () => {
        const updated = await admin.put(`/${shortcutId1}`, {
            url: 'https://www.updated-example.com',
            name: 'Updated Example',
        });
        Assert.expect(updated.url, 'https://www.updated-example.com');
        Assert.expect(updated.name, 'Updated Example');
    });

    await testCase.pos('update shortcut - clear name', async () => {
        const updated = await admin.put(`/${shortcutId2}`, {
            name: '',
        });
        Assert.expect(updated.name, undefined);
    });

    await testCase.neg('update shortcut - not found', async () => {
        await admin.put('/nonexistent', {
            url: 'https://example.com',
        });
    });

    await testCase.neg('update shortcut - empty url', async () => {
        await admin.put(`/${shortcutId1}`, {
            url: '',
        });
    });

    await testCase.neg('update shortcut - invalid url format', async () => {
        await admin.put(`/${shortcutId1}`, {
            url: 'not-a-valid-url',
        });
    });

    await testCase.neg('update shortcut - unauthorized', async () => {
        const guest = new Rocket(baseUrl);
        await guest.put(`/${shortcutId1}`, {
            url: 'https://example.com',
        });
    });

    // ==================== DELETE 删除短链（管理员） ====================

    // 创建一个用于删除测试的短链
    let deleteTestId = '';
    await testCase.pos('create shortcut for delete test', async () => {
        const shortcut = await admin.post('/', {
            url: 'https://to-be-deleted.com',
            customId: 'delete-test',
        });
        deleteTestId = shortcut.id;
    });

    await testCase.pos('delete shortcut', async () => {
        const result = await admin.delete(`/${deleteTestId}`);
        Assert.expect(result.success, true);
    });

    await testCase.neg('delete shortcut - verify deleted', async () => {
        await admin.get(`/info/${deleteTestId}`);
    });

    await testCase.neg('delete shortcut - not found', async () => {
        await admin.delete('/nonexistent');
    });

    await testCase.neg('delete shortcut - unauthorized', async () => {
        const guest = new Rocket(baseUrl);
        await guest.delete(`/${shortcutId1}`);
    });

    // 最后清理测试数据
    await testCase.pos('cleanup - delete test shortcuts', async () => {
        try {
            await admin.delete(`/${shortcutId1}`);
        } catch (e) {}
        try {
            await admin.delete(`/${shortcutId2}`);
        } catch (e) {}
    });

    return testCase.stat();
}

module.exports = test;
