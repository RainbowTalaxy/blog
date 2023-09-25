const express = require('express');
const { login, weakLogin } = require('../../middlewares');
const { Scope, Access, ErrorMessage } = require('./constants');
const { PropCheck } = require('../../utils');
const { LuoyeCtr, LuoyeUtl } = require('./controller');
const Ctr = require('./controllerV2');
const router = express.Router();

// 获取工作区列表 V2
router.get('/workspaces', login, async (req, res) => {
    try {
        const workspaceItems = Ctr.user(req.userId).workspaceItems.content;
        return res.send(workspaceItems);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get workspaces',
            message: '获取工作区列表失败',
        });
    }
});

// 更新工作区列表顺序 V2
router.put('/workspaces', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceIds } = req.body;
        if (!workspaceIds)
            return res.status(400).send({
                error: '`workspaceIds` is required',
            });
        const user = Ctr.user(userId);
        const workspaceItems = user.workspaceItems.content;
        const newWorkspaceItems = LuoyeUtl.workspaceItems(
            workspaceItems,
            workspaceIds,
        );
        if (!newWorkspaceItems)
            return res.status(400).send({
                error: '`workspaceIds` is invalid',
            });
        user.workspaceItems.content = newWorkspaceItems;
        return res.send(newWorkspaceItems);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to update workspaces',
            message: '更新工作区列表失败',
        });
    }
});

// 获取工作区信息 V2
router.get('/workspace/:workspaceId', weakLogin, async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;
        if (!workspaceId)
            return res.status(400).send({
                error: '`workspaceId` is required',
            });
        const workspaceCtr = Ctr.workspace.ctr(workspaceId);
        if (!workspaceCtr)
            return res.status(404).send({
                error: 'workspace not found',
                message: '未找到工作区',
            });
        const workspace = workspaceCtr.content;
        const accessScope = LuoyeUtl.access(workspace, userId);
        if (accessScope === Access.Forbidden)
            return res.status(403).send(ErrorMessage.Forbidden);
        if (accessScope === Access.Visitor) {
            LuoyeUtl.filterPrivate(workspace);
        }
        return res.send(workspace);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get workspace',
            message: '获取工作区失败',
        });
    }
});

// 创建工作区 V2
router.post('/workspace', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, description = '', scope = Scope.Private } = req.body;
        if (!name)
            return res.status(400).send({
                error: '`name` is required',
                message: '工作区名称不能为空',
            });
        // `scope` 参数校验
        if (!LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: '`scope` is invalid',
            });
        const workspace = Ctr.workspace.add(
            {
                name,
                description,
                scope,
            },
            userId,
        );
        return res.send(workspace);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to create workspace',
            message: '创建工作区失败',
        });
    }
});

// 更新工作区信息 V2
router.put('/workspace/:workspaceId', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;
        const { name, description, scope, docs } = req.body;
        if (!workspaceId)
            return res.status(400).send({
                error: '`workspaceId` is required',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: '`scope` is invalid',
            });
        const workspaceCtr = Ctr.workspace.ctr(workspaceId);
        if (!workspaceCtr)
            return res.status(404).send({
                error: 'workspace not found',
                message: '未找到工作区',
            });
        const workspace = workspaceCtr.content;
        if (docs && !LuoyeUtl.docDirCheck(docs, workspace))
            return res.status(400).send({
                error: '`docs` is invalid',
            });
        // 权限校验
        if (LuoyeUtl.access(workspace, userId) !== Access.Admin)
            return res.status(403).send(ErrorMessage.Forbidden);
        const updatedWorkspace = workspaceCtr.update({
            name,
            description,
            scope,
            docs: docs?.map((docDir) => ({
                docId: docDir.docId,
                name: docDir.name,
                scope: docDir.scope,
                updatedAt: docDir.updatedAt,
            })),
        });
        return res.send(updatedWorkspace);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to update workspace',
            message: '更新工作区失败',
        });
    }
});

// 删除工作区
router.delete('/workspace/:workspaceId', login, async (req, res) => {
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
                message: '未找到工作区',
            });
        // 权限校验
        if (LuoyeUtl.access(workspace, userId) !== Access.Admin)
            return res.status(403).send(ErrorMessage.Forbidden);
        LuoyeCtr.deleteWorkspace(workspaceId, userId);
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to delete workspace',
            message: '删除工作区失败',
        });
    }
});

// 获取用户最近文档列表
router.get('/recent-docs', login, async (req, res) => {
    try {
        const userId = req.userId;
        const userDir = LuoyeCtr.userDir(userId);
        const docs = LuoyeCtr.recentDocs(userDir);
        return res.send(docs.slice(0, 10));
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get recent docs',
            message: '获取最近文档失败',
        });
    }
});

// 删除用户最近文档
router.delete('/recent-docs/:docId', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: 'docId is required',
            });
        const userDir = LuoyeCtr.userDir(userId);
        const recentDocs = LuoyeCtr.recentDocs(userDir);
        const recentDoc = recentDocs.find((item) => item.id === docId);
        if (!recentDoc)
            return res.status(404).send({
                error: 'doc not found',
                message: '未找到文档',
            });
        LuoyeCtr.deleteRecentDoc(userDir, docId);
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to delete recent doc',
            message: '删除记录失败',
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
            message: '获取文档列表失败',
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
                message: '未找到文档',
            });
        if (LuoyeUtl.access(doc, userId) === Access.Forbidden)
            return res.status(403).send(ErrorMessage.Forbidden);
        return res.send(doc);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get doc',
            message: '获取文档失败',
        });
    }
});

// 创建文档
router.post('/doc', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId, name, scope, date } = req.body;
        if (!workspaceId)
            return res.status(400).send({
                error: 'workspaceId is required',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: 'scope is invalid',
            });
        // `date` 参数校验
        if (date && !PropCheck.date(date))
            return res.status(400).send({
                error: 'date is invalid',
            });
        const workspace = LuoyeCtr.workspace(workspaceId);
        if (!workspace)
            return res.status(404).send({
                error: 'workspace not found',
                message: '未找到工作区',
            });
        if (LuoyeUtl.access(workspace, userId) < Access.Member)
            return res.status(403).send(ErrorMessage.Forbidden);
        const userDir = LuoyeCtr.userDir(userId);
        const doc = LuoyeCtr.createDoc(
            userDir,
            workspace,
            { name, scope, date },
            userId,
        );
        return res.send(doc);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to create doc',
            message: '创建文档失败',
        });
    }
});

// 更新文档信息
router.put('/doc/:docId', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        const { name, content, scope, date } = req.body;
        if (!docId)
            return res.status(400).send({
                error: 'docId is required',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: 'scope is invalid',
            });
        // `date` 参数校验
        if (date && !PropCheck.date(date))
            return res.status(400).send({
                error: 'date is invalid',
            });
        const doc = LuoyeCtr.doc(docId);
        if (!doc)
            return res.status(404).send({
                error: 'doc not found',
                message: '未找到文档',
            });
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Member)
            return res.status(403).send(ErrorMessage.Forbidden);
        const safeProps = {
            name,
            content,
            scope,
            date,
        };
        const updatedDoc = LuoyeCtr.updateDoc(doc, safeProps);
        return res.send(updatedDoc);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to update doc',
            message: '更新文档失败',
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
                message: '未找到文档',
            });
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Admin)
            return res.status(403).send(ErrorMessage.Forbidden);
        LuoyeCtr.deleteDoc(doc.id, userId);
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to delete doc',
            message: '删除文档失败',
        });
    }
});

// 获取文档回收站
router.get('/doc-bin', login, async (req, res) => {
    try {
        const userId = req.userId;
        const userDir = LuoyeCtr.userDir(userId);
        const docBin = LuoyeCtr.docBin(userDir);
        return res.send(docBin);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to get doc bin',
            message: '获取文档回收站失败',
        });
    }
});

// 从文档回收站恢复文档
router.put('/doc-bin/:docId/restore', login, async (req, res) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: 'docId is required',
            });
        const userDir = LuoyeCtr.userDir(userId);
        // 检查文档是否在回收站
        const docBin = LuoyeCtr.docBin(userDir);
        if (!docBin.find((item) => item.docId === docId)) {
            return res.status(404).send({
                error: 'doc not found in doc bin',
                message: '未在回收站中找到文档',
            });
        }
        const doc = LuoyeCtr.doc(docId);
        if (!doc)
            return res.status(404).send({
                error: 'doc not found',
                message: '未找到文档',
            });
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Admin)
            return res.status(403).send(ErrorMessage.Forbidden);
        LuoyeCtr.restoreDoc(doc);
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: 'Failed to restore doc',
            message: '恢复文档失败',
        });
    }
});

module.exports = { luoyeRouter: router };
