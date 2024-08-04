const { default: axios } = require('axios');
const { Server } = require('../config');

class Rocket {
    constructor(baseUrl = Server) {
        this.baseUrl = baseUrl;
    }

    async get(url, params) {
        const { data } = await axios.get(this.baseUrl + url, {
            params,
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async negGet(url, params) {
        const { data } = await axios.get(this.baseUrl + url, {
            params,
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) return null;
        throw new Error('Expect "error"');
    }

    async post(url, body) {
        const { data } = await axios.post(this.baseUrl + url, body, {
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async negPost(url, body) {
        const { data } = await axios.post(this.baseUrl + url, body, {
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) return null;
        throw new Error('Expect "error"');
    }

    async put(url, body) {
        const { data } = await axios.put(this.baseUrl + url, body, {
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async negPut(url, body) {
        const { data } = await axios.put(this.baseUrl + url, body, {
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) return null;
        throw new Error('Expect "error"');
    }

    async delete(url, params) {
        const { data } = await axios.delete(this.baseUrl + url, {
            params,
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async negDelete(url, params) {
        const { data } = await axios.delete(this.baseUrl + url, {
            params,
            headers: {
                Cookie: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) return null;
        throw new Error('Expect "error"');
    }

    async login(id, password) {
        const { data } = await axios.post(
            Server + '/user/login',
            {
                id,
                password,
            },
            {
                validateStatus: () => true,
            },
        );
        if (data.error) throw new Error(data.error);
        this.id = id;
        this.token = data.token;
        // console.log('🐰', 'Login:', id);
    }
}

class TestCase {
    constructor(name, silent = false) {
        this.name = `[${name}]`;
        this.statistics = {
            success: 0,
            failure: 0,
        };
        if (!silent) console.log('🐰', this.name);
    }

    async pos(title, task) {
        try {
            const result = await task();
            // console.log('🔆', this.name, title);
            this.statistics.success += 1;
            return result;
        } catch (e) {
            console.log('❗️', this.name, title);
            console.error('\tERROR:', e.message);
            this.statistics.failure += 1;
        }
    }

    async neg(title, task) {
        try {
            await task();
            console.log('❗️', this.name, title);
            console.error('\tERROR:', 'Expect "error"');
            this.statistics.failure += 1;
        } catch (e) {
            // console.log('🔆', this.name, title, `(error: ${e.message})`);
            this.statistics.success += 1;
        }
    }

    stat() {
        console.log(
            this.statistics.failure === 0 ? '🔆' : '❗️',
            `success: ${this.statistics.success}, failure: ${this.statistics.failure}`,
        );
        return this;
    }

    merge(testCase) {
        this.statistics.success += testCase.statistics.success;
        this.statistics.failure += testCase.statistics.failure;
    }
}

module.exports = {
    Rocket,
    TestCase,
};
