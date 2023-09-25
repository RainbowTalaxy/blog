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
                Authorization: `token=${this.token}`,
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
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) return null;
        throw new Error('Expect "error"');
    }

    /** @deprecated */
    async silentGet(url, params) {
        const { data } = await axios.get(this.baseUrl + url, {
            params,
            headers: {
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        return data.error ? null : data;
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

    async negPost(url, body) {
        const { data } = await axios.post(this.baseUrl + url, body, {
            headers: {
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) return null;
        throw new Error('Expect "error"');
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

    async negPut(url, body) {
        const { data } = await axios.put(this.baseUrl + url, body, {
            headers: {
                Authorization: `token=${this.token}`,
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
                Authorization: `token=${this.token}`,
            },
            validateStatus: () => true,
        });
        if (data.error) throw new Error(data.error);
        return data;
    }

    async negDelete(url, body) {
        const { data } = await axios.delete(this.baseUrl + url, body, {
            headers: {
                Authorization: `token=${this.token}`,
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
        this.token = data.token;
        console.log('🐰', 'Login:', id);
    }
}

class TestCase {
    constructor(name) {
        this.name = `[${name}]`;
        console.log(`----------------------${this.name}----------------------`);
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
    Rocket,
    TestCase,
};
