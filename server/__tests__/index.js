/**
 * 我准备写一些测试用例，我希望这个文件先测一些测试接口，然后引入其他测试文件执行测试
 *
 * 我打算简单地跑 curl 命令，然后检查返回值
 */

const { Rocket, TestCase } = require('./utils');
// const user = require('./user');
const luoye = require('./luoye');
const wordBank = require('./word-bank');
// const dictionary = require('./dictionary');
const statics = require('./statics');
const weaver = require('./weaver');

async function test() {
    try {
        await new TestCase('Echo').pos('echo', async () => {
            await new Rocket().post('/echo', { data: 'hello' });
        });

        // user 测试
        // await user();

        // word-bank 测试
        await wordBank();

        // dictionary 测试（已经稳定）
        // await dictionary();

        // statics 测试
        await statics();

        // weaver 测试
        await weaver();

        // luoye 测试
        await luoye();
    } catch (error) {
        console.log(error);
    }
}

test();
