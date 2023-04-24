const https = require('https');
const fs = require('fs');
const path = require('path');
const { mkdirp } = require('mkdirp');

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

module.exports = {
    downloadFile,
};
