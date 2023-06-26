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

const auth = {
    id: 'talaxy',
    key: 'talaxy',
};

async function test() {
    // 测试一下创建项目
    await request(
        'Weaver - create project',
        curl(`${BASE_PATH}/${userId}/project`, 'POST', project, auth),
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
        curl(`${BASE_PATH}/${userId}/projects`, 'GET', {}, auth),
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
        curl(`${BASE_PATH}/${userId}/project/${project.id}`, 'GET', {}, auth),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 测试一下修改项目信息
    await request(
        'Weaver - modify project',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}`,
            'PUT',
            {
                name: 'another_name',
            },
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    let cycle;

    // 测试一下获取周期信息
    await request(
        'Weaver - get project cycles',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycles`,
            'GET',
            {},
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            cycle = response[0];

            resolve();
        },
    );

    let newCycle;

    // 测试一下创建周期
    await request(
        'Weaver - create cycle',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycle`,
            'POST',
            {},
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            newCycle = response;

            resolve();
        },
    );

    // 测试一下获取周期信息
    await request(
        'Weaver - get cycle',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycle/${cycle.id}`,
            'GET',
            {},
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error)
                return reject('Expect "success"', response.error);

            resolve();
        },
    );

    let task = {
        name: 'some_name',
        description: 'some_description',
        priority: 1,
        status: 1,
    };

    // 创建任务
    await request(
        'Weaver - create task',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycle/${cycle.id}/task`,
            'POST',
            task,
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            task = response;

            resolve();
        },
    );

    // 修改任务
    await request(
        'Weaver - modify task',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycle/${cycle.id}/task/${task.id}`,
            'PUT',
            { status: 2 },
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error)
                return reject('Expect "success"', response.error);

            resolve();
        },
    );

    // 移动任务周期
    await request(
        'Weaver - move task',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycle/${cycle.id}/task/${task.id}`,
            'PUT',
            { cycleId: newCycle.id },
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 删除任务
    await request(
        'Weaver - delete task',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}/cycle/${cycle.id}/task/${task.id}`,
            'DELETE',
            {},
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );

    // 删除项目
    await request(
        'Weaver - delete project',
        curl(
            `${BASE_PATH}/${userId}/project/${project.id}`,
            'DELETE',
            {},
            auth,
        ),
        (response, resolve, reject) => {
            if (response.error) return reject('Expect "success"');

            resolve();
        },
    );
}

module.exports = test;
