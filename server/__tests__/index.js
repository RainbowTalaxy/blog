process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { Rocket, TestCase } = require('../utils/test');
const user = require('./user');
const luoye = require('../modules/luoye/tests');
const wordBank = require('./word-bank');
const dictionary = require('./dictionary');
const statics = require('./statics');
const weaver = require('./weaver');
const support = require('../modules/support/tests');

require('../config');

async function test() {
    try {
        const testCase = new TestCase('Echo');
        await testCase.pos('echo', async () => {
            await new Rocket().post('/echo', { data: 'hello' });
        });
        testCase.stat();

        // user 测试
        await user();

        // support 测试
        await support();

        // word-bank 测试
        await wordBank();

        // dictionary 测试
        await dictionary();

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
