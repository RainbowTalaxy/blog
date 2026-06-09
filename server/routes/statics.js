/**
 * 在这个路由里，我将写一些访问服务器静态资源的接口
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Dir, SERVER_URL, LOCAL_SERVER_URL } = require('../config');
const { login, adminLogin } = require('../middlewares');

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // multer 会先调用这个函数，此时 req.body 还未完全解析
        // 所以我们先上传到根目录，后续在路由中移动文件
        cb(null, Dir.static);
    },
    filename: function (req, file, cb) {
        // 解决中文文件名乱码问题
        const originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
        );
        // 直接使用原始文件名
        cb(null, originalname);
    },
});

const upload = multer({
    storage: storage,
});

// 创建文件夹（仅 admin）
router.post('/folder', adminLogin, (req, res) => {
    const { path: folderPath } = req.body;

    // 检查路径参数是否存在且不为空
    if (!folderPath || !folderPath.trim()) {
        return res.status(400).send({
            error: '缺少路径参数',
        });
    }

    // 规范化路径并移除前后的斜杠
    const normalizedPath = path
        .normalize(folderPath)
        .replace(/^[\/\\]+|[\/\\]+$/g, '');

    // 检查路径中是否包含危险字符
    if (normalizedPath.includes('..')) {
        return res.status(403).send({
            error: 'Forbidden',
            message: '路径不能包含 ..',
        });
    }

    const dir = path.join(Dir.static, normalizedPath);

    // 如果路径超出了静态资源目录，就返回403
    if (!dir.startsWith(Dir.static)) {
        return res.status(403).send({
            error: 'Forbidden',
        });
    }

    // 检查是否已存在（可能是文件或文件夹）
    if (fs.existsSync(dir)) {
        const stat = fs.statSync(dir);
        if (stat.isDirectory()) {
            return res.status(400).send({
                error: '文件夹已存在',
            });
        } else {
            return res.status(400).send({
                error: '存在同名文件',
                message: '该路径已存在一个文件，请使用其他名称',
            });
        }
    }

    // 创建文件夹
    try {
        fs.mkdirSync(dir, { recursive: true });
        res.send({
            message: '文件夹创建成功',
            path: normalizedPath,
        });
    } catch (err) {
        return res.status(500).send({
            error: '文件夹创建失败',
            message: err.message,
        });
    }
});

// 上传文件（仅 admin）
router.post('/upload', adminLogin, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({
            error: '没有上传文件',
        });
    }

    const sourceFile = req.file.path; // 当前文件位置

    try {
        // 规范化目标路径
        let targetPath = req.body.path || '';
        if (targetPath) {
            targetPath = path
                .normalize(targetPath)
                .replace(/^[\/\\]+|[\/\\]+$/g, '');

            // 检查路径中是否包含危险字符
            if (targetPath.includes('..')) {
                fs.unlinkSync(sourceFile);
                return res.status(403).send({
                    error: 'Forbidden',
                    message: '路径不能包含 ..',
                });
            }
        }

        const targetDir = path.join(Dir.static, targetPath);
        const targetFile = path.join(targetDir, req.file.filename);

        // 检查目标路径是否在静态资源目录内
        if (!targetDir.startsWith(Dir.static)) {
            fs.unlinkSync(sourceFile);
            return res.status(403).send({
                error: 'Forbidden',
            });
        }

        // 检查目标目录是否存在且是一个目录
        if (targetPath) {
            if (!fs.existsSync(targetDir)) {
                fs.unlinkSync(sourceFile);
                return res.status(400).send({
                    error: '目标目录不存在',
                });
            }

            const targetDirStat = fs.statSync(targetDir);
            if (!targetDirStat.isDirectory()) {
                fs.unlinkSync(sourceFile);
                return res.status(400).send({
                    error: '目标路径不是目录',
                    message: '指定的路径是一个文件，而不是目录',
                });
            }
        }

        // 检查目标文件是否已存在
        if (fs.existsSync(targetFile)) {
            fs.unlinkSync(sourceFile);
            return res.status(400).send({
                error: '文件已存在',
                message: `文件 ${req.file.filename} 已存在，请重命名后再上传`,
            });
        }

        // 移动文件到目标目录
        if (sourceFile !== targetFile) {
            fs.renameSync(sourceFile, targetFile);
        }

        const baseUrl =
            process.env.NODE_ENV === 'production'
                ? SERVER_URL
                : LOCAL_SERVER_URL;
        const relativePath = path.join(targetPath, req.file.filename);
        const fileUrl = `${baseUrl}/statics/${relativePath}`;

        // 解决中文文件名乱码问题
        const originalname = Buffer.from(
            req.file.originalname,
            'latin1',
        ).toString('utf8');

        res.send({
            message: '文件上传成功',
            file: {
                filename: req.file.filename,
                originalname: originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: relativePath,
                url: fileUrl,
            },
        });
    } catch (error) {
        // 如果出错，尝试删除已上传的文件
        if (fs.existsSync(sourceFile)) {
            fs.unlinkSync(sourceFile);
        }
        return res.status(500).send({
            error: '文件移动失败',
            message: error.message,
        });
    }
});

// 错误处理中间件
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).send({
            error: error.message,
        });
    } else if (error) {
        return res.status(400).send({
            error: error.message,
        });
    }
    next();
});

// 获取指定目录下的所有文件
router.get('*', login, (req, res) => {
    let dirPath = decodeURIComponent(req.params[0] ?? '');

    // 规范化路径并移除前后的斜杠
    if (dirPath) {
        dirPath = path.normalize(dirPath).replace(/^[\/\\]+|[\/\\]+$/g, '');

        // 检查路径中是否包含危险字符
        if (dirPath.includes('..')) {
            return res.status(403).send({
                error: 'Forbidden',
                message: '路径不能包含 ..',
            });
        }
    }

    const dir = path.join(Dir.static, dirPath);

    // 如果路径超出了静态资源目录，就返回403
    if (!dir.startsWith(Dir.static)) {
        return res.status(403).send({
            error: 'Forbidden',
        });
    }

    // 检查路径是否存在
    if (!fs.existsSync(dir)) {
        return res.status(404).send({
            error: '路径不存在',
        });
    }

    // 检查是否是目录
    try {
        const stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return res.status(400).send({
                error: '路径不是目录',
                message: '指定的路径是一个文件，而不是目录',
            });
        }
    } catch (err) {
        return res.status(500).send({
            error: '读取路径信息失败',
            message: err.message,
        });
    }

    // 读取目录内容
    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).send({
                error: '读取目录失败',
                message: err.message,
            });
        }

        try {
            // 返回文件列表
            return res.send({
                files: files.map((file) => {
                    const fullPath = path.join(dir, file);
                    const stat = fs.statSync(fullPath);
                    return {
                        name: file,
                        isDir: stat.isDirectory(),
                    };
                }),
            });
        } catch (err) {
            return res.status(500).send({
                error: '获取文件信息失败',
                message: err.message,
            });
        }
    });
});

module.exports = { staticsRouter: router };
