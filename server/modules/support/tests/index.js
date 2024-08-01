const log = require('./log');
const { TestCase } = require('../../../utils/test');

async function test() {
    try {
        const testCase = new TestCase('Support');

        // 日志
        testCase.merge(await log());

        return testCase.stat();
    } catch (error) {
        console.log(error);
    }
}

module.exports = test;
