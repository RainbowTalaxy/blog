const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const Controller = require('../controllerV2');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Luoye - Init');

    const talaxy = new Rocket(Server + '/luoye');
    await talaxy.login('talaxy', 'talaxy');

    await testCase.pos('init file check', async () => {
        const workspaceItems = await talaxy.get('/workspaces');
        Assert.array(workspaceItems, 1);
        Assert.props(workspaceItems[0], PropList.user.workspaceItems);
        const docItems = await talaxy.get('/docs');
        Assert.array(docItems, 0);
        const recentDocs = await talaxy.get('/recent-docs');
        Assert.array(recentDocs, 0);
        const docBin = await talaxy.get('/doc-bin');
        Assert.array(docBin, 0);
    });

    Controller.clear();
}

module.exports = test;
