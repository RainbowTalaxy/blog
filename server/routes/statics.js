/**
 * 在这个路由里，我将写一些访问服务器静态资源的接口
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { STATIC_DIR } = require('../constants');

// 获取指定目录下的所有文件
router.get(['/:filePath', ''], (req, res) => {
    const { filePath = '' } = req.params;
    const dir = path.join(STATIC_DIR, filePath);
    // 如果路径超出了静态资源目录，就返回403
    if (!dir.startsWith(STATIC_DIR)) {
        res.status(403).send({
            error: 'Forbidden',
        });
    }
    console.log(dir);
    fs.readdir(dir, (err, files) => {
        if (err) {
            res.status(404).send({
                error: 'Not Found',
            });
        } else {
            // 返回文件列表，如果是文件目录，就在文件名后面加上 '/'
            res.send(
                files.map((file) => {
                    const filePath = path.join(dir, file);
                    const stat = fs.statSync(filePath);
                    return {
                        name: file,
                        isDir: stat.isDirectory(),
                    };
                }),
            );
        }
    });
});

module.exports = { staticsRouter: router };
