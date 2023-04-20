/**
 * 我准备写一些测试用例，我希望这个文件先测一些测试接口，然后引入其他测试文件执行测试
 *
 * 我打算简单地跑 curl 命令，然后检查返回值
 */

const { exec } = require('child_process');
const { LOCAL_SERVER_URL } = require('../constants');

// 清除 temp 目录的内容
exec('rm -rf temp/*');

// 咱们先测一下 hello 接口
exec(`curl -X GET ${LOCAL_SERVER_URL}/hello`, (error, stdout, stderr) => {
    // 如果返回值不是期望值 "Hello"
    if (stdout !== 'Hello')
        return console.error('[Hello]: Wrong response: expect "Hello"');
    console.log('[Hello]: OK');
});

// 跑子测试
require('./word-bank');
