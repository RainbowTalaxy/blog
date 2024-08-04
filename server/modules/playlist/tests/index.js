const playlist = require('./playlist');
const { TestCase } = require('../../../utils/test');

async function test() {
    try {
        const testCase = new TestCase('Playlist');

        testCase.merge(await playlist());

        return testCase.stat();
    } catch (error) {
        console.log(error);
    }
}

module.exports = test;
