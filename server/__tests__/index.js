const { Rocket, TestCase } = require('./utils');
const user = require('./user');
const luoye = require('./luoye');
const wordBank = require('./word-bank');
const dictionary = require('./dictionary');
const statics = require('./statics');
const weaver = require('./weaver');

require('../config');

async function test() {
    try {
        await new TestCase('Echo').pos('echo', async () => {
            await new Rocket().post('/echo', { data: 'hello' });
        });

        // user 测试
        await user();

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
