const { exec } = require('child_process');
const { Server } = require('../config');

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
                console.error('[FATAL ERROR]:', error);
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
                    reject(new Error('[TEST FAILED]'));
                },
            );
        });
    });
};

const customEncodeURIComponent = (str) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
        return '%' + c.charCodeAt(0).toString(16);
    });
};

/**
 * 帮我写一个有利于生成 curl 命令的函数，有这样的要求：
 * 1. 输入为 url, method, data 。其中 data 可能是 query 或 body
 * 2. 仅生成一个字符串，即 curl 命令
 * 3. curl 使用的 RESTFul API 风格
 */
const curl = (url, method, data) => {
    let basicCmd = `curl -X ${method} -H 'Content-Type: application/json'`;
    let basicUrl = `${Server}${url}`;
    if (data) {
        if (method === 'GET') {
            // 将 data 视为 query。将 query 拼接到 url 上
            let query = Object.entries(data)
                .map(
                    ([key, value]) =>
                        `${key}=${customEncodeURIComponent(value)}`,
                )
                .join('&');
            basicUrl += `?${query}`;
        } else {
            // 将 data 视为 body。将 body 作为参数传递给 curl
            basicCmd += ` -d '${JSON.stringify(data)}'`;
        }
    }
    return `${basicCmd} ${basicUrl}`;
};

module.exports = {
    request,
    cmd,
    curl,
};
