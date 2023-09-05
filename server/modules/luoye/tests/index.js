const general = require('./general');
const recentDocs = require('./recent-docs');
const deletion = require('./deletion');

async function test() {
    try {
        // 通用测试
        await general();

        // 最近文档测试
        await recentDocs();

        // 删除操作测试
        await deletion();
    } catch (error) {
        console.log(error);
    }
}

module.exports = test;
