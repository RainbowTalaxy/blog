const { Scope, Access, DocType } = require('./constants');

const USER_WORKSPACES_FILE = 'workspaces.json'; // 用户工作区列表
const USER_DOCS_FILE = 'docs.json'; // 用户文档列表
const USER_RECENT_DOCS_FILE = 'recent-docs.json'; // 用户最近编辑的文档
const USER_DOC_BIN_FILE = 'doc-bin.json'; // 用户文档回收站
const DEFAULT_WORKSPACE_NAME = 'default'; // 默认工作区名称

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
    /** DocType 枚举检查 */
    docTypeCheck(value) {
        return Object.values(DocType).includes(value);
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
    LuoyeUtl: Utility,
    LuoyeFile: {
        USER_WORKSPACES_FILE,
        USER_DOCS_FILE,
        USER_RECENT_DOCS_FILE,
        USER_DOC_BIN_FILE,
        DEFAULT_WORKSPACE_NAME,
    },
};
