const express = require('express');
const { login } = require('../middlewares');
const { LuoyeCtr, Scope, Access } = require('../controllers/Luoye');
const router = express.Router();

// 获取工作区列表
router.get('/workspaces', login, async (req, res) => {
    try {
        const userDir = LuoyeCtr.userDir(req.userId);
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
        if (
            LuoyeCtr.workspaceAccess(workspace, req.userId) === Access.Forbidden
        )
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
        const { name, description = '', scope = Scope.Private } = req.body;
        if (!name) return res.status(400).send('name is required');
        const userDir = LuoyeCtr.userDir(req.userId);
        // 限制入参
        const safeProps = {
            name,
            description,
            scope,
        };
        const workspace = LuoyeCtr.createWorkspace(
            userDir,
            safeProps,
            req.userId,
        );
        return res.send(workspace);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to create workspace');
    }
});

// 更新工作区信息
router.put('/workspace/:workspaceId', login, async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, description, scope } = req.body;
        if (!workspaceId)
            return res.status(400).send({
                error: 'workspaceId is required',
            });
        const workspace = LuoyeCtr.workspace(workspaceId);
        if (!workspace)
            return res.status(404).send({
                error: 'workspace not found',
            });
        if (LuoyeCtr.workspaceAccess(workspace, req.userId) !== Access.Admin)
            return res.status(403).send({
                error: 'Forbidden',
            });
        const safeProps = {
            name,
            description,
            scope,
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
