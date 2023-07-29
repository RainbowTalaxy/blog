const { mkdirp } = require('mkdirp');
const { Dir } = require('../config');
const fs = require('fs');
const { writeJSON, uuid, readJSON } = require('../utils');
const path = require('path');
const _ = require('lodash');

const USER_WORKSPACES_FILE = 'workspaces.json';
const USER_DOCS_FILE = 'docs.json';
const DEFAULT_WORKSPACE_NAME = 'default';

class Scope {
    static Private = 'private';
    static Public = 'public';
}

class DocType {
    static Markdown = 'markdown';
}

class Access {
    static Forbidden = 0;
    static Visitor = 10;
    static Member = 50;
    static Admin = 100;
}

const File = Dir.storage.luoye;

const FileController = {
    // 获取用户目录
    userDir(userId) {
        if (!userId) throw new Error('userId is required');
        const userDir = path.join(File.users, userId);
        if (!fs.existsSync(userDir)) {
            mkdirp.sync(userDir);
            const userWorkspacesFile = path.join(userDir, USER_WORKSPACES_FILE);
            const userDocFile = path.join(userDir, USER_DOCS_FILE);
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
        }
        return userDir;
    },
    // 获取用户工作区列表
    workspaces(userDir) {
        const userWorkspacesPath = path.join(userDir, USER_WORKSPACES_FILE);
        return readJSON(userWorkspacesPath);
    },
    // 获取工作区信息
    workspace(workspaceId) {
        if (!workspaceId) throw new Error('workspaceId is required');
        const workspaceDir = path.join(File.workspaces, `${workspaceId}.json`);
        return readJSON(workspaceDir);
    },
    // 创建工作区
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
    // 更新工作区
    updateWorkspace(workspaceId, props) {
        if (!workspaceId) throw new Error('workspaceId is required');
        const workspaceDir = path.join(File.workspaces, `${workspaceId}.json`);
        const workspace = readJSON(workspaceDir);
        const now = Date.now();
        const updatedWorkspace = {
            ...workspace,
            name: props.name || workspace.name,
            description: props.description || workspace.description,
            scope: props.scope || workspace.scope,
            updatedAt: now,
        };
        writeJSON(workspaceDir, updatedWorkspace);
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
    // 获取用户文档列表
    docs(userDir) {
        const userDocFile = path.join(userDir, USER_DOCS_FILE);
        return readJSON(userDocFile);
    },
    // 获取文档信息
    doc(docId) {
        if (!docId) throw new Error('docId is required');
        const docDir = path.join(File.docs, `${docId}.json`);
        return readJSON(docDir);
    },
    // 创建文档
    createDoc(userDir, workspace, props, creator) {
        if (!userDir || !workspace || !creator)
            throw new Error('userDir/workspace/creator is required');
        const userDocFile = path.join(userDir, USER_DOCS_FILE);
        const userDocs = readJSON(userDocFile);
        const now = Date.now();
        const newDoc = {
            id: uuid(),
            name: props.name || '',
            creator,
            admins: _.uniq([creator, ...workspace.admins]),
            members: workspace.members,
            scope: workspace.scope,
            workspaces: [workspace.id],
            docType: DocType.Markdown,
            content: '',
            createdAt: now,
            updatedAt: now,
        };
        const docFile = path.join(File.docs, `${newDoc.id}.json`);
        writeJSON(docFile, newDoc);
        userDocs.unshift({
            id: newDoc.id,
            name: newDoc.name,
            creator: newDoc.creator,
            scope: newDoc.scope,
            docType: newDoc.docType,
            updatedAt: newDoc.updatedAt,
            createdAt: newDoc.createdAt,
        });
        writeJSON(userDocFile, userDocs);
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
    updateDoc(docId, props) {
        if (!docId) throw new Error('docId is required');
        const docDir = path.join(File.docs, `${docId}.json`);
        const doc = readJSON(docDir);
        const now = Date.now();
        const updatedDoc = {
            ...doc,
            name: props.name || doc.name,
            content: props.content || doc.content,
            scope: props.scope || doc.scope,
            updatedAt: now,
        };
        writeJSON(docDir, updatedDoc);
        // 更新所有成员的文档信息
        doc.members.forEach((member) => {
            const memberDir = FileController.userDir(member);
            const userDocFile = path.join(memberDir, USER_DOCS_FILE);
            const userDocs = readJSON(userDocFile);
            const userDoc = userDocs.find((d) => d.id === docId);
            if (userDoc) {
                userDoc.name = updatedDoc.name;
                userDoc.scope = updatedDoc.scope;
                userDoc.updatedAt = updatedDoc.updatedAt;
                // 将更新后的文档信息置顶
                userDocs.splice(userDocs.indexOf(userDoc), 1);
                userDocs.unshift(userDoc);
            } else {
                userDocs.unshift({
                    id: updatedDoc.id,
                    name: updatedDoc.name,
                    creator: updatedDoc.creator,
                    scope: updatedDoc.scope,
                    docType: updatedDoc.docType,
                    updatedAt: updatedDoc.updatedAt,
                    createdAt: updatedDoc.createdAt,
                });
            }
            writeJSON(userDocFile, userDocs);
        });
        // 更新所有工作区的文档信息
        doc.workspaces.forEach((workspaceId) => {
            const workspaceDir = path.join(
                File.workspaces,
                `${workspaceId}.json`,
            );
            const workspace = readJSON(workspaceDir);
            const workspaceDoc = workspace.docs.find((d) => d.docId === docId);
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
    deleteDoc(docId) {
        if (!docId) throw new Error('docId is required');
        const docDir = path.join(File.docs, `${docId}.json`);
        const doc = readJSON(docDir);
        // 删除文档
        fs.unlinkSync(docDir);
        // 删除用户的文档信息
        doc.members.forEach((member) => {
            const memberDir = FileController.userDir(member);
            const userDocFile = path.join(memberDir, USER_DOCS_FILE);
            const userDocs = readJSON(userDocFile);
            const userDoc = userDocs.find((d) => d.id === docId);
            if (userDoc) {
                userDocs.splice(userDocs.indexOf(userDoc), 1);
                writeJSON(userDocFile, userDocs);
            }
        });
        // 删除工作区的文档信息
        doc.workspaces.forEach((workspaceId) => {
            const workspaceDir = path.join(
                File.workspaces,
                `${workspaceId}.json`,
            );
            const workspace = readJSON(workspaceDir);
            const workspaceDoc = workspace.docs.find((d) => d.docId === docId);
            if (workspaceDoc) {
                workspace.docs.splice(workspace.docs.indexOf(workspaceDoc), 1);
                writeJSON(workspaceDir, workspace);
            }
        });
    },
};

const Utility = {
    access(entity, visitor) {
        if (!entity || !visitor)
            throw new Error('workspace/visitor is required');
        if (entity.admins.includes(visitor)) return Access.Admin;
        if (entity.members.includes(visitor)) return Access.Member;
        if (entity.scope === Scope.Public) return Access.Visitor;
        return Access.Forbidden;
    },
    scopeCheck(value) {
        return Object.values(Scope).includes(value);
    },
};

module.exports = {
    LuoyeCtr: FileController,
    LuoyeUtl: Utility,
    Scope,
    Access,
};
