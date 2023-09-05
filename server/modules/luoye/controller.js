const { mkdirp } = require('mkdirp');
const { Dir } = require('../../config');
const fs = require('fs');
const { writeJSON, uuid, readJSON } = require('../../utils');
const path = require('path');
const _ = require('lodash');
const { Scope, DocType, Access } = require('./constants');

const USER_WORKSPACES_FILE = 'workspaces.json'; // 用户工作区列表
const USER_DOCS_FILE = 'docs.json'; // 用户文档列表
const USER_RECENT_DOCS_FILE = 'recent-docs.json'; // 用户最近编辑的文档
const USER_DOC_BIN_FILE = 'doc-bin.json'; // 用户文档回收站
const DEFAULT_WORKSPACE_NAME = 'default'; // 默认工作区名称

const File = Dir.storage.luoye;

const FileController = {
    /** 获取用户目录 */
    userDir(userId) {
        if (!userId) throw new Error('userId is required');
        const userDir = path.join(File.users, userId);
        if (!fs.existsSync(userDir)) {
            mkdirp.sync(userDir);
            const userWorkspacesFile = path.join(userDir, USER_WORKSPACES_FILE);
            const userDocFile = path.join(userDir, USER_DOCS_FILE);
            const userRecentDocsFile = path.join(
                userDir,
                USER_RECENT_DOCS_FILE,
            );
            const userDocBinFile = path.join(userDir, USER_DOC_BIN_FILE);
            const now = Date.now();
            // 初始化用户的默认工作区
            const defaultWorkspace = {
                id: userId,
                name: DEFAULT_WORKSPACE_NAME,
                description: DEFAULT_WORKSPACE_NAME,
                createdAt: now,
                updatedAt: now,
                creator: userId,
                admins: [userId],
                members: [userId],
                scope: Scope.Private,
                docs: [],
            };
            const defaultWorkspaceFile = path.join(
                File.workspaces,
                `${defaultWorkspace.id}.json`,
            );
            writeJSON(defaultWorkspaceFile, defaultWorkspace);
            writeJSON(userWorkspacesFile, [
                {
                    id: defaultWorkspace.id,
                    name: defaultWorkspace.name,
                    description: defaultWorkspace.description,
                    scope: defaultWorkspace.scope,
                    joinAt: now,
                },
            ]);
            writeJSON(userDocFile, []);
            writeJSON(userRecentDocsFile, []);
            writeJSON(userDocBinFile, []);
        }
        return userDir;
    },
    /** 获取用户工作区列表 */
    userWorkspaceItems(userDir) {
        const userWorkspacesPath = path.join(userDir, USER_WORKSPACES_FILE);
        return readJSON(userWorkspacesPath);
    },
    updateUserWorkspaceItems(userDir, workspaces) {
        if (!userDir) throw new Error('userDir is required');
        const userWorkspacesPath = path.join(userDir, USER_WORKSPACES_FILE);
        writeJSON(userWorkspacesPath, workspaces);
    },
    /** 获取工作区信息 */
    workspace(workspaceId) {
        if (!workspaceId) throw new Error('workspaceId is required');
        const workspaceDir = path.join(File.workspaces, `${workspaceId}.json`);
        return readJSON(workspaceDir);
    },
    /** 创建工作区 */
    createWorkspace(userDir, props, creator) {
        if (!userDir || !creator)
            throw new Error('userDir/creator is required');
        const userWorkspacesPath = path.join(userDir, USER_WORKSPACES_FILE);
        const userWorkspaces = readJSON(userWorkspacesPath);
        const now = Date.now();
        const newWorkspace = {
            id: uuid(),
            name: props.name || '',
            description: props.description || '',
            scope: props.scope || Scope.Private,
            creator: creator,
            admins: [creator],
            members: [creator],
            docs: [],
            createdAt: now,
            updatedAt: now,
        };
        const workspaceFile = path.join(
            File.workspaces,
            `${newWorkspace.id}.json`,
        );
        writeJSON(workspaceFile, newWorkspace);
        userWorkspaces.unshift({
            id: newWorkspace.id,
            name: newWorkspace.name,
            description: newWorkspace.description,
            scope: newWorkspace.scope,
            joinAt: now,
        });
        writeJSON(userWorkspacesPath, userWorkspaces);
        return newWorkspace;
    },
    /** 更新工作区 */
    updateWorkspace(workspaceId, props) {
        if (!workspaceId) throw new Error('workspaceId is required');
        const workspaceFile = path.join(File.workspaces, `${workspaceId}.json`);
        const workspace = readJSON(workspaceFile);
        const now = Date.now();
        const updatedWorkspace = {
            ...workspace,
            name: props.name || workspace.name,
            description: props.description ?? workspace.description,
            scope: props.scope ?? workspace.scope,
            docs: props.docs ?? workspace.docs,
            updatedAt: now,
        };
        writeJSON(workspaceFile, updatedWorkspace);
        // 条件更新用户工作区列表
        let flag = props.name || props.description || props.scope;
        if (flag) {
            // 更新用户的工作区信息
            updatedWorkspace.members.forEach((member) => {
                const memberDir = FileController.userDir(member);
                const userWorkspacesPath = path.join(
                    memberDir,
                    USER_WORKSPACES_FILE,
                );
                const userWorkspaces = readJSON(userWorkspacesPath);
                const userWorkspace = userWorkspaces.find(
                    (w) => w.id === workspaceId,
                );
                if (userWorkspace) {
                    userWorkspace.name = updatedWorkspace.name;
                    userWorkspace.description = updatedWorkspace.description;
                    userWorkspace.scope = updatedWorkspace.scope;
                } else {
                    userWorkspaces.unshift({
                        id: updatedWorkspace.id,
                        name: updatedWorkspace.name,
                        description: updatedWorkspace.description,
                        scope: updatedWorkspace.scope,
                        joinAt: now,
                    });
                }
                writeJSON(userWorkspacesPath, userWorkspaces);
            });
        }
        return updatedWorkspace;
    },
    /** 删除工作区 */
    deleteWorkspace(workspaceId, executor) {
        if (!workspaceId) throw new Error('workspaceId is required');
        const workspaceFile = path.join(File.workspaces, `${workspaceId}.json`);
        const workspace = readJSON(workspaceFile);
        // 删除用户的工作区信息
        workspace.members.forEach((member) => {
            const memberDir = FileController.userDir(member);
            const userWorkspacesPath = path.join(
                memberDir,
                USER_WORKSPACES_FILE,
            );
            const userWorkspaces = readJSON(userWorkspacesPath);
            const userWorkspace = userWorkspaces.find(
                (w) => w.id === workspaceId,
            );
            if (userWorkspace) {
                userWorkspaces.splice(userWorkspaces.indexOf(userWorkspace), 1);
                writeJSON(userWorkspacesPath, userWorkspaces);
            }
        });
        // 删除工作区的文档信息
        workspace.docs.forEach((doc) =>
            FileController.deleteDoc(doc.docId, executor, true),
        );
        // 删除工作区
        fs.unlinkSync(workspaceFile);
    },
    /** 获取用户最近编辑的文档 */
    recentDocs(userDir) {
        const userRecentDocsFile = path.join(userDir, USER_RECENT_DOCS_FILE);
        return readJSON(userRecentDocsFile);
    },
    /** 获取用户文档列表 */
    docs(userDir) {
        const userDocFile = path.join(userDir, USER_DOCS_FILE);
        return readJSON(userDocFile);
    },
    /** 获取文档信息 */
    doc(docId) {
        if (!docId) throw new Error('docId is required');
        const docDir = path.join(File.docs, `${docId}.json`);
        return readJSON(docDir);
    },
    /** 创建文档 */
    createDoc(userDir, workspace, props, creator) {
        if (!userDir || !workspace || !creator)
            throw new Error('userDir/workspace/creator is required');
        const now = Date.now();
        const newDoc = {
            id: uuid(),
            name: props.name ?? '',
            creator,
            admins: _.uniq([creator, ...workspace.admins]),
            members: workspace.members,
            scope: props.scope ?? workspace.scope,
            date: props.date ?? now,
            workspaces: [workspace.id],
            docType: DocType.Markdown,
            content: '',
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };
        const docFile = path.join(File.docs, `${newDoc.id}.json`);
        writeJSON(docFile, newDoc);
        const docItem = {
            id: newDoc.id,
            name: newDoc.name,
            creator: newDoc.creator,
            scope: newDoc.scope,
            docType: newDoc.docType,
            updatedAt: newDoc.updatedAt,
            createdAt: newDoc.createdAt,
        };
        // 更新用户的文档列表
        const userDocFile = path.join(userDir, USER_DOCS_FILE);
        const userDocs = readJSON(userDocFile);
        userDocs.unshift(docItem);
        writeJSON(userDocFile, userDocs);
        // 更新用户的最近编辑的文档列表
        const userRecentDocsFile = path.join(userDir, USER_RECENT_DOCS_FILE);
        const userRecentDocs = readJSON(userRecentDocsFile);
        userRecentDocs.unshift(docItem);
        writeJSON(userRecentDocsFile, userRecentDocs);
        // 更新工作区的文档列表
        const workspaceDir = path.join(File.workspaces, `${workspace.id}.json`);
        workspace.docs.unshift({
            docId: newDoc.id,
            name: newDoc.name,
            scope: newDoc.scope,
            updatedAt: newDoc.updatedAt,
        });
        writeJSON(workspaceDir, workspace);
        return newDoc;
    },
    /** 更新文档 */
    updateDoc(doc, props) {
        if (!doc) throw new Error('doc is required');
        if (doc.deletedAt) return;
        const now = Date.now();
        const updatedDoc = {
            ...doc,
            name: props.name ?? doc.name,
            content: props.content ?? doc.content,
            scope: props.scope ?? doc.scope,
            date: props.date ?? doc.date,
            updatedAt: now,
        };
        const docDir = path.join(File.docs, `${updatedDoc.id}.json`);
        writeJSON(docDir, updatedDoc);
        const updatedDocItem = {
            id: updatedDoc.id,
            name: updatedDoc.name,
            creator: updatedDoc.creator,
            scope: updatedDoc.scope,
            docType: updatedDoc.docType,
            updatedAt: updatedDoc.updatedAt,
            createdAt: updatedDoc.createdAt,
        };
        // 更新所有成员的文档信息
        doc.members.forEach((member) => {
            const memberDir = FileController.userDir(member);
            // 更新用户的文档列表信息
            const userDocFile = path.join(memberDir, USER_DOCS_FILE);
            const userDocs = readJSON(userDocFile);
            const userDoc = userDocs.find((d) => d.id === doc.id);
            if (userDoc) {
                userDoc.name = updatedDoc.name;
                userDoc.scope = updatedDoc.scope;
                userDoc.updatedAt = updatedDoc.updatedAt;
                // 将更新后的文档信息置顶
                userDocs.splice(userDocs.indexOf(userDoc), 1);
                userDocs.unshift(userDoc);
            } else {
                userDocs.unshift(updatedDocItem);
            }
            writeJSON(userDocFile, userDocs);
            // 更新用户的最近编辑的文档列表信息
            const userRecentDocsFile = path.join(
                memberDir,
                USER_RECENT_DOCS_FILE,
            );
            const userRecentDocs = readJSON(userRecentDocsFile);
            const userRecentDoc = userRecentDocs.find((d) => d.id === doc.id);
            if (userRecentDoc) {
                userRecentDoc.name = updatedDoc.name;
                userRecentDoc.scope = updatedDoc.scope;
                userRecentDoc.updatedAt = updatedDoc.updatedAt;
                // 将更新后的文档信息置顶
                userRecentDocs.splice(userRecentDocs.indexOf(userRecentDoc), 1);
                userRecentDocs.unshift(userRecentDoc);
            } else {
                userRecentDocs.unshift(updatedDocItem);
            }
            writeJSON(userRecentDocsFile, userRecentDocs);
        });
        // 更新所有工作区的文档信息
        doc.workspaces.forEach((workspaceId) => {
            const workspaceDir = path.join(
                File.workspaces,
                `${workspaceId}.json`,
            );
            const workspace = readJSON(workspaceDir);
            const workspaceDoc = workspace.docs.find((d) => d.docId === doc.id);
            if (workspaceDoc) {
                workspaceDoc.name = updatedDoc.name;
                workspaceDoc.scope = updatedDoc.scope;
                workspaceDoc.updatedAt = updatedDoc.updatedAt;
            } else {
                workspace.docs.unshift({
                    docId: updatedDoc.id,
                    name: updatedDoc.name,
                    scope: updatedDoc.scope,
                    updatedAt: updatedDoc.updatedAt,
                });
            }
            writeJSON(workspaceDir, workspace);
        });
        return updatedDoc;
    },
    /** 删除文档 */
    deleteDoc(docId, executor, isPermanent = false) {
        if (!docId) throw new Error('docId is required');
        const docFile = path.join(File.docs, `${docId}.json`);
        const doc = readJSON(docFile);
        if (doc.deletedAt) return;
        // 更新用户的文档信息
        doc.members.forEach((member) => {
            const memberDir = FileController.userDir(member);
            // 更新用户的文档列表
            const userDocFile = path.join(memberDir, USER_DOCS_FILE);
            const userDocs = readJSON(userDocFile);
            const userDoc = userDocs.find((d) => d.id === doc.id);
            if (userDoc) {
                userDocs.splice(userDocs.indexOf(userDoc), 1);
                writeJSON(userDocFile, userDocs);
            }
            // 更新用户的最近编辑的文档列表
            const userRecentDocsFile = path.join(
                memberDir,
                USER_RECENT_DOCS_FILE,
            );
            const userRecentDocs = readJSON(userRecentDocsFile);
            const userRecentDoc = userRecentDocs.find((d) => d.id === doc.id);
            if (userRecentDoc) {
                userRecentDocs.splice(userRecentDocs.indexOf(userRecentDoc), 1);
                writeJSON(userRecentDocsFile, userRecentDocs);
            }
        });
        // 删除工作区的文档信息
        doc.workspaces.forEach((workspaceId) => {
            const workspaceDir = path.join(
                File.workspaces,
                `${workspaceId}.json`,
            );
            const workspace = readJSON(workspaceDir);
            const workspaceDoc = workspace.docs.find((d) => d.docId === doc.id);
            if (workspaceDoc) {
                workspace.docs.splice(workspace.docs.indexOf(workspaceDoc), 1);
                writeJSON(workspaceDir, workspace);
            }
        });
        if (isPermanent) {
            fs.unlinkSync(docFile);
        } else {
            const now = Date.now();
            // 进入回收站
            doc.admins.forEach((userId) => {
                doc.deletedAt = now;
                writeJSON(docFile, doc);
                const userDir = FileController.userDir(userId);
                const userDocBinFile = path.join(userDir, USER_DOC_BIN_FILE);
                const docBin = readJSON(userDocBinFile);
                docBin.unshift({
                    docId: doc.id,
                    name: doc.name,
                    executor,
                    deletedAt: now,
                });
                writeJSON(userDocBinFile, docBin);
            });
        }
    },
    /** 获取用户文档回收站 */
    docBin(userDir) {
        const userDocBinFile = path.join(userDir, USER_DOC_BIN_FILE);
        return readJSON(userDocBinFile);
    },
    /** 从回收站恢复文档 */
    restoreDoc(doc) {
        if (!doc.deletedAt) return;
        const docFile = path.join(File.docs, `${doc.id}.json`);
        // 添加回工作区中
        doc.workspaces.forEach((workspaceId) => {
            const workspace = FileController.workspace(workspaceId);
            workspace.docs.unshift({
                docId: doc.id,
                name: doc.name,
                scope: doc.scope,
                updatedAt: doc.updatedAt,
            });
            FileController.updateWorkspace(workspaceId, workspace);
        });
        // 添加回用户的文档列表
        doc.members.forEach((member) => {
            const memberDir = FileController.userDir(member);
            const userDocFile = path.join(memberDir, USER_DOCS_FILE);
            const userDocs = readJSON(userDocFile);
            userDocs.unshift({
                id: doc.id,
                name: doc.name,
                creator: doc.creator,
                scope: doc.scope,
                docType: doc.docType,
                updatedAt: doc.updatedAt,
                createdAt: doc.createdAt,
            });
            writeJSON(userDocFile, userDocs);
        });
        // 清除用户回收站的记录
        doc.admins.forEach((userId) => {
            const userDir = FileController.userDir(userId);
            const userDocBinFile = path.join(userDir, USER_DOC_BIN_FILE);
            const docBin = readJSON(userDocBinFile);
            const docBinItem = docBin.find((item) => item.docId === doc.id);
            if (docBinItem) {
                docBin.splice(docBin.indexOf(docBinItem), 1);
                writeJSON(userDocBinFile, docBin);
            }
        });
        // 清除文档的删除时间
        doc.deletedAt = null;
        writeJSON(docFile, doc);
    },
};

const Utility = {
    /** 获取权限 */
    access(entity, visitor) {
        if (!entity) throw new Error('entity is required');
        if (entity.admins.includes(visitor)) return Access.Admin;
        if (entity.members.includes(visitor)) return Access.Member;
        if (entity.scope === Scope.Public) return Access.Visitor;
        return Access.Forbidden;
    },
    /** Scope 枚举检查 */
    scopeCheck(value) {
        return Object.values(Scope).includes(value);
    },
    /** 过滤私人文档 */
    filterPrivate(workspace) {
        workspace.docs = workspace.docs.filter((doc) => {
            return doc.scope !== Scope.Private;
        });
    },
    /** 工作区文档目录检查 */
    docDirCheck(dir, workspace) {
        if (!Array.isArray(dir)) return false;
        if (dir.length !== workspace.docs.length) return false;
        for (item of dir) {
            if (!item.docId) return false;
            if (item.name === undefined) return false;
            if (!Utility.scopeCheck(item.scope)) return false;
            if (!item.updatedAt) return false;
        }
        return true;
    },
    /** 映射用户工作区项目 */
    workspaceItems(workspaceItems, newWorkspaceIds) {
        if (!Array.isArray(workspaceItems)) return false;
        // 检查 id 是否完全匹配且完全命中
        const ids = [...new Set(newWorkspaceIds)];
        if (ids.length !== workspaceItems.length) return false;
        if (workspaceItems.some((item) => !ids.includes(item.id))) return false;
        return ids.map((id) => workspaceItems.find((item) => item.id === id));
    },
};

module.exports = {
    LuoyeCtr: FileController,
    LuoyeUtl: Utility,
    LuoyeFile: {
        USER_WORKSPACES_FILE,
        USER_DOCS_FILE,
        USER_RECENT_DOCS_FILE,
        USER_DOC_BIN_FILE,
        DEFAULT_WORKSPACE_NAME,
    },
};
