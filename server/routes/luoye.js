const express = require('express');
const { login } = require('../middlewares');
const { LuoyeCtr, Scope, Access, LuoyeUtl } = require('../controllers/Luoye');
const router = express.Router();

// 获取工作区列表
router.get('/workspaces', login, async (req, res) => {
    try {
        const userId = req.userId;
        const userDir = LuoyeCtr.userDir(userId);
        const workspaces = LuoyeCtr.workspaces(userDir);
        return res.send(workspaces);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get workspaces',
        });
    }
});

// 获取工作区信息
router.get('/workspace/:workspaceId', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;
        if (!workspaceId)
            return res.status(400).send({
                error: 'workspaceId is required',
            });
        const workspace = LuoyeCtr.workspace(workspaceId);
        if (!workspace)
            return res.status(404).send({
                error: 'workspace not found',
            });
        if (LuoyeUtl.access(workspace, userId) === Access.Forbidden)
            return res.status(403).send({
                error: 'Forbidden',
            });
        return res.send(workspace);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get workspace',
        });
    }
});

// 创建工作区
router.post('/workspace', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, description = '', scope = Scope.Private } = req.body;
        if (!name)
            return res.status(400).send({
                error: 'name is required',
            });
        // `scope` 参数校验
        if (!LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: 'scope is invalid',
            });
        const userDir = LuoyeCtr.userDir(userId);
        // 限制入参
        const safeProps = {
            name,
            description,
            scope,
        };
        const workspace = LuoyeCtr.createWorkspace(userDir, safeProps, userId);
        return res.send(workspace);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to create workspace',
        });
    }
});

// 更新工作区信息
router.put('/workspace/:workspaceId', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;
        const { name, description, scope, docs } = req.body;
        if (!workspaceId)
            return res.status(400).send({
                error: 'workspaceId is required',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: 'scope is invalid',
            });
        const workspace = LuoyeCtr.workspace(workspaceId);
        if (!workspace)
            return res.status(404).send({
                error: 'workspace not found',
            });
        // 权限校验
        if (LuoyeUtl.access(workspace, userId) !== Access.Admin)
            return res.status(403).send({
                error: 'Forbidden',
            });
        // `docs` 参数校验
        const safeDocItems = LuoyeUtl.safeDocItems(docs);
        if (docs && !safeDocItems)
            return res.status(400).send({
                error: 'docs is invalid',
            });
        const safeProps = {
            name: name,
            description,
            scope,
            docs: safeDocItems,
        };
        const updatedWorkspace = LuoyeCtr.updateWorkspace(
            workspaceId,
            safeProps,
        );
        return res.send(updatedWorkspace);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to update workspace',
        });
    }
});

module.exports = { luoyeRouter: router };
