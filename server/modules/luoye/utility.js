const fs = require('fs');
const path = require('path');
const multer = require('multer');
const dayjs = require('dayjs');
const { Dir, SERVER_URL, LOCAL_SERVER_URL } = require('../../config');
const { uuid } = require('../../utils');
const { Scope, Access, DocType, ErrorMessage } = require('./constants');

const USER_WORKSPACES_FILE = 'workspaces.json'; // 用户工作区列表
const USER_DOCS_FILE = 'docs.json'; // 用户文档列表
const USER_RECENT_DOCS_FILE = 'recent-docs.json'; // 用户最近编辑的文档
const USER_DOC_BIN_FILE = 'doc-bin.json'; // 用户文档回收站
const DEFAULT_WORKSPACE_NAME = 'default'; // 默认工作区名称
const ATTACHMENT_PATH = path.join('temp', 'luoye');
const IMAGE_DIR = path.join(Dir.static, ATTACHMENT_PATH);
const IMAGE_EXTENSIONS = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
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
    /** DocType 枚举检查 */
    docTypeCheck(value) {
        return Object.values(DocType).includes(value);
    },
    /** Tags 参数检查 */
    tagsCheck(tags) {
        if (!Array.isArray(tags)) return false;
        return tags.every(
            (tag) => typeof tag === 'string' && tag.trim().length > 0,
        );
    },
    /** 解析正整数参数 */
    parsePositiveInt(value, fallback) {
        if (value === undefined) return fallback;
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed < 1) return null;
        return parsed;
    },
    /** 检查文档是否可读 */
    checkDocReadable(docCtr, userId) {
        if (!docCtr)
            return {
                status: 404,
                body: { error: 'doc not found', message: '未找到文档' },
            };
        const doc = docCtr.content;
        if (Utility.access(doc, userId) === Access.Forbidden) {
            return {
                status: 403,
                body: ErrorMessage.Forbidden,
            };
        }
        return { doc };
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
    /** 从 Doc 提取 DocItem 字段 */
    toDocItem(doc) {
        return {
            id: doc.id,
            name: doc.name,
            creator: doc.creator,
            scope: doc.scope,
            docType: doc.docType,
            updatedAt: doc.updatedAt,
            createdAt: doc.createdAt,
            tags: doc.tags,
        };
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

const Attachment = {
    decodeOriginalName(originalname) {
        return Buffer.from(originalname, 'latin1').toString('utf8');
    },
    buildStaticUrl(relativePath) {
        const baseUrl =
            process.env.NODE_ENV === 'production'
                ? SERVER_URL
                : LOCAL_SERVER_URL;
        return `${baseUrl}/statics/${relativePath}`;
    },
    buildImageFile(file) {
        const relativePath = path.join(ATTACHMENT_PATH, file.filename);
        return {
            filename: file.filename,
            originalname: Attachment.decodeOriginalName(file.originalname),
            mimetype: file.mimetype,
            size: file.size,
            path: relativePath,
            url: Attachment.buildStaticUrl(relativePath),
        };
    },
    imageUpload: multer({
        storage: multer.diskStorage({
            destination(_, __, cb) {
                fs.mkdirSync(IMAGE_DIR, { recursive: true });
                cb(null, IMAGE_DIR);
            },
            filename(_, file, cb) {
                const ext = IMAGE_EXTENSIONS[file.mimetype] || '';
                const date = dayjs().format('YYYY-MM-DD-HH-mm-ss-SSS');
                cb(null, `${date}-${uuid()}${ext}`);
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter(_, file, cb) {
            if (IMAGE_EXTENSIONS[file.mimetype]) {
                return cb(null, true);
            }
            cb(new Error('仅支持 png、jpg、webp、gif 图片'));
        },
    }),
};

module.exports = {
    LuoyeAttachment: Attachment,
    LuoyeUtl: Utility,
    LuoyeFile: {
        USER_WORKSPACES_FILE,
        USER_DOCS_FILE,
        USER_RECENT_DOCS_FILE,
        USER_DOC_BIN_FILE,
        DEFAULT_WORKSPACE_NAME,
        ATTACHMENT_PATH,
    },
};
