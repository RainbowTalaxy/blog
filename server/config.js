const path = require('path');
const fs = require('fs');
const { mkdirp } = require('mkdirp');
const prettier = require('prettier');

const PORT = 4000;

/** 本地开发 URL */
const LOCAL_SERVER_URL = `http://localhost:${PORT}`;
/** 服务端地址 */
const SERVER_URL = 'https://blog.talaxy.cn';

/** 暂存文件夹 */
const TEMP_DIR = path.join(__dirname, '..', 'temp');

/** 数据文件夹 */
const STORAGE_PATH = '/home/ubuntu/storage';

const SERVER_DIR = {
    temp: TEMP_DIR,
    static: path.join('/home', 'ubuntu', 'statics'),
    storage: {
        user: path.join(STORAGE_PATH, 'user.json'),
        whitelist: path.join(STORAGE_PATH, 'whitelist.json'),
        books: path.join(STORAGE_PATH, 'books'),
        projects: path.join(STORAGE_PATH, 'projects'),
    },
};

const LOCAL_DIR = {
    temp: TEMP_DIR,
    static: path.join(__dirname, '..', 'static'),
    storage: {
        user: path.join(TEMP_DIR, 'user.json'),
        whitelist: path.join(__dirname, 'whitelist.json'),
        books: path.join(TEMP_DIR, 'books'),
        projects: path.join(TEMP_DIR, 'projects'),
    },
};

const APIKey = {
    file: 'fileApiKey',
};

const Dir = {
    ...(process.env.NODE_ENV === 'production' ? SERVER_DIR : LOCAL_DIR),
};

if (fs.existsSync(Dir.temp)) {
    fs.rmSync(Dir.temp, { recursive: true });
}

mkdirp.sync(Dir.temp);
mkdirp.sync(Dir.static);
mkdirp.sync(Dir.storage.books);
mkdirp.sync(Dir.storage.projects);

// 如果没有 whitelist.json 文件，创建一个
if (!fs.existsSync(Dir.storage.whitelist)) {
    fs.writeFileSync(
        Dir.storage.whitelist,
        JSON.stringify({
            [APIKey.file]: [],
        }),
    );
}

// 默认用户配置
const DEFAULT_USER_CONFIG = {
    version: '1.0.0',
    admin: ['talaxy'],
    users: [
        {
            id: 'talaxy',
            key: 'talaxy',
        },
    ],
};
// 如果没有 user.json 文件，创建一个
let needCreateUserConfig = false;
if (!fs.existsSync(Dir.storage.user)) {
    needCreateUserConfig = true;
} else {
    const userConfig = JSON.parse(fs.readFileSync(Dir.storage.user));
    if (userConfig.version !== DEFAULT_USER_CONFIG.version) {
        needCreateUserConfig = true;
    }
}
if (needCreateUserConfig) {
    fs.writeFileSync(
        Dir.storage.user,
        prettier.format(JSON.stringify(DEFAULT_USER_CONFIG), {
            parser: 'json',
        }),
    );
}

const User = {
    config: JSON.parse(fs.readFileSync(Dir.storage.user)),
    tokenExpireInterval: 1000 * 60 * 60 * 24,
    tokens: [],
    validate(id, key) {
        return this.config.users.some(
            (user) => user.id === id && user.key === key,
        );
    },
    isAdmin(id) {
        return this.config.admin.includes(id);
    },
    register(id, key) {
        if (id.length < 4 && key.length < 4) {
            throw new Error('id or key is too short');
        }
        const idx = this.config.users.findIndex((user) => user.id === id);
        if (idx === -1) {
            this.config.users.push({
                id,
                key,
            });
        } else {
            this.config.users[idx].key = key;
        }
        fs.writeFileSync(
            Dir.storage.user,
            prettier.format(JSON.stringify(this.config), {
                parser: 'json',
            }),
        );
    },
    digestToken(id, token) {
        this.clearOldTokens();
        const idx = this.tokens.findIndex(
            (item) => item.id === id && item.token === token,
        );
        if (idx === -1) return false;
        this.tokens.splice(idx, 1);
        return true;
    },
    clearOldTokens() {
        this.tokens = this.tokens.filter((item) => {
            return Date.now() - item.time < this.tokenExpireInterval;
        });
    },
};

const Server = LOCAL_SERVER_URL;
const Statics = `${SERVER_URL}/statics`;

module.exports = {
    PORT,
    Server,
    Statics,
    Dir,
    APIKey,
    User,
};
