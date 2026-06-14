const fs = require('fs');
const path = require('path');
const multer = require('multer');
const dayjs = require('dayjs');
const sharp = require('sharp');
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
const MAX_IMAGE_UPLOAD_SIZE = 50 * 1024 * 1024;
const MAX_COMPRESSED_IMAGE_EDGE = 2560;
const COMPRESSED_IMAGE_QUALITY = 85;
const SHARP_INPUT_OPTIONS = {
    failOn: 'warning',
    limitInputPixels: 50_000_000,
    limitInputChannels: 5,
};
const IMAGE_EXTENSIONS = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
};
const IMAGE_MIMES_BY_FORMAT = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
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
        for (const item of dir) {
            if (!item.docId) return false;
            if (item.name === undefined) return false;
            if (!Utility.scopeCheck(item.scope)) return false;
            if (typeof item.createdAt !== 'number') return false;
            if (typeof item.date !== 'number') return false;
            if (typeof item.updatedAt !== 'number') return false;
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
            date: doc.date,
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
    async validateImage(file) {
        if (!file) throw new Error('没有上传文件');
        const metadata = await sharp(file.path, SHARP_INPUT_OPTIONS).metadata();
        const actualMime = IMAGE_MIMES_BY_FORMAT[metadata.format];

        if (!actualMime) throw new Error('不支持的图片格式');
        if (actualMime !== file.mimetype)
            throw new Error('图片类型与文件内容不匹配');
        if (!metadata.width || !metadata.height)
            throw new Error('图片尺寸无效');

        return metadata;
    },
    async compressImage(file) {
        if (!file) throw new Error('没有上传文件');

        const originalPath = file.path;
        const compressedPath = `${originalPath}.compressed`;

        try {
            await Attachment.validateImage(file);
            if (file.mimetype === 'image/gif') {
                file.size = fs.statSync(originalPath).size;
                return file;
            }

            let image = sharp(originalPath, SHARP_INPUT_OPTIONS)
                .rotate()
                .resize({
                    width: MAX_COMPRESSED_IMAGE_EDGE,
                    height: MAX_COMPRESSED_IMAGE_EDGE,
                    fit: 'inside',
                    withoutEnlargement: true,
                });

            if (file.mimetype === 'image/jpeg') {
                image = image.jpeg({
                    quality: COMPRESSED_IMAGE_QUALITY,
                    mozjpeg: true,
                });
            } else if (file.mimetype === 'image/png') {
                image = image.png({
                    compressionLevel: 9,
                    adaptiveFiltering: true,
                });
            } else if (file.mimetype === 'image/webp') {
                image = image.webp({
                    quality: COMPRESSED_IMAGE_QUALITY,
                });
            } else {
                return file;
            }

            await image.toFile(compressedPath);

            const originalSize = fs.statSync(originalPath).size;
            const compressedSize = fs.statSync(compressedPath).size;
            if (compressedSize < originalSize) {
                fs.renameSync(compressedPath, originalPath);
                file.size = compressedSize;
            } else {
                fs.unlinkSync(compressedPath);
                file.size = originalSize;
            }
            return file;
        } catch (error) {
            if (fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
            if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
            throw error;
        }
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
            fileSize: MAX_IMAGE_UPLOAD_SIZE,
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
        MAX_IMAGE_UPLOAD_SIZE,
    },
};
