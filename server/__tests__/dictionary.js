const { Server } = require('../config');
const { Rocket, TestCase } = require('../utils/test');

async function test() {
    const testCase = new TestCase('Dictionary');
    const user = new Rocket(Server + '/dictionary');

    await testCase.neg('query', async () => {
        await user.get('/', { word: "government's" });
    });

    return testCase.stat();
}

module.exports = test;
