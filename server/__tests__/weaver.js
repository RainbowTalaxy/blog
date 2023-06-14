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
    name: 'some_name',
};

const userId = 'test';

let cycle;

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

            if (!list.some((item) => item.name === project.name)) {
                return reject('Expect project created');
            }

            resolve();
        },
    );

    // 测试一下查看项目列表
    await request(
        'Weaver - list projects',
        curl(`${BASE_PATH}/${userId}/projects`, 'GET'),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            // 读取测试数据中的 meta 文件
            let list = fs.readFileSync(`${PROJECTS_DIR}/list.json`, 'utf-8');
            list = JSON.parse(list);

            if (list.length === 0) {
                return reject('Expect project list');
            }

            project.id = list[0].id;

            resolve();
        },
    );

    // 测试一下查看项目
    await request(
        'Weaver - get project',
        curl(`${BASE_PATH}/${userId}/project/${project.id}`, 'GET'),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 测试一下修改项目信息
    await request(
        'Weaver - modify project',
        curl(`${BASE_PATH}/${userId}/project/${project.id}`, 'PUT', {
            name: 'another_name',
        }),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 测试一下获取周期信息
    await request(
        'Weaver - get project cycles',
        curl(`${BASE_PATH}/${userId}/project/${project.id}/cycles`, 'GET'),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            cycle = response[0];

            resolve();
        },
    );

    // 测试一下创建周期
    await request(
        'Weaver - create cycle',
        curl(`${BASE_PATH}/${userId}/project/${project.id}/cycle`, 'POST'),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 测试一下获取周期信息
    await request(
        'Weaver - get cycle',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycle/${cycle.id}`,
            'GET',
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );
}

module.exports = test;
