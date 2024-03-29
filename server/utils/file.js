const fs = require('fs');
const path = require('path');
const { mkdirp } = require('mkdirp');

class File {
    /** 拼接路径 */
    static join(...paths) {
        return path.join(...paths);
    }

    /** 拼接路径，并在末尾加 `json` 后缀 */
    static json(...path) {
        return File.join(...path) + '.json';
    }

    /** 路径是否存在 */
    static exists(path) {
        return fs.existsSync(path);
    }

    /** 创建文件夹 */
    static mkdir(path) {
        mkdirp.sync(path);
    }

    /** 读取 json 文件 */
    static readJSON(path) {
        if (!fs.existsSync(path)) {
            throw new Error(`File not found: ${path}`);
        }
        return JSON.parse(fs.readFileSync(path));
    }

    /** 写入 json 文件 */
    static writeJSON(path, json) {
        fs.writeFileSync(path, JSON.stringify(json));
    }

    /** 删除文件 */
    static delete(path) {
        fs.unlinkSync(path);
    }

    /** 删除文件下所有文件 */
    static rmdir(path) {
        fs.rmSync(path, { recursive: true });
    }
}

module.exports = File;
