const { default: axios } = require('axios');
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
                console.error('RESPONSE:', stdout);
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
const curl = (url, method, data, authorization, cookie) => {
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
    if (authorization) {
        // 将 cookie 对象转为 string
        let authorizationStr = Object.entries(authorization)
            .map(([key, value]) => `${key}=${value}`)
            .join(';');
        basicCmd += ` -H 'Authorization: ${authorizationStr}'`;
    }
    if (cookie) {
        // 将 cookie 对象转为 string
        let cookieStr = Object.entries(cookie)
            .map(([key, value]) => `${key}=${value}`)
            .join(';');
        basicCmd += ` --cookie '${cookieStr}'`;
    }
    return `${basicCmd} ${basicUrl}`;
};

class Rocket {
    constructor(baseUrl = Server) {
        this.baseUrl = baseUrl;
    }

    async get(url, params) {
        const { data } = await axios.get(this.baseUrl + url, {
            params,
            headers: {
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async post(url, body) {
        const { data } = await axios.post(this.baseUrl + url, body, {
            headers: {
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async put(url, body) {
        const { data } = await axios.put(this.baseUrl + url, body, {
            headers: {
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async delete(url, params) {
        const { data } = await axios.delete(this.baseUrl + url, {
            params,
            headers: {
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async login(id, key) {
        const { data } = await axios.post(
            Server + '/user/login',
            {
                id,
                key,
            },
            {
                validateStatus: () => true,
            },
        );
        if (data.error) throw new Error(data.error);
        this.token = data.token;
        console.log('🐰', 'Login:', id);
    }
}

class TestCase {
    constructor(name) {
        this.name = `[${name}]`;
        console.log(`--------------------${this.name}--------------------`);
    }
    title(title) {
        console.log('📢', this.name, title);
    }
    async pos(title, task) {
        try {
            const result = await task();
            console.log('🔆', this.name, title);
            return result;
        } catch (e) {
            console.log('❗️', this.name, title);
            console.error('\tERROR:', e.message);
        }
    }
    async neg(title, task) {
        try {
            await task();
            console.log('❗️', this.name, title);
            console.error('\tERROR:', 'Expect "error"');
        } catch (e) {
            console.log('🔆', this.name, title, `(error: ${e.message})`);
        }
    }
}

module.exports = {
    request,
    cmd,
    curl,
    Rocket,
    TestCase,
};
