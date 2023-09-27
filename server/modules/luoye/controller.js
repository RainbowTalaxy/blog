// @ts-check

const { Dir } = require('../../config');
const { uuid, PropCheck } = require('../../utils');
const { Scope, DocType } = require('./constants');
const File = require('../../utils/file');
const _ = require('lodash');

const LuoyeDir = Dir.storage.luoye;

/** @type {import('./controller')} */
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
            workspaceItems: {
                get content() {
                    return File.readJSON(userFile.workspaces);
                },
                set content(newItems) {
                    if (!newItems) throw new Error('`newItems` is required');
                    File.writeJSON(userFile.workspaces, newItems);
                },
                add(workspace) {
                    if (!workspace) throw new Error('`workspace` is required');
                    const slice = this.content;
                    slice.unshift({
                        id: workspace.id,
                        name: workspace.name,
                        description: workspace.description,
                        scope: workspace.scope,
                        joinAt: Date.now(),
                    });
                    this.content = slice;
                },
                update(workspace) {
                    if (!workspace) throw new Error('`workspace` is required');
                    this.content = this.content.map((item) => {
                        if (item.id === workspace.id) {
                            // ---
                            item.name = workspace.name;
                            item.description = workspace.description;
                            item.scope = workspace.scope;
                            // ---
                        }
                        return item;
                    });
                },
                remove(workspaceId) {
                    if (!workspaceId)
                        throw new Error('`workspaceId` is required');
                    this.content = this.content.filter(
                        (item) => item.id !== workspaceId,
                    );
                },
            },
            docItems: {
                get content() {
                    return File.readJSON(userFile.docs);
                },
                set content(newItems) {
                    if (!newItems) throw new Error('`newItems` is required');
                    File.writeJSON(userFile.docs, newItems);
                },
                add(doc) {
                    if (!doc) throw new Error('`doc` is required');
                    const docItems = this.content;
                    const docItem = {
                        id: doc.id,
                        name: doc.name,
                        creator: doc.creator,
                        scope: doc.scope,
                        docType: doc.docType,
                        updatedAt: doc.updatedAt,
                        createdAt: doc.createdAt,
                    };
                    docItems.unshift(docItem);
                    File.writeJSON(userFile.docs, docItems);
                    // 更新最近文档
                    Controller.user(userId).recentDocs.record(docItem);
                },
                update(doc) {
                    if (!doc) throw new Error('`doc` is required');
                    this.content = this.content.map((dItem) => {
                        // ---
                        dItem.name = doc.name;
                        dItem.scope = doc.scope;
                        dItem.updatedAt = doc.updatedAt;
                        // ---
                        return dItem;
                    });
                    // 更新最近文档
                    Controller.user(userId).recentDocs.record(doc);
                },
                remove(docId) {
                    if (!docId) throw new Error('`docId` is required');
                    const docItems = this.content.filter(
                        (doc) => doc.id !== docId,
                    );
                    this.content = docItems;
                    // 更新最近文档
                    Controller.user(userId).recentDocs.remove(docId);
                },
            },
            recentDocs: {
                get content() {
                    return File.readJSON(userFile.recentDocs);
                },
                set content(newDocItems) {
                    if (!newDocItems)
                        throw new Error('`newDocItems` is required');
                    File.writeJSON(userFile.recentDocs, newDocItems);
                },
                record(docItem) {
                    if (!docItem) throw new Error('`docItem` is required');
                    const slice = this.content.filter(
                        (dItem) => dItem.id !== docItem.id,
                    );
                    slice.unshift(docItem);
                    this.content = slice;
                },
                remove(docId) {
                    if (!docId) throw new Error('`docId` is required');
                    this.content = this.content.filter(
                        (doc) => doc.id !== docId,
                    );
                },
            },
            docBinItems: {
                get content() {
                    return File.readJSON(userFile.docBin);
                },
                set content(newDocBinItems) {
                    if (!newDocBinItems)
                        throw new Error('`newDocBinItems` is required');
                    File.writeJSON(userFile.docBin, newDocBinItems);
                },
                add(doc, executor) {
                    if (!doc) throw new Error('`doc` is required');
                    const now = Date.now();
                    const slice = this.content;
                    slice.unshift({
                        docId: doc.id,
                        name: doc.name,
                        executor,
                        deletedAt: now,
                    });
                    this.content = slice;
                },
                remove(docId) {
                    if (!docId) throw new Error('`docId` is required');
                    this.content = this.content.filter(
                        (doc) => doc.docId !== docId,
                    );
                },
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
                name: props.name ?? '',
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
            Controller.user(creator).workspaceItems.add(workspace);
            return workspace;
        },
        ctr(workspaceId) {
            if (!workspaceId) throw new Error('`workspaceId` is required');
            const workspaceFile = File.json(LuoyeDir.workspaces, workspaceId);
            if (!File.exists(workspaceFile)) return null;
            return {
                get content() {
                    return File.readJSON(workspaceFile);
                },
                set content(newWorkspace) {
                    if (!newWorkspace) throw new Error('`content` is required');
                    File.writeJSON(workspaceFile, newWorkspace);
                },
                update(props) {
                    if (!props) throw new Error('`props` is required');
                    const now = Date.now();
                    // 更新工作区信息
                    const slice = this.content;
                    // ---
                    slice.name = props.name || slice.name;
                    slice.description = props.description ?? slice.description;
                    slice.scope = props.scope ?? slice.scope;
                    slice.docs = props.docs ?? slice.docs;
                    slice.updatedAt = now;
                    // ---
                    // 条件更新成员的工作区信息
                    let flag = PropCheck.some(
                        props.name,
                        props.description,
                        props.scope,
                    );
                    if (flag) {
                        // 更新成员的工作区信息
                        slice.members.forEach((memberId) =>
                            Controller.user(memberId).workspaceItems.update(
                                slice,
                            ),
                        );
                    }
                    this.content = slice;
                    return slice;
                },
                delete() {
                    const slice = this.content;
                    slice.docs.forEach((docDir) =>
                        Controller.doc.ctr(docDir.docId)?.delete(),
                    );
                    slice.members.forEach((memberId) =>
                        Controller.user(memberId).workspaceItems.remove(
                            workspaceId,
                        ),
                    );
                    File.delete(workspaceFile);
                },
                addDoc(doc) {
                    if (!doc) throw new Error('`doc` is required');
                    const slice = this.content;
                    slice.docs.push({
                        docId: doc.id,
                        name: doc.name,
                        scope: doc.scope,
                        updatedAt: doc.updatedAt,
                    });
                    this.content = slice;
                },
                updateDoc(doc) {
                    if (!doc) throw new Error('`doc` is required');
                    const slice = this.content;
                    slice.docs = slice.docs.map((docDir) => {
                        if (docDir.docId === doc.id) {
                            // ---
                            docDir.name = doc.name;
                            docDir.scope = doc.scope;
                            docDir.updatedAt = doc.updatedAt;
                            // ---
                        }
                        return docDir;
                    });
                    this.content = slice;
                },
                removeDoc(docId) {
                    if (!docId) throw new Error('`docId` is required');
                    const slice = this.content;
                    slice.docs = slice.docs.filter(
                        (docDir) => docId !== docDir.docId,
                    );
                    this.content = slice;
                },
            };
        },
    },
    doc: {
        add(props, workspaceCtr, creator) {
            if (!props || !workspaceCtr || !creator)
                throw new Error(
                    '`props` or `workspaceCtr` or `creator` is required',
                );
            const workspace = workspaceCtr.content;
            const now = Date.now();
            const doc = {
                id: uuid(),
                name: props.name ?? '',
                creator,
                admins: _.uniq([creator, ...workspace.admins]),
                members: workspace.members,
                scope: props.scope ?? workspace.scope,
                date: props.date ?? now,
                workspaces: [workspace.id],
                docType: props.docType ?? DocType.Text,
                content: '',
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            const docFile = File.json(LuoyeDir.docs, doc.id);
            File.writeJSON(docFile, doc);
            // 更新工作区的文档列表
            workspaceCtr.addDoc(doc);
            // 更新用户的文档列表
            Controller.user(creator).docItems.add(doc);
            return doc;
        },
        ctr(docId) {
            if (!docId) throw new Error('`docId` is required');
            const docFile = File.json(LuoyeDir.docs, docId);
            if (!File.exists(docFile)) return null;
            return {
                get content() {
                    return File.readJSON(docFile);
                },
                set content(newDoc) {
                    if (!newDoc) throw new Error('`newDoc` is required');
                    File.writeJSON(docFile, newDoc);
                },
                update(props) {
                    if (!props) throw new Error('`props` is required');
                    const now = Date.now();
                    const slice = this.content;
                    if (slice.deletedAt) return slice;
                    // ---
                    slice.name = props.name ?? slice.name;
                    slice.scope = props.scope ?? slice.scope;
                    slice.date = props.date ?? slice.date;
                    slice.content = props.content ?? slice.content;
                    slice.updatedAt = now;
                    // ---
                    // 更新用户的文档列表
                    slice.members.forEach((memberId) =>
                        Controller.user(memberId).docItems.update(slice),
                    );
                    // 更新工作区的文档列表
                    slice.workspaces.forEach((workspaceId) =>
                        Controller.workspace.ctr(workspaceId)?.updateDoc(slice),
                    );
                    this.content = slice;
                    return slice;
                },
                remove(executor) {
                    if (!executor) throw new Error('`executor` is required');
                    const slice = this.content;
                    if (slice.deletedAt) return;
                    slice.deletedAt = Date.now();
                    slice.members.forEach((memberId) =>
                        Controller.user(memberId).docItems.remove(docId),
                    );
                    slice.workspaces.forEach((workspaceId) => {
                        Controller.workspace
                            .ctr(workspaceId)
                            ?.removeDoc(slice.id);
                    });
                    slice.admins.forEach((adminId) =>
                        Controller.user(adminId).docBinItems.add(
                            slice,
                            executor,
                        ),
                    );
                    this.content = slice;
                },
                restore() {
                    const slice = this.content;
                    if (!slice.deletedAt) return;
                    slice.deletedAt = null;
                    // 更新用户的文档列表
                    slice.members.forEach((memberId) =>
                        Controller.user(memberId).docItems.add(slice),
                    );
                    // 更新工作区的文档列表
                    slice.workspaces.forEach((workspaceId) =>
                        Controller.workspace.ctr(workspaceId)?.addDoc(slice),
                    );
                    // 更新管理员的文档回收站
                    slice.admins.forEach((adminId) =>
                        Controller.user(adminId).docBinItems.remove(docId),
                    );
                    this.content = slice;
                },
                delete() {
                    const slice = this.content;
                    slice.members.forEach((memberId) =>
                        Controller.user(memberId).docItems.remove(docId),
                    );
                    slice.workspaces.forEach((workspaceId) => {
                        Controller.workspace
                            .ctr(workspaceId)
                            ?.removeDoc(slice.id);
                    });
                    File.delete(docFile);
                },
            };
        },
    },
    clear() {
        File.rmdir(LuoyeDir.workspaces);
        File.rmdir(LuoyeDir.docs);
        File.rmdir(LuoyeDir.users);
        File.mkdir(LuoyeDir.workspaces);
        File.mkdir(LuoyeDir.docs);
        File.mkdir(LuoyeDir.users);
    },
};

module.exports = Controller;
