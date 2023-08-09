const express = require('express');
const { login, weakLogin } = require('../middlewares');
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
router.get('/workspace/:workspaceId', weakLogin, async (req, res) => {
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
        const accessScope = LuoyeUtl.access(workspace, userId);
        if (accessScope === Access.Forbidden)
            return res.status(403).send({
                error: 'Forbidden',
            });
        if (accessScope === Access.Visitor) {
            LuoyeUtl.filterPrivate(workspace);
        }
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
        const { name, description, scope } = req.body;
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
        const safeProps = {
            name: name,
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

// 获取用户文档列表
router.get('/docs', login, async (req, res) => {
    try {
        const userId = req.userId;
        const userDir = LuoyeCtr.userDir(userId);
        const docs = LuoyeCtr.docs(userDir);
        return res.send(docs);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get docs',
        });
    }
});

// 获取文档信息
router.get('/doc/:docId', weakLogin, async (req, res) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: 'docId is required',
            });
        const doc = LuoyeCtr.doc(docId);
        if (!doc)
            return res.status(404).send({
                error: 'doc not found',
            });
        if (LuoyeUtl.access(doc, userId) === Access.Forbidden)
            return res.status(403).send({
                error: 'Forbidden',
            });
        return res.send(doc);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get doc',
        });
    }
});

// 创建文档
router.post('/doc', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId, name, scope } = req.body;
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
        if (LuoyeUtl.access(workspace, userId) < Access.Member)
            return res.status(403).send({
                error: 'Forbidden',
            });
        const userDir = LuoyeCtr.userDir(userId);
        const doc = LuoyeCtr.createDoc(
            userDir,
            workspace,
            { name, scope },
            userId,
        );
        return res.send(doc);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to create doc',
        });
    }
});

// 更新文档信息
router.put('/doc/:docId', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        const { name, content, scope } = req.body;
        if (!docId)
            return res.status(400).send({
                error: 'docId is required',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: 'scope is invalid',
            });
        const doc = LuoyeCtr.doc(docId);
        if (!doc)
            return res.status(404).send({
                error: 'doc not found',
            });
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Member)
            return res.status(403).send({
                error: 'Forbidden',
            });
        const safeProps = {
            name,
            content,
            scope,
        };
        const updatedDoc = LuoyeCtr.updateDoc(docId, safeProps);
        return res.send(updatedDoc);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to update doc',
        });
    }
});

// 删除文档
router.delete('/doc/:docId', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: 'docId is required',
            });
        const doc = LuoyeCtr.doc(docId);
        if (!doc)
            return res.status(404).send({
                error: 'doc not found',
            });
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Member)
            return res.status(403).send({
                error: 'Forbidden',
            });
        LuoyeCtr.deleteDoc(docId);
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to delete doc',
        });
    }
});

module.exports = { luoyeRouter: router };
