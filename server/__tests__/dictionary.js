const { Server } = require('../config');
const { TestCase, Rocket } = require('./utils');

async function test() {
    const testCase = new TestCase('Dictionary');
    const user = new Rocket(Server + '/dictionary');

    await testCase.neg('query', async () => {
        await user.get('/', { word: "government's" });
    });
}

module.exports = test;
