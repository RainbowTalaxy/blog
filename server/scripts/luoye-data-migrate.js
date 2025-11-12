const path = require('path');
const { Dir } = require('../config');
const fs = require('fs');
const { readJSON, writeJSON, writeJSONIfNotExist } = require('../utils');
const { LuoyeFile } = require('../modules/luoye/utility');

async function main() {
    const docDir = Dir.storage.luoye.docs;
    // 读取 `docs` 目录下的所有文件
    const files = fs.readdirSync(docDir).map((file) => path.join(docDir, file));
    // 补齐历史 date 字段
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
    // 最近文档数据补丁
    userDirs.forEach((userDir) => {
        const docsFile = readJSON(path.join(userDir, LuoyeFile.USER_DOCS_FILE));
        writeJSONIfNotExist(
            path.join(userDir, LuoyeFile.USER_RECENT_DOCS_FILE),
            docsFile.slice(0, 20),
        );
    });
    // 文档回收站数据补丁
    userDirs.forEach((userDir) => {
        const binFile = path.join(userDir, LuoyeFile.USER_DOC_BIN_FILE);
        writeJSONIfNotExist(binFile, []);
    });
    const docFiles = fs
        .readdirSync(docDir)
        .map((file) => path.join(docDir, file));
    docFiles.forEach((docFile) => {
        const data = readJSON(docFile);
        if (data.deletedAt === undefined) {
            data.deletedAt = null;
            writeJSON(docFile, data);
        }
    });

    // 缺陷：每当用户更新文档后，用户的 docs.json 中所有列表项的 `name` `scope` `updatedAt` 字段都会被覆盖
    // 解决方式：对 USER_DOCS_FILE 中的数据，根据 id ，从 docDir 拉取对应的文档数据，并同步 `name` `scope` `updatedAt` 字段值
    userDirs.forEach((userDir) => {
        const docsFile = path.join(userDir, LuoyeFile.USER_DOCS_FILE);
        if (fs.existsSync(docsFile)) {
            const userDocs = readJSON(docsFile);
            let hasChanges = false;

            // 遍历用户文档列表，同步字段
            const updatedUserDocs = userDocs.map((docItem) => {
                const docFilePath = path.join(docDir, `${docItem.id}.json`);

                // 检查对应的文档文件是否存在
                if (fs.existsSync(docFilePath)) {
                    const docData = readJSON(docFilePath);

                    // 检查是否需要更新字段
                    if (
                        docItem.name !== docData.name ||
                        docItem.scope !== docData.scope ||
                        docItem.updatedAt !== docData.updatedAt
                    ) {
                        hasChanges = true;
                        return {
                            ...docItem,
                            name: docData.name,
                            scope: docData.scope,
                            updatedAt: docData.updatedAt,
                        };
                    }
                }

                return docItem;
            });

            // 如果有变更，写回文件
            if (hasChanges) {
                writeJSON(docsFile, updatedUserDocs);
                console.log(`Updated user docs for: ${path.basename(userDir)}`);
            }
        }
    });
}

module.exports = main;
