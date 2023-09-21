const { Dir } = require('../../config');
const { uuid, PropCheck } = require('../../utils');
const { Scope } = require('./constants');
const File = require('../../utils/file');

const LuoyeDir = Dir.storage.luoye;

const Controller = {
    /** 用户文件 */
    userFile(userId) {
        if (!userId) throw new Error('`userId` is required');
        const userDir = File.join(LuoyeDir.users, userId);
        const userFile = {
            // 用户工作区列表
            workspaces: File.join(userDir, 'workspaces.json'),
            // 用户文档列表
            docs: File.join(userDir, 'docs.json'),
            // 用户最近编辑的文档
            recentDocs: File.join(userDir, 'recent-docs.json'),
            // 用户文档回收站
            docBin: File.join(userDir, 'doc-bin.json'),
        };
        if (!File.exists(userDir)) {
            // 初始化用户文件
            File.mkdir(userDir);
            File.writeJSON(userFile.workspaces, []);
            File.writeJSON(userFile.docs, []);
            File.writeJSON(userFile.recentDocs, []);
            File.writeJSON(userFile.docBin, []);
            // 初始化结束

            // 初始化用户的默认工作区
            Controller.workspace.add({}, userId, true);
        }
        return userFile;
    },
    /** 用户文件及内容 */
    user(userId) {
        if (!userId) throw new Error('`userId` is required');
        const userFile = Controller.userFile(userId);
        return {
            workspace: {
                create(props) {
                    if (!props) throw new Error('`props` is required');
                    const workspace = Controller.workspace.add(props, userId);
                    this.items.add(workspace);
                    return workspace;
                },
                items: {
                    get content() {
                        return File.readJSON(userFile.workspaces);
                    },
                    add(workspace) {
                        if (!workspace)
                            throw new Error('`workspace` is required');
                        const wItems = this.content;
                        wItems.unshift({
                            id: workspace.id,
                            name: workspace.name,
                            description: workspace.description,
                            scope: workspace.scope,
                            joinAt: Date.now(),
                        });
                        File.writeJSON(userFile.workspaces, wItems);
                    },
                    update(workspaceId, workspace) {
                        if (!workspaceId || !workspace)
                            throw new Error(
                                '`workspaceId` or `workspace` is required',
                            );
                        const wItems = this.content.map((item) => {
                            if (item.id === workspaceId) {
                                item.name = workspace.name || item.name;
                                item.description =
                                    workspace.description ?? item.description;
                                item.scope = workspace.scope ?? item.scope;
                            }
                            return item;
                        });
                        File.writeJSON(userFile.workspaces, wItems);
                    },
                    remove(workspaceId) {
                        if (!workspaceId)
                            throw new Error('`workspaceId` is required');
                        const wItems = this.content.filter(
                            (item) => item.id !== workspaceId,
                        );
                        File.writeJSON(userFile.workspaces, wItems);
                    },
                },
            },
            get docItems() {
                return File.readJSON(userFile.docs);
            },
            recentDocs: {
                get content() {
                    return File.readJSON(userFile.recentDocs);
                },
                remove(docId) {
                    if (!docId) throw new Error('`docId` is required');
                    const docs = this.content.filter((doc) => doc.id !== docId);
                    File.writeJSON(userFile.recentDocs, docs);
                },
            },
            get docBin() {
                return File.readJSON(userFile.docBin);
            },
        };
    },
    workspace: {
        add(props, creator, isDefault = false) {
            if (!props || !creator)
                throw new Error('`props` or `creator` is required');
            const now = Date.now();
            const workspace = {
                id: isDefault ? creator : uuid(),
                name: props.name || '',
                description: props.description ?? '',
                scope: props.scope ?? Scope.Private,
                creator,
                admins: [creator],
                members: [creator],
                docs: [],
                createdAt: now,
                updatedAt: now,
            };
            const workspaceFile = File.json(LuoyeDir.workspaces, workspace.id);
            File.writeJSON(workspaceFile, workspace);
            // 更新用户的工作区列表
            Controller.user(creator).workspace.items.add(workspace);
            return workspace;
        },
        find(workspaceId) {
            if (!workspaceId) throw new Error('`workspaceId` is required');
            const workspaceFile = File.json(LuoyeDir.workspaces, workspaceId);
            if (!File.exists(workspaceFile)) return null;
            return {
                file: workspaceFile,
                get content() {
                    return File.readJSON(workspaceFile);
                },
                set content(content) {
                    if (!content) throw new Error('`content` is required');
                    File.writeJSON(workspaceFile, content);
                },
                update(props) {
                    if (!props) throw new Error('`props` is required');
                    const now = Date.now();
                    // 更新工作区信息
                    const slice = this.content;
                    slice.name = props.name || slice.name;
                    slice.description = props.description ?? slice.description;
                    slice.scope = props.scope ?? slice.scope;
                    slice.docs = props.docs ?? slice.docs;
                    slice.updatedAt = now;
                    this.content = slice;
                    // 条件更新成员的工作区信息
                    let flag = PropCheck.some(
                        props.name,
                        props.description,
                        props.scope,
                    );
                    if (flag) {
                        // 更新成员的工作区信息
                        slice.members.forEach((memberId) =>
                            Controller.user(memberId).workspace.items.update(
                                workspaceId,
                                slice,
                            ),
                        );
                    }
                    return slice;
                },
            };
        },
    },
};

module.exports = Controller;
