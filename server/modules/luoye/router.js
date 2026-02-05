const express = require('express');
const { login, weakLogin } = require('../../middlewares');
const { Scope, Access, ErrorMessage } = require('./constants');
const { PropCheck } = require('../../utils');
const { LuoyeUtl } = require('./utility');
const Ctr = require('./controller');
const router = express.Router();

// 获取工作区列表 V2
router.get('/workspaces', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const workspaceItems = Ctr.user(userId).workspaceItems.content;
        return res.send(workspaceItems);
    } catch (error) {
        res.error = 'Failed to get workspaces';
        res.message = '获取工作区列表失败';
        next(error);
    }
});

// 更新工作区列表顺序 V2
router.put('/workspaces', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { workspaceIds } = req.body;
        if (!workspaceIds)
            return res.status(400).send({
                error: '`workspaceIds` is required',
                message: '工作区 ID 列表不能为空',
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
                message: '非法的工作区 ID 列表',
            });
        user.workspaceItems.content = newWorkspaceItems;
        return res.send(newWorkspaceItems);
    } catch (error) {
        res.error = 'Failed to update workspaces';
        res.message = '更新工作区列表失败';
        next(error);
    }
});

// 获取工作区信息 V2
router.get('/workspace/:workspaceId', weakLogin, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;
        if (!workspaceId)
            return res.status(400).send({
                error: '`workspaceId` is required',
                message: '工作区 ID 不能为空',
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
        res.error = 'Failed to get workspace';
        res.message = '获取工作区失败';
        next(error);
    }
});

// 创建工作区 V2
router.post('/workspace', login, async (req, res, next) => {
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
                message: '非法的权限参数',
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
        res.error = 'Failed to create workspace';
        res.message = '创建工作区失败';
        next(error);
    }
});

// 更新工作区信息 V2
router.put('/workspace/:workspaceId', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;
        const { name, description, scope, docs } = req.body;
        if (!workspaceId)
            return res.status(400).send({
                error: '`workspaceId` is required',
                message: '工作区 ID 不能为空',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: '`scope` is invalid',
                message: '非法的权限参数',
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
        res.error = 'Failed to update workspace';
        res.message = '更新工作区失败';
        next(error);
    }
});

// 删除工作区
router.delete('/workspace/:workspaceId', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;
        if (!workspaceId)
            return res.status(400).send({
                error: '`workspaceId` is required',
                message: '工作区 ID 不能为空',
            });
        const workspaceCtr = Ctr.workspace.ctr(workspaceId);
        if (!workspaceCtr)
            return res.status(404).send({
                error: 'workspace not found',
                message: '未找到工作区',
            });
        const workspace = workspaceCtr.content;
        // 权限校验
        if (LuoyeUtl.access(workspace, userId) !== Access.Admin)
            return res.status(403).send(ErrorMessage.Forbidden);
        workspaceCtr.delete();
        return res.send({
            success: true,
        });
    } catch (error) {
        res.error = 'Failed to delete workspace';
        res.message = '删除工作区失败';
        next(error);
    }
});

// 获取用户标签列表
router.get('/tags', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const tags = Ctr.user(userId).tags.content;
        return res.send(tags);
    } catch (error) {
        res.error = 'Failed to get tags';
        res.message = '获取标签列表失败';
        next(error);
    }
});

// 获取用户最近文档列表 V2
router.get('/recent-docs', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const recentDocs = Ctr.user(userId).recentDocs.content;
        return res.send(recentDocs.slice(0, 10));
    } catch (error) {
        res.error = 'Failed to get recent docs';
        res.message = '获取最近文档失败';
        next(error);
    }
});

// 删除用户最近文档 V2
router.delete('/recent-docs/:docId', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: '`docId` is required',
                message: '文档 ID 不能为空',
            });
        Ctr.user(userId).recentDocs.remove(docId);
        return res.send({
            success: true,
        });
    } catch (error) {
        res.error = 'Failed to delete recent doc';
        res.message = '删除记录失败';
        next(error);
    }
});

// 获取用户文档列表 V2
router.get('/docs', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const docsItems = Ctr.user(userId).docItems.content;
        return res.send(docsItems);
    } catch (error) {
        res.error = 'Failed to get docs';
        res.message = '获取文档列表失败';
        next(error);
    }
});

// 获取文档信息 V2
router.get('/doc/:docId', weakLogin, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: '`docId` is required',
                message: '文档 ID 不能为空',
            });
        const docCtr = Ctr.doc.ctr(docId);
        if (!docCtr)
            return res.status(404).send({
                error: 'doc not found',
                message: '未找到文档',
            });
        const doc = docCtr.content;
        if (LuoyeUtl.access(doc, userId) === Access.Forbidden)
            return res.status(403).send(ErrorMessage.Forbidden);
        return res.send(doc);
    } catch (error) {
        res.error = 'Failed to get doc';
        res.message = '获取文档失败';
        next(error);
    }
});

// 创建文档 V2
router.post('/doc', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { workspaceId, name, scope, date, docType, tags } = req.body;
        if (!workspaceId)
            return res.status(400).send({
                error: '`workspaceId` is required',
                message: '工作区 ID 不能为空',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: '`scope` is invalid',
                message: '非法的权限参数',
            });
        // `docType` 参数校验
        if (docType && !LuoyeUtl.docTypeCheck(docType))
            return res.status(400).send({
                error: '`docType` is invalid',
                message: '非法的文档类型参数',
            });
        // `date` 参数校验
        if (date && !PropCheck.date(date))
            return res.status(400).send({
                error: '`date` is invalid',
                message: '非法的日期参数',
            });
        // `tags` 参数校验
        if (tags && !LuoyeUtl.tagsCheck(tags))
            return res.status(400).send({
                error: '`tags` is invalid',
                message: '非法的标签参数',
            });
        const workspaceCtr = Ctr.workspace.ctr(workspaceId);
        if (!workspaceCtr)
            return res.status(404).send({
                error: 'workspace not found',
                message: '未找到工作区',
            });
        const workspace = workspaceCtr.content;
        if (LuoyeUtl.access(workspace, userId) < Access.Member)
            return res.status(403).send(ErrorMessage.Forbidden);
        const doc = Ctr.doc.add(
            { name, scope, date, docType, tags },
            workspaceCtr,
            userId,
        );
        // 更新用户标签列表
        if (tags && tags.length > 0) {
            Ctr.user(userId).tags.addTags(tags);
        }
        return res.send(doc);
    } catch (error) {
        res.error = 'Failed to create doc';
        res.message = '创建文档失败';
        next(error);
    }
});

// 更新文档信息 V2
router.put('/doc/:docId', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        const { name, content, scope, date, workspaces, tags } = req.body;
        if (!docId)
            return res.status(400).send({
                error: '`docId` is required',
                message: '文档 ID 不能为空',
            });
        // `scope` 参数校验
        if (scope && !LuoyeUtl.scopeCheck(scope))
            return res.status(400).send({
                error: '`scope` is invalid',
                message: '非法的权限参数',
            });
        // `date` 参数校验
        if (date && !PropCheck.date(date))
            return res.status(400).send({
                error: '`date` is invalid',
                message: '非法的日期参数',
            });
        // `tags` 参数校验
        if (tags && !LuoyeUtl.tagsCheck(tags))
            return res.status(400).send({
                error: '`tags` is invalid',
                message: '非法的标签参数',
            });
        // `workspaces` 参数校验
        if (workspaces) {
            if (!Array.isArray(workspaces) || workspaces.length === 0)
                return res.status(400).send({
                    error: '`workspaces` is invalid',
                    message: '工作区列表格式错误或为空',
                });
            // 检查所有工作区是否存在且用户有权限
            for (const workspaceId of workspaces) {
                const workspaceCtr = Ctr.workspace.ctr(workspaceId);
                if (!workspaceCtr)
                    return res.status(404).send({
                        error: 'workspace not found',
                        message: `未找到工作区: ${workspaceId}`,
                    });
                const workspace = workspaceCtr.content;
                if (LuoyeUtl.access(workspace, userId) < Access.Member)
                    return res.status(403).send({
                        error: 'workspace forbidden',
                        message: `无权访问工作区: ${workspaceId}`,
                    });
            }
        }
        const docCtr = Ctr.doc.ctr(docId);
        if (!docCtr)
            return res.status(404).send({
                error: 'doc not found',
                message: '未找到文档',
            });
        const doc = docCtr.content;
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Member)
            return res.status(403).send(ErrorMessage.Forbidden);
        const updatedDoc = docCtr.update({
            name,
            content,
            scope,
            date,
            workspaces,
            tags,
        });
        // 更新用户标签列表
        if (tags && tags.length > 0) {
            Ctr.user(userId).tags.addTags(tags);
        }
        return res.send(updatedDoc);
    } catch (error) {
        res.error = 'Failed to update doc';
        res.message = '更新文档失败';
        next(error);
    }
});

// 删除文档 V2
router.delete('/doc/:docId', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: '`docId` is required',
                message: '文档 ID 不能为空',
            });
        const docCtr = Ctr.doc.ctr(docId);
        if (!docCtr)
            return res.status(404).send({
                error: 'doc not found',
                message: '未找到文档',
            });
        const doc = docCtr.content;
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Admin)
            return res.status(403).send(ErrorMessage.Forbidden);
        docCtr.remove(userId);
        return res.send({
            success: true,
        });
    } catch (error) {
        res.error = 'Failed to delete doc';
        res.message = '删除文档失败';
        next(error);
    }
});

// 获取文档回收站 V2
router.get('/doc-bin', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const docBinItems = Ctr.user(userId).docBinItems.content;
        return res.send(docBinItems);
    } catch (error) {
        res.error = 'Failed to get doc bin';
        res.message = '获取文档回收站失败';
        next(error);
    }
});

// 从文档回收站恢复文档 V2
router.put('/doc/:docId/restore', login, async (req, res, next) => {
    try {
        const userId = req.userId;
        const { docId } = req.params;
        if (!docId)
            return res.status(400).send({
                error: '`docId` is required',
                message: '文档 ID 不能为空',
            });
        const docCtr = Ctr.doc.ctr(docId);
        if (!docCtr)
            return res.status(404).send({
                error: 'doc not found',
                message: '未找到文档',
            });
        const doc = docCtr.content;
        if (doc.deletedAt === null) {
            return res.status(400).send({
                error: 'doc not removed',
                message: '文档未被移除',
            });
        }
        // 权限校验
        if (LuoyeUtl.access(doc, userId) < Access.Admin)
            return res.status(403).send(ErrorMessage.Forbidden);
        docCtr.restore();
        return res.send({
            success: true,
        });
    } catch (error) {
        res.error = 'Failed to restore doc';
        res.message = '恢复文档失败';
        next(error);
    }
});

module.exports = { luoyeRouter: router };
