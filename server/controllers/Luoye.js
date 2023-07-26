const { mkdirp } = require('mkdirp');
const { Dir } = require('../config');
const fs = require('fs');
const { writeJSON, uuid, readJSON } = require('../utils');
const path = require('path');

const USER_WORKSPACES_FILE = 'workspaces.json';
const USER_DOCS_FILE = 'docs.json';
const DEFAULT_WORKSPACE_NAME = 'default';

const Scope = {
    Private: 'private',
    Public: 'public',
};

const Access = {
    Forbidden: 'forbidden',
    Visitor: 'visitor',
    Member: 'member',
    Admin: 'admin',
};

const File = Dir.storage.luoye;

const FileController = {
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
                owner: userId,
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
    workspaces(userDir) {
        const userWorkspacesPath = path.join(userDir, USER_WORKSPACES_FILE);
        return readJSON(userWorkspacesPath);
    },
    workspace(workspaceId) {
        const workspaceDir = path.join(File.workspaces, `${workspaceId}.json`);
        return readJSON(workspaceDir);
    },
    workspaceAccess(workspace, visitor) {
        if (!workspace || !visitor)
            throw new Error('workspace/visitor is required');
        if (workspace.admins.includes(visitor)) return Access.Admin;
        if (workspace.members.includes(visitor)) return Access.Member;
        if (workspace.scope === Scope.Public) return Access.Visitor;
        return Access.Forbidden;
    },
    createWorkspace(userDir, props, creator) {
        if (!userDir || !creator)
            throw new Error('userDir/creator is required');
        const userWorkspacesPath = path.join(userDir, USER_WORKSPACES_FILE);
        const userWorkspaces = readJSON(userWorkspacesPath);
        const now = Date.now();
        const newWorkspace = {
            name: '',
            description: '',
            scope: Scope.Private,
            ...props,
            id: uuid(),
            owner: creator,
            creator: creator,
            admins: [creator],
            members: [creator],
            docs: [],
            createdAt: now,
            updatedAt: now,
        };
        const workspaceDir = path.join(
            File.workspaces,
            `${newWorkspace.id}.json`,
        );
        writeJSON(workspaceDir, newWorkspace);
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
    updateWorkspace(workspaceId, props) {
        if (!workspaceId) throw new Error('workspaceId is required');
        const workspaceDir = path.join(File.workspaces, `${workspaceId}.json`);
        const workspace = readJSON(workspaceDir);
        const now = Date.now();
        const updatedWorkspace = {
            ...workspace,
            ...props,
            updatedAt: now,
        };
        writeJSON(workspaceDir, updatedWorkspace);
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
                userWorkspace.updatedAt = now;
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
        return updatedWorkspace;
    },
};

module.exports = {
    LuoyeCtr: FileController,
    Scope,
    Access,
};
