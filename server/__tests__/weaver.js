const { Dir, Server } = require('../config');
const { readJSON } = require('../utils');
const { Rocket, TestCase } = require('./utils');

const PROJECTS_DIR = Dir.storage.projects;

async function test() {
    const testCase = new TestCase('Weaver');

    const rocket = new Rocket(Server + '/weaver');
    await rocket.login('talaxy', 'talaxy');

    // 创建项目
    const project = await testCase.pos('create project', async () => {
        const data = await rocket.post('/project', {
            name: 'some_name',
        });
        // 读取测试数据中的 meta 文件
        let list = readJSON(`${PROJECTS_DIR}/list.json`);

        if (!list.some((item) => item.name === data.name)) {
            throw new Error('Expect project created');
        }

        return data;
    });

    // 查看项目列表
    await testCase.pos('list projects', async () => {
        const data = await rocket.get('/projects');

        if (data.length === 0) {
            throw new Error('Expect project list');
        }
    });

    // 查看项目
    await testCase.pos('get project', async () => {
        await rocket.get(`/project/${project.id}`);
    });

    // 修改项目信息
    await testCase.pos('modify project', async () => {
        await rocket.put(`/project/${project.id}`, {
            name: 'some_name',
        });
    });

    // 获取周期信息
    const cycle = await testCase.pos('get cycles', async () => {
        const cycles = await rocket.get(`/project/${project.id}/cycles`);
        return cycles[0];
    });

    // 创建周期
    const newCycle = await testCase.pos('create cycle', async () => {
        return await rocket.post(`/project/${project.id}/cycle`, {
            name: 'some_name',
            description: 'some_description',
        });
    });

    // 获取周期信息
    await testCase.pos('get cycle', async () => {
        await rocket.get(`/project/${project.id}/cycle/${cycle.id}`);
    });

    // 获取任务池
    await testCase.pos('get task pool', async () => {
        await rocket.get(`/project/${project.id}/cycle/pool`);
    });

    // 创建任务
    const task = await testCase.pos('create task', async () => {
        return await rocket.post(
            `/project/${project.id}/cycle/${cycle.id}/task`,
            {
                name: 'some_name',
                description: 'some_description',
                priority: 1,
                status: 1,
            },
        );
    });

    // 修改任务
    await testCase.pos('modify task', async () => {
        await rocket.put(
            `/project/${project.id}/cycle/${cycle.id}/task/${task.id}`,
            {
                status: 2,
            },
        );
    });

    // 移动任务周期
    await testCase.pos('move task', async () => {
        await rocket.put(
            `/project/${project.id}/cycle/${cycle.id}/task/${task.id}/move`,
            {
                cycleId: newCycle.id,
            },
        );
    });

    // 删除任务
    await testCase.pos('delete task', async () => {
        await rocket.delete(
            `/project/${project.id}/cycle/${newCycle.id}/task/${task.id}`,
        );
    });

    // 删除项目
    await testCase.pos('delete project', async () => {
        await rocket.delete(`/project/${project.id}`);
    });
}

module.exports = test;
