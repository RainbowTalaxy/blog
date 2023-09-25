const init = require('./init');
const workspace = require('./workspace');
const user = require('./user');
const scope = require('./scope');
const general = require('./general');
const recentDocs = require('./recent-docs');
const deletion = require('./deletion');
const { TestCase } = require('../../../utils/test');

async function test() {
    try {
        const testCase = new TestCase('Luoye');

        // 初始化
        testCase.merge(await init());

        // 工作区相关
        testCase.merge(await workspace());

        // 用户相关
        testCase.merge(await user());

        // 权限相关
        testCase.merge(await scope());

        // 通用测试
        testCase.merge(await general());

        // 最近文档测试
        testCase.merge(await recentDocs());

        // 删除操作测试
        testCase.merge(await deletion());

        return testCase.stat();
    } catch (error) {
        console.log(error);
    }
}

module.exports = test;
