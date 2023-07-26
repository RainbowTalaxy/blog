/**
 * 我准备写一些测试用例，我希望这个文件先测一些测试接口，然后引入其他测试文件执行测试
 *
 * 我打算简单地跑 curl 命令，然后检查返回值
 */

const { testCase, Rocket } = require('./utils');
// const user = require('./user');
const luoye = require('./luoye');
const wordBank = require('./word-bank');
// const dictionary = require('./dictionary');
const statics = require('./statics');
const weaver = require('./weaver');

async function test() {
    try {
        await testCase.pos('[Echo]', async () => {
            await new Rocket().post('/echo', { data: 'hello' });
        });

        // user 测试
        // await user();

        // luoye 测试
        await luoye();

        // word-bank 测试
        await wordBank();

        // dictionary 测试（已经稳定）
        // await dictionary();

        // statics 测试
        await statics();

        // weaver 测试
        await weaver();
    } catch (error) {
        console.log(error);
    }
}

test();
