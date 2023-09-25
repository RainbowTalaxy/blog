const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const Controller = require('../controllerV2');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Luoye - User', true);

    const talaxy = new Rocket(Server + '/luoye');
    await talaxy.login('talaxy', 'talaxy');

    await testCase.pos('update workspaceItems', async () => {
        await talaxy.post('/workspace', {
            name: 'workspace1',
        });
        await talaxy.post('/workspace', {
            name: 'workspace2',
        });
        const workspaceItems = await talaxy.get('/workspaces');
        Assert.array(workspaceItems, 3);
        workspaceItems.forEach((wItem) =>
            Assert.props(wItem, PropList.user.workspaceItems),
        );
        await talaxy.put('/workspaces', {
            workspaceIds: workspaceItems.map((wItem) => wItem.id).reverse(),
        });
        const workspaceItems2 = await talaxy.get('/workspaces');
        Assert.array(workspaceItems2, 3);
        workspaceItems2.forEach((wItem) =>
            Assert.props(wItem, PropList.user.workspaceItems),
        );
        Assert.expect(workspaceItems[0].id, workspaceItems2[2].id);
        Assert.expect(workspaceItems[1].id, workspaceItems2[1].id);
        Assert.expect(workspaceItems[2].id, workspaceItems2[0].id);
    });

    await testCase.neg('update workspaceItems - lack of props', async () => {
        await talaxy.put('/workspaces', {});
    });

    await testCase.neg('update workspaceItems - invalid ids', async () => {
        await talaxy.put('/workspaces', {
            workspaceIds: ['invalid-id'],
        });
    });

    await testCase.neg('update workspaceItems - ids not match', async () => {
        const workspaceItems = await talaxy.get('/workspaces');
        await talaxy.put('/workspaces', {
            workspaceIds: Array(workspaceItems.length).fill(
                workspaceItems[0].id,
            ),
        });
    });

    Controller.clear();

    return testCase;
}

module.exports = test;
