const path = require('path');
const { Dir } = require('../config');
const fs = require('fs');
const { readJSON, writeJSON, writeJSONIfNotExist } = require('../utils');
const { LuoyeFile } = require('../controllers/Luoye');

async function main() {
    const docDir = Dir.storage.luoye.docs;
    // 读取 `docs` 目录下的所有文件
    const files = fs.readdirSync(docDir).map((file) => path.join(docDir, file));
    files.forEach((file) => {
        const data = readJSON(file);
        if (data.date === undefined) {
            data.date = data.createdAt;
            writeJSON(file, data);
        }
    });
    const userDir = Dir.storage.luoye.users;
    const userDirs = fs
        .readdirSync(userDir)
        .map((file) => path.join(userDir, file));
    userDirs.forEach((userDir) => {
        const docs = readJSON(path.join(userDir, LuoyeFile.USER_DOCS_FILE));
        writeJSONIfNotExist(
            path.join(userDir, LuoyeFile.USER_RECENT_DOCS_FILE),
            docs.slice(0, 20),
        );
    });
}

module.exports = main;
