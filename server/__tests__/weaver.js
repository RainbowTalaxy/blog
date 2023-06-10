/**
 * weaver 的测试用例
 *
 * 使用 curl 命令测试接口
 */

const fs = require('fs');
const { Dir, APIKey } = require('../config');
const { request, curl } = require('./utils');

const BASE_PATH = '/weaver';
const PROJECTS_DIR = Dir.storage.projects;

// 定义一个项目的测试数据
const project = {
    id: 'some_uuid',
    name: 'some_name',
};

const userId = 'test';

async function test() {
    // 测试一下创建项目
    await request(
        'Weaver - create project',
        curl(`${BASE_PATH}/${userId}/project`, 'POST', project),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            // 读取测试数据中的 meta 文件
            let list = fs.readFileSync(`${PROJECTS_DIR}/list.json`, 'utf-8');
            list = JSON.parse(list);

            if (!list.some((item) => item.id === project.id)) {
                return reject('Expect project created');
            }

            resolve();
        },
    );
}

module.exports = test;
