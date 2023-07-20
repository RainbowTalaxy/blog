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
 *   + 项目 ID id
 *   + 项目名称 name
 *   + 所有者 owner
 *   + 创建时间 createdAt
 * - 周期 Cycle
 *   + 周期 ID id
 *   + 创建时间 createdAt
 *   + 索引 idx
 *   + 开始时间 start
 *   + 结束时间 end
 * - 周期信息
 *   + 任务列表 tasks
 * - 任务 Task
 *   + 任务 ID id
 *   + 创建时间 createdAt
 *   + 修改时间 updatedAt
 *   + 任务名称 name
 *   + 任务描述 description
 *   + 优先级 priority
 *   + 进度 progress
 *   + 任务状态 status
 *   + 执行人 executor
 *   + 完成时间 finishedAt
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
 * - 查看项目列表   GET  /:userId/projects
 * - 创建项目      POST /:userId/project
 * - 查看项目      GET  /:userId/project/:projectId
 * - 修改项目      PUT  /:userId/project/:projectId
 * - 删除项目      DELETE /:userId/project/:projectId
 * - 查看周期列表   GET  /:userId/project/:projectId/cycles
 * - 创建周期      POST /:userId/project/:projectId/cycle
 * - 获取周期信息   GET  /:userId/project/:projectId/cycle/:cycleId
 * - 创建任务      POST /:userId/project/:projectId/cycle/:cycleId/task
 * - 修改任务      PUT  /:userId/project/:projectId/cycle/:cycleId/task/:taskId
 * - 修改任务周期   PUT  /:userId/project/:projectId/cycle/:cycleId/task/:taskId/move
 * - 删除任务      DELETE /:userId/project/:projectId/cycle/:cycleId/task/:taskId
 *
 * 下面开始写 API 吧！
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { Dir } = require('../config');
const { uuid } = require('../utils');
const { mkdirp } = require('mkdirp');
const { login } = require('../middlewares');
const router = express.Router();

const LIST_PATH = path.join(Dir.storage.projects, 'list.json');
const CYCLE_LIST_NAME = 'cycles.json';
const TASK_POOL_NAME = 'pool';

const DEFAULT_CYCLE_DURATION = 7 * 24 * 60 * 60 * 1000;

const TaskStatus = {
    Todo: 0,
    Done: 1,
    Doing: 2,
    Testing: 3,
};

const FileHandler = {
    readList: () => {
        if (fs.existsSync(LIST_PATH)) {
            return JSON.parse(fs.readFileSync(LIST_PATH));
        } else {
            return [];
        }
    },
    writeList: (list) => {
        fs.writeFileSync(LIST_PATH, JSON.stringify(list));
    },
    removeProjectDir: (projectId) => {
        const projectDir = path.join(Dir.storage.projects, `${projectId}`);
        if (fs.existsSync(projectDir)) {
            fs.rmSync(projectDir, { recursive: true });
        }
    },
    addPool: (projectId) => {
        const poolPath = path.join(
            Dir.storage.projects,
            `${projectId}`,
            `${TASK_POOL_NAME}.json`,
        );
        if (!fs.existsSync(poolPath)) {
            fs.writeFileSync(poolPath, JSON.stringify({ tasks: [] }));
        }
    },
    initProject: (projectId, firstDate) => {
        const projectDir = path.join(Dir.storage.projects, `${projectId}`);
        mkdirp.sync(projectDir);
        const firstCycle = {
            id: uuid(),
            createdAt: firstDate,
            idx: 0,
            start: firstDate,
            end: firstDate + DEFAULT_CYCLE_DURATION,
        };
        const cyclesPath = path.join(projectDir, CYCLE_LIST_NAME);
        fs.writeFileSync(cyclesPath, JSON.stringify([firstCycle]));
        const firstCycleTasksPath = path.join(
            projectDir,
            `${firstCycle.id}.json`,
        );
        fs.writeFileSync(firstCycleTasksPath, JSON.stringify({ tasks: [] }));
        FileHandler.addPool(projectId);
    },
    getProjectPath: (projectId) => {
        const projectDir = path.join(Dir.storage.projects, `${projectId}`);
        return fs.existsSync(projectDir) ? projectDir : null;
    },
    getCyclePath: (projectId, cycleId) => {
        const projectDir = FileHandler.getProjectPath(projectId);
        if (!projectDir) return null;
        // 兼容性代码，如果是任务池，需要先创建
        if (cycleId === TASK_POOL_NAME) FileHandler.addPool(projectId);
        const cyclePath = path.join(projectDir, `${cycleId}.json`);
        return fs.existsSync(cyclePath) ? cyclePath : null;
    },
};

// 查看项目列表
router.get('/projects', login, async (req, res) => {
    const { userId } = req;
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
router.post('/project', login, async (req, res) => {
    const { userId } = req;
    const { name, firstDate } = req.body;
    if (!userId || !name) {
        return res.status(400).send({
            error: 'userId/name is required',
        });
    }
    const now = Date.now();
    const project = {
        ...req.body,
        id: uuid(),
        name,
        owner: userId,
        createdAt: now,
    };
    try {
        // 初始化项目文件，并自动添加第一个周期
        FileHandler.initProject(project.id, firstDate ?? now);
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
router.get('/project/:projectId', login, async (req, res) => {
    const { userId } = req;
    const { projectId } = req.params;
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
router.put('/project/:projectId', login, async (req, res) => {
    const { userId } = req;
    const { projectId } = req.params;
    if (!userId || !projectId) {
        return res.status(400).send({
            error: 'userId/projectId is required',
        });
    }
    try {
        const list = FileHandler.readList();
        const projectIdx = list.findIndex(
            (project) => project.id === projectId,
        );
        if (projectIdx === -1) {
            return res.status(404).send({
                error: 'project not found',
            });
        }
        const project = {
            ...list[projectIdx],
            ...req.body,
        };
        list[projectIdx] = project;
        FileHandler.writeList(list);
        return res.send(project);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to update project.',
        });
    }
});

// 删除项目
router.delete('/project/:projectId', login, async (req, res) => {
    const { userId } = req;
    const { projectId } = req.params;
    if (!userId || !projectId) {
        return res.status(400).send({
            error: 'userId/projectId is required',
        });
    }
    try {
        const list = FileHandler.readList();
        const projectIdx = list.findIndex(
            (project) => project.id === projectId,
        );
        if (projectIdx === -1) {
            return res.status(404).send({
                error: 'project not found',
            });
        }
        const project = list[projectIdx];
        FileHandler.removeProjectDir(projectId);
        list.splice(projectIdx, 1);
        FileHandler.writeList(list);
        return res.send(project);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to delete project.',
        });
    }
});

// 获取项目的周期列表
router.get('/project/:projectId/cycles', login, async (req, res) => {
    const { userId } = req;
    const { projectId } = req.params;
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
router.post('/project/:projectId/cycle', login, async (req, res) => {
    const { userId } = req;
    const { projectId } = req.params;
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
        const now = Date.now();
        let cycle = {
            id: uuid(),
            idx: lastCycle.idx + 1,
            createdAt: now,
        };
        if (lastCycle.end > now) {
            cycle.start = lastCycle.end;
            cycle.end = req.body.end || lastCycle.end + DEFAULT_CYCLE_DURATION;
        } else {
            const rounds = Math.floor(
                (now - lastCycle.start) / DEFAULT_CYCLE_DURATION,
            );
            cycle.start = lastCycle.start + rounds * DEFAULT_CYCLE_DURATION;
            cycle.end = req.body.end || cycle.start + DEFAULT_CYCLE_DURATION;
        }
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

// 获取周期信息
router.get('/project/:projectId/cycle/:cycleId', login, async (req, res) => {
    const { userId } = req;
    const { projectId, cycleId } = req.params;
    // 前置校验
    if (!userId || !projectId || !cycleId) {
        return res.status(400).send({
            error: 'userId/projectId/cycleId is required',
        });
    }
    try {
        const cyclePath = FileHandler.getCyclePath(projectId, cycleId);
        if (!cyclePath)
            return res.status(404).send({
                error: 'project/cycle not found',
            });
        const cycle = JSON.parse(fs.readFileSync(cyclePath, 'utf8'));
        return res.send(cycle);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get cycle tasks.',
        });
    }
});

const DEFAULT_PROGRESS = {
    [TaskStatus.Todo]: 0,
    [TaskStatus.Doing]: 0,
    [TaskStatus.Testing]: 100,
    [TaskStatus.Done]: 100,
};

// 新建任务
router.post(
    '/project/:projectId/cycle/:cycleId/task',
    login,
    async (req, res) => {
        const { userId } = req;
        const { projectId, cycleId } = req.params;
        // 前置校验
        if (!userId || !projectId || !cycleId) {
            return res.status(400).send({
                error: 'userId/projectId/cycleId is required',
            });
        }
        try {
            const cyclePath = FileHandler.getCyclePath(projectId, cycleId);
            if (!cyclePath)
                return res.status(404).send({
                    error: 'project/cycle not found',
                });
            const cycle = JSON.parse(fs.readFileSync(cyclePath));
            const now = Date.now();
            const task = {
                id: uuid(),
                createdAt: now,
                updatedAt: now,
                name: '',
                description: '',
                priority: 0,
                status: TaskStatus.Todo,
                executor: userId,
                progress: DEFAULT_PROGRESS[TaskStatus.Todo],
                ...req.body,
            };
            if (task.status !== TaskStatus.Doing) {
                task.progress = DEFAULT_PROGRESS[task.status];
            }
            cycle.tasks.push(task);
            fs.writeFileSync(cyclePath, JSON.stringify(cycle));
            return res.send(task);
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                error: 'Failed to create task.',
            });
        }
    },
);

// 修改任务
router.put(
    '/project/:projectId/cycle/:cycleId/task/:taskId',
    login,
    async (req, res) => {
        const { userId } = req;
        const { projectId, cycleId, taskId } = req.params;
        // 前置校验
        if (!userId || !projectId || !cycleId || !taskId) {
            return res.status(400).send({
                error: 'userId/projectId/cycleId/taskId is required',
            });
        }
        try {
            const cyclePath = FileHandler.getCyclePath(projectId, cycleId);
            if (!cyclePath)
                return res.status(404).send({
                    error: 'project/cycle not found',
                });
            const cycle = JSON.parse(fs.readFileSync(cyclePath));
            const taskIndex = cycle.tasks.findIndex(
                (task) => task.id === taskId,
            );
            if (taskIndex === -1)
                return res.status(404).send({
                    error: 'task not found',
                });
            const now = Date.now();
            cycle.tasks[taskIndex] = {
                // 如果原先没有 progress 字段，设置为默认值
                progress:
                    DEFAULT_PROGRESS[
                        req.body.status ?? cycle.tasks[taskIndex].status
                    ],
                ...cycle.tasks[taskIndex],
                ...req.body,
                updatedAt: now,
            };
            const targetTask = cycle.tasks[taskIndex];
            // 如果不是进行中的任务，进度重置为默认值
            if (targetTask.status !== TaskStatus.Doing) {
                targetTask.progress = DEFAULT_PROGRESS[targetTask.status];
            }
            if (targetTask.status === TaskStatus.Done) {
                targetTask.finishedAt = now;
            }
            fs.writeFileSync(cyclePath, JSON.stringify(cycle));
            return res.send(targetTask);
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                error: 'Failed to update task.',
            });
        }
    },
);

// 移动任务所在周期，body 中的 cycleId 为目标周期的 id
router.put(
    '/project/:projectId/cycle/:cycleId/task/:taskId/move',
    login,
    async (req, res) => {
        const { userId } = req;
        const { projectId, cycleId, taskId } = req.params;
        // 前置校验
        if (!userId || !projectId || !cycleId || !taskId) {
            return res.status(400).send({
                error: 'userId/projectId/cycleId/taskId is required',
            });
        }
        try {
            const cyclePath = FileHandler.getCyclePath(projectId, cycleId);
            const targetCyclePath = FileHandler.getCyclePath(
                projectId,
                req.body.cycleId,
            );
            if (!cyclePath || !targetCyclePath)
                return res.status(404).send({
                    error: 'project/cycle not found',
                });
            const cycle = JSON.parse(fs.readFileSync(cyclePath));
            const targetCycle = JSON.parse(fs.readFileSync(targetCyclePath));
            const taskIndex = cycle.tasks.findIndex(
                (task) => task.id === taskId,
            );
            if (taskIndex === -1)
                return res.status(404).send({
                    error: 'task not found',
                });
            const task = cycle.tasks.splice(taskIndex, 1)[0];
            task.updatedAt = Date.now();
            targetCycle.tasks.push(task);
            fs.writeFileSync(cyclePath, JSON.stringify(cycle));
            fs.writeFileSync(targetCyclePath, JSON.stringify(targetCycle));
            return res.send(task);
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                error: 'Failed to move task.',
            });
        }
    },
);

// 删除任务
router.delete(
    '/project/:projectId/cycle/:cycleId/task/:taskId',
    login,
    async (req, res) => {
        const { userId } = req;
        const { projectId, cycleId, taskId } = req.params;
        // 前置校验
        if (!userId || !projectId || !cycleId || !taskId) {
            return res.status(400).send({
                error: 'userId/projectId/cycleId/taskId is required',
            });
        }
        try {
            const cyclePath = FileHandler.getCyclePath(projectId, cycleId);
            if (!cyclePath)
                return res.status(404).send({
                    error: 'project/cycle not found',
                });
            const cycle = JSON.parse(fs.readFileSync(cyclePath));
            const taskIndex = cycle.tasks.findIndex(
                (task) => task.id === taskId,
            );
            if (taskIndex === -1)
                return res.status(404).send({
                    error: 'task not found',
                });
            const task = cycle.tasks.splice(taskIndex, 1);
            fs.writeFileSync(cyclePath, JSON.stringify(cycle));
            return res.send(task ?? {});
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                error: 'Failed to delete task.',
            });
        }
    },
);

module.exports = { weaverRouter: router };
