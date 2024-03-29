const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const Controller = require('../controller');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Luoye - Init', true);

    const talaxy = new Rocket(Server + '/luoye');
    await talaxy.login('talaxy', 'talaxy');

    Controller.clear();

    await testCase.pos('init file check', async () => {
        const workspaceItems = await talaxy.get('/workspaces');
        Assert.array(workspaceItems, 1);
        Assert.props(workspaceItems[0], PropList.user.workspaceItem);
        const docItems = await talaxy.get('/docs');
        Assert.array(docItems, 0);
        const recentDocs = await talaxy.get('/recent-docs');
        Assert.array(recentDocs, 0);
        const docBin = await talaxy.get('/doc-bin');
        Assert.array(docBin, 0);
    });

    return testCase;
}

module.exports = test;
