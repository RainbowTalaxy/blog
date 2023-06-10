/**
 * # 项目管理 Weaver
 *
 * ## 需求概要
 *
 * 将一周 7 天算作一个周期，每个周期可以有自己的任务，不过用户应当关注当前周期的任务。一般来说，用户可以在周期开始前布置好任务，然后在周期结束后查看任务完成情况。
 *
 * ## 模型
 *
 * - 用户 User
 * - 项目 Project
 *  + 项目 ID id
 *  + 项目名称 name
 *  + 所有者 owner
 *  + 创建时间 createdAt
 *  + 所有任务 tasks
 *  + 所有周期 cycles
 *  + 当前周期 currentCycle
 * - 任务 Task
 * - 周期 Cycle
 *
 * 关联关系：
 *
 * - 一个项目可以有多个用户
 * - 一个项目可以有多个任务
 * - 一个项目可以有多个周期
 * - 一个周期可以有多个任务
 *
 * ## 数据存储方案
 *
 * - projects 文件下用一个 list.json 文件存储所有项目数据
 * - 每个项目用一个文件夹存储，文件夹名为 [project_id].json
 * - 每个项目文件夹下用一个 cycles.json 文件存储项目的所有周期数据
 * - 项目文件夹下用 [cycle_id].json 存储每个周期的数据
 * - 每个周期文件里存储周期的信息及任务列表
 *
 * ## 接口
 *
 * - 查看项目列表 GET /:userId
 * - 创建项目    POST /:userId/project
 * - 查看项目    GET /:userId/project/:projectId
 * - 修改项目    PUT /:userId/project/:projectId
 * - 查看周期列表 GET /:userId/project/:projectId/cycle
 * - 创建周期    POST /:userId/project/:projectId/cycle
 * - 查看任务
 * - 创建任务
 * - 修改任务
 * - 删除任务
 *
 * 下面开始写 API 吧！
 */

const express = require('express');
const path = require('path');
const { Dir } = require('../config');
const { uuid } = require('../utils');
const { mkdirp } = require('mkdirp');
const router = express.Router();

const LIST_PATH = path.join(Dir.storage.projects, 'list.json');
const CYCLE_LIST_NAME = 'cycles.json';

const DEFAULT_CYCLE_DURATION = 7 * 24 * 60 * 60 * 1000;

const FileHandler = {
    readList: () => {
        const list = fs.readFileSync(LIST_PATH, 'utf8');
        return JSON.parse(list);
    },
    writeList: (list) => {
        fs.writeFileSync(LIST_PATH, JSON.stringify(list));
    },
    initProject: (projectId) => {
        const projectDir = path.join(Dir.storage.projects, `${projectId}`);
        mkdirp.sync(projectDir);
        const timestamp = new Date();
        const firstCycle = {
            id: uuid(),
            idx: 0,
            start: timestamp,
            end: timestamp + DEFAULT_CYCLE_DURATION,
        };
        const cyclesPath = path.join(projectDir, CYCLE_LIST_NAME);
        fs.writeFileSync(cyclesPath, JSON.stringify([firstCycle]));
        const firstCycleTasksPath = path.join(
            projectDir,
            `${firstCycle.id}.json`,
        );
        fs.writeFileSync(firstCycleTasksPath, JSON.stringify({ tasks: [] }));
    },
    getProjectPath: (projectId) => {
        const projectDir = path.join(Dir.storage.projects, `${projectId}`);
        return fs.existsSync(projectDir) ? projectDir : null;
    },
};

// 查看项目列表
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).send({
            error: 'userId is required',
        });
    }
    const list = FileHandler.readList();
    const projects = list.filter((project) => project.owner === userId);
    return res.send(projects);
});

// 创建项目
router.post('/:userId/project', async (req, res) => {
    const { userId } = req.params;
    const { name } = req.body;
    if (!userId || !name) {
        return res.status(400).send({
            error: 'userId/name is required',
        });
    }
    const project = {
        ...req.body,
        id: uuid(),
        name,
        owner: userId,
        createdAt: new Date(),
    };
    try {
        // 初始化项目文件，并自动添加第一个周期
        FileHandler.initProject(project.id);
        // 将项目信息写入 `projects/list.json`
        const list = FileHandler.readList();
        list.unshift(project);
        FileHandler.writeList(list);
        return res.status(201).send(project);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to create project.',
        });
    }
});

// 获取项目信息
router.get('/:userId/project/:projectId', async (req, res) => {
    const { userId, projectId } = req.params;
    if (!userId || !projectId) {
        return res.status(400).send({
            error: 'userId/projectId is required',
        });
    }
    try {
        const list = FileHandler.readList();
        const project = list.find((project) => project.id === projectId);
        if (!project) {
            return res.status(404).send({
                error: 'project not found',
            });
        }
        return res.send(project);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get project.',
        });
    }
});

// 修改项目基本信息
router.put('/:userId/project/:projectId', async (req, res) => {
    const { userId, projectId } = req.params;
    if (!userId || !projectId) {
        return res.status(400).send({
            error: 'userId/projectId is required',
        });
    }
    try {
        const list = FileHandler.readList();
        const project = list.find((project) => project.id === projectId);
        if (!project) {
            return res.status(404).send({
                error: 'project not found',
            });
        }
        project = {
            ...project,
            ...req.body,
        };
        FileHandler.writeList(list);
        return res.send(project);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to update project.',
        });
    }
});

// 获取项目的周期列表
router.get('/:userId/project/:projectId/cycle', async (req, res) => {
    const { userId, projectId } = req.params;
    if (!userId || !projectId) {
        return res.status(400).send({
            error: 'userId/projectId is required',
        });
    }
    try {
        const projectDir = FileHandler.getProjectPath(projectId);
        if (!projectDir)
            return res.status(404).send({
                error: 'project not found',
            });
        const cyclesPath = path.join(projectDir, CYCLE_LIST_NAME);
        const cycles = JSON.parse(fs.readFileSync(cyclesPath));
        return res.send(cycles);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get project cycles.',
        });
    }
});

// 新建项目的周期，细节如下：
// 周期的 idx 为上一个周期的 idx + 1
// 周期的开始时间为上一个周期的结束时间，结束时间可以由用户指定，如果用户没有指定，则默认为开始时间 + 7 天
router.post('/:userId/project/:projectId/cycle', async (req, res) => {
    const { userId, projectId } = req.params;
    // 前置校验
    if (!userId || !projectId) {
        return res.status(400).send({
            error: 'userId/projectId is required',
        });
    }
    try {
        const projectDir = FileHandler.getProjectPath(projectId);
        if (!projectDir) {
            return res.status(404).send({
                error: 'project not found',
            });
        }
        const cyclesPath = path.join(projectDir, CYCLE_LIST_NAME);
        const cycles = JSON.parse(fs.readFileSync(cyclesPath, 'utf8'));
        // 降序排列，最新的周期在最前面
        const lastCycle = cycles[0];
        const cycle = {
            id: uuid(),
            idx: lastCycle.idx + 1,
            start: lastCycle.end,
            end: req.body.end || lastCycle.end + DEFAULT_CYCLE_DURATION,
        };
        cycles.unshift(cycle);
        fs.writeFileSync(cyclesPath, JSON.stringify(cycles));
        const cycleTasksPath = path.join(projectDir, `${cycle.id}.json`);
        fs.writeFileSync(cycleTasksPath, JSON.stringify({ tasks: [] }));
        return res.send(cycle);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to create cycle.',
        });
    }
});

// 获取周期的任务信息
router.get('/:userId/project/:projectId/cycle/:cycleId', async (req, res) => {
    const { userId, projectId, cycleId } = req.params;
    // 前置校验
    if (!userId || !projectId || !cycleId) {
        return res.status(400).send({
            error: 'userId/projectId/cycleId is required',
        });
    }
    try {
        const projectDir = FileHandler.getProjectPath(projectId);
        if (!projectDir)
            return res.status(404).send({
                error: 'project not found',
            });
        const cycleTasksPath = path.join(projectDir, `${cycleId}.json`);
        const cycleTasks = JSON.parse(fs.readFileSync(cycleTasksPath));
        return res.send(cycleTasks);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get cycle tasks.',
        });
    }
});

module.exports = { weaverRouter: router };
