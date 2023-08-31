const https = require('https');
const fs = require('fs');
const path = require('path');
const { mkdirp } = require('mkdirp');
const { v4: uuid } = require('uuid');

async function downloadFile(url, localPath) {
    mkdirp.sync(path.dirname(localPath));
    const fileStream = fs.createWriteStream(localPath);

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            response.on('error', (err) => {
                fs.unlink(localPath, () => {
                    reject(err);
                });
            });

            fileStream.on('error', (err) => {
                fs.unlink(localPath, () => {
                    reject(err);
                });
            });
        });
    });
}

const readJSON = (filePath, defaultValue = null) => {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const content = fs.readFileSync(filePath);
    try {
        return JSON.parse(content);
    } catch {
        return defaultValue;
    }
};

const writeJSON = (filePath, content) => {
    fs.writeFileSync(filePath, JSON.stringify(content));
};

const writeJSONIfNotExist = (filePath, content) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(content));
    }
};

const enumCheck = (value, enumObj) => {
    return Object.values(enumObj).includes(value);
};

const PropCheck = {
    enum: enumCheck,
    date: (value) => typeof value === 'number',
};

module.exports = {
    uuid,
    downloadFile,
    readJSON,
    writeJSON,
    writeJSONIfNotExist,
    enumCheck,
    PropCheck,
};
