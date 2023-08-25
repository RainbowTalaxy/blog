const path = require('path');
const { Dir } = require('../config');
const fs = require('fs');
const { readJSON, writeJSON } = require('../utils');

async function main() {
    const docDir = Dir.storage.luoye.docs;
    // 读取 `docs` 目录下的所有文件
    const files = fs.readdirSync(docDir).map((file) => path.join(docDir, file));
    files.forEach((file) => {
        console.log(file);
        const data = readJSON(file);
        data.date = data.createdAt;
        writeJSON(file, data);
    });
}

module.exports = main;
