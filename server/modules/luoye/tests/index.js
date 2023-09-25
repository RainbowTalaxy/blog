const init = require('./init');
const workspace = require('./workspace');
const user = require('./user');
const scope = require('./scope');
const general = require('./general');
const recentDocs = require('./recent-docs');
const deletion = require('./deletion');

async function test() {
    try {
        // 初始化
        await init();

        // 工作区相关
        await workspace();

        // 用户相关
        await user();

        // 权限相关
        await scope();

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
