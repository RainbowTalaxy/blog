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
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        return fs.readFileSync(filePath);
    }

    /** 写入 json 文件 */
    static writeJSON(path, json) {
        fs.writeFileSync(filePath, JSON.stringify(json));
    }

    /** 删除文件 */
    static delete(path) {
        fs.unlinkSync(path);
    }
}

module.exports = File;
