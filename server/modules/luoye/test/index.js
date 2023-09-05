const general = require('./general');
const deletion = require('./deletion');

async function test() {
    try {
        // 通用测试
        await general();

        // 删除操作测试
        await deletion();
    } catch (error) {
        console.log(error);
    }
}

module.exports = test;
