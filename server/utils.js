const https = require('https');
const fs = require('fs');
const path = require('path');
const { mkdirp } = require('mkdirp');
const { exec } = require('child_process');

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

const cmd = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error.message);
                return;
            }
            resolve(stdout || stderr);
        });
    });
};

const request = (title, command, handler) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            console.log('[TEST CASE]:', title);
            if (error) {
                console.error('FATAL ERROR:', error);
                return reject();
            }
            try {
                stdout = JSON.parse(stdout);
                if (!stdout) {
                    console.error('ERROR: EMPTY RESPONSE');
                    return reject();
                }
            } catch (e) {
                console.error('ERROR: INVALID RESPONSE -', e);
                return reject();
            }
            handler(
                stdout,
                (e) => {
                    console.log('OK');
                    resolve(e);
                },
                (...errMsg) => {
                    console.error('ERROR:', ...errMsg);
                    reject();
                },
            );
        });
    });
};

module.exports = {
    downloadFile,
    request,
    cmd,
};
