const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');

async function test() {
    const testCase = new TestCase('Luoye - Doc History', true);
    const user = new Rocket(Server + '/luoye');
    await user.login('talaxy', 'talaxy');

    const workspace = await user.post('/workspace', {
        name: 'doc-history-workspace',
    });

    await testCase.pos('frequent saves only keep one previous backup', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'history doc',
        });

        let history = await user.get(`/doc/${doc.id}/history`);
        Assert.expect(history.previous, null);
        Assert.array(history.history, 0);

        await user.put(`/doc/${doc.id}`, { content: 'version-1' });
        history = await user.get(`/doc/${doc.id}/history`);
        Assert.expect(history.previous.content, '');
        Assert.array(history.history, 0);

        history = await user.post(`/doc/${doc.id}/history`, {
            reason: 'edit-start',
        });
        Assert.array(history.history, 1);
        Assert.expect(history.history[0].content, 'version-1');

        for (const content of ['version-2', 'version-3', 'version-4', 'version-5']) {
            await user.put(`/doc/${doc.id}`, { content });
        }

        history = await user.get(`/doc/${doc.id}/history`);
        Assert.array(history.history, 1);
        Assert.expect(history.previous.content, 'version-4');

        const restored = await user.post(
            `/doc/${doc.id}/history/previous/restore`,
        );
        Assert.expect(restored.content, 'version-4');

        history = await user.get(`/doc/${doc.id}/history`);
        Assert.array(history.history, 2);
        Assert.expect(history.previous.content, 'version-5');
    });

    await testCase.pos('restoring history preserves the current version', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'restore history',
        });
        await user.put('/doc/' + doc.id, { content: 'old-content' });
        await user.post(`/doc/${doc.id}/history`, { reason: 'edit-start' });
        await user.put(`/doc/${doc.id}`, { content: 'current-content' });

        let history = await user.get(`/doc/${doc.id}/history`);
        const oldVersion = history.history.find(
            (item) => item.content === 'old-content',
        );
        Assert.negExpect(oldVersion, undefined);

        const restored = await user.post(
            `/doc/${doc.id}/history/${oldVersion.id}/restore`,
        );
        Assert.expect(restored.content, 'old-content');

        history = await user.get(`/doc/${doc.id}/history`);
        Assert.expect(
            history.history.some((item) => item.content === 'current-content'),
            true,
        );
        Assert.expect(
            history.history.some((item) => item.content === 'old-content'),
            true,
        );
    });

    await testCase.pos('history is capped and hidden from normal doc reads', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
            name: 'capped history',
        });

        for (let index = 0; index < 25; index += 1) {
            await user.put(`/doc/${doc.id}`, {
                content: `content-${index}`,
            });
            await user.post(`/doc/${doc.id}/history`, {
                reason: 'edit-start',
            });
        }

        const history = await user.get(`/doc/${doc.id}/history`);
        Assert.array(history.history, 20);

        const publicDoc = await user.get(`/doc/${doc.id}`);
        Assert.expect(publicDoc.history, undefined);
        Assert.expect(publicDoc.previousBackup, undefined);
        Assert.expect(publicDoc.lastModifiedBy, undefined);
    });

    await testCase.neg('invalid history reason', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        await user.post(`/doc/${doc.id}/history`, { reason: 'invalid' });
    });

    await testCase.neg('restore missing history', async () => {
        const doc = await user.post('/doc', {
            workspaceId: workspace.id,
        });
        await user.post(`/doc/${doc.id}/history/missing/restore`);
    });

    return testCase;
}

module.exports = test;
