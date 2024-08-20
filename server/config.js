const path = require('path');
const fs = require('fs');
const { mkdirp } = require('mkdirp');
const prettier = require('prettier');
const { readJSON, writeJSONIfNotExist, uuid, writeJSON } = require('./utils');

const PORT = 4000;

/** 本地开发 URL */
const LOCAL_SERVER_URL = `http://localhost:${PORT}`;
/** 服务端地址 */
const SERVER_URL = 'https://blog.talaxy.cn';

/** 暂存文件夹 */
const TEMP_DIR = path.join(__dirname, '..', 'temp');
const DEV_DIR = path.join(__dirname, '..', 'dev');

/** 数据文件夹 */
const STORAGE_PATH = '/home/ubuntu/storage';

const SERVER_DIR = {
    temp: TEMP_DIR,
    static: path.join('/home', 'ubuntu', 'statics'),
    storage: {
        // 用户数据
        user: path.join(STORAGE_PATH, 'user.json'),
        token: path.join(STORAGE_PATH, 'token.json'),
        // 配置信息
        config: path.join(STORAGE_PATH, 'config.json'),
        // 书籍数据
        books: path.join(STORAGE_PATH, 'books'),
        // Weaver 数据
        projects: path.join(STORAGE_PATH, 'projects'),
        luoye: {
            workspaces: path.join(STORAGE_PATH, 'luoye', 'workspaces'),
            docs: path.join(STORAGE_PATH, 'luoye', 'docs'),
            users: path.join(STORAGE_PATH, 'luoye', 'users'),
        },
        playlist: {
            library: path.join(STORAGE_PATH, 'playlist', 'library.json'),
            playlist: path.join(STORAGE_PATH, 'playlist', 'playlist'),
            songLibrary: path.join(STORAGE_PATH, 'playlist', 'songs.json'),
            song: path.join(STORAGE_PATH, 'playlist', 'song'),
        },
    },
};

const LOCAL_DIR = {
    temp: TEMP_DIR,
    static: path.join(__dirname, '..', 'static'),
    storage: {
        user: path.join(DEV_DIR, 'user.json'),
        token: path.join(TEMP_DIR, 'token.json'),
        config: path.join(DEV_DIR, 'config.json'),
        books: path.join(TEMP_DIR, 'books'),
        projects: path.join(TEMP_DIR, 'projects'),
        luoye: {
            workspaces: path.join(TEMP_DIR, 'luoye', 'workspaces'),
            docs: path.join(TEMP_DIR, 'luoye', 'docs'),
            users: path.join(TEMP_DIR, 'luoye', 'users'),
        },
        playlist: {
            library: path.join(TEMP_DIR, 'playlist', 'library.json'),
            playlist: path.join(TEMP_DIR, 'playlist', 'playlist'),
            songLibrary: path.join(TEMP_DIR, 'playlist', 'songs.json'),
            song: path.join(TEMP_DIR, 'playlist', 'song'),
            config: path.join(TEMP_DIR, 'playlist', 'config.json'),
        },
    },
};

const Dir = {
    ...(process.env.NODE_ENV === 'production' ? SERVER_DIR : LOCAL_DIR),
};

// -- 初始化文件夹 --

if (process.env.TEMP_GUARD !== 'true' && fs.existsSync(Dir.temp)) {
    fs.rmSync(Dir.temp, { recursive: true });
}

mkdirp.sync(Dir.temp);
mkdirp.sync(DEV_DIR);
mkdirp.sync(Dir.static);
mkdirp.sync(Dir.storage.books);
mkdirp.sync(Dir.storage.projects);
mkdirp.sync(Dir.storage.luoye.workspaces);
mkdirp.sync(Dir.storage.luoye.docs);
mkdirp.sync(Dir.storage.luoye.users);
mkdirp.sync(Dir.storage.playlist.playlist);
mkdirp.sync(Dir.storage.playlist.song);

writeJSONIfNotExist(Dir.storage.config, {
    secret: uuid(),
});

writeJSONIfNotExist(Dir.storage.token, []);

writeJSONIfNotExist(Dir.storage.playlist.library, {
    playlists: [],
    updatedAt: Date.now(),
});

writeJSONIfNotExist(Dir.storage.playlist.songLibrary, {
    songs: [],
    updatedAt: Date.now(),
});

writeJSONIfNotExist(Dir.storage.playlist.config, {
    version: '1.0.0',
    resourcePrefix: '',
});

const encryptUserPassword = (id, password) => {
    const { secret } = readJSON(Dir.storage.config);
    const str = `${id}:${password}:${secret}`;
    return Buffer.from(str).toString('base64');
};

const NEW_VERSION = '2.0.0';
const now = Date.now();

// 默认用户配置
const DEFAULT_USER_CONFIG = {
    version: NEW_VERSION,
    admin: ['talaxy'],
    users: ['talaxy', 'allay'].map((id) => ({
        id,
        key: encryptUserPassword(id, id),
        updateTime: now,
    })),
};

writeJSONIfNotExist(Dir.storage.user, DEFAULT_USER_CONFIG);

const User = {
    version: NEW_VERSION,
    config: readJSON(Dir.storage.user),
    tokenExpireInterval: 1000 * 60 * 60 * 24,
    tokens: readJSON(Dir.storage.token),
    encryptPassword: encryptUserPassword,
    // 验证用户
    validate(id, password) {
        const key = this.encryptPassword(id, password);
        return this.config.users.find(
            (user) => user.id === id && user.key === key,
        );
    },
    find(id) {
        return this.config.users.find((user) => user.id === id);
    },
    // 是否为管理员
    isAdmin(id) {
        return this.config.admin.includes(id);
    },
    // 生成注册 token
    generateRegisterToken(id) {
        const token = {
            id,
            token: uuid(),
            time: Date.now(),
        };
        this.tokens.push(token);
        writeJSON(Dir.storage.token, this.tokens);
        return token;
    },
    // 消耗注册 token ，登记用户的前置工作
    digestRegisterToken(id, token) {
        this.clearOldRegisterTokens();
        const idx = this.tokens.findIndex(
            (item) => item.id === id && item.token === token,
        );
        if (idx === -1) return false;
        this.tokens.splice(idx, 1);
        writeJSON(Dir.storage.token, this.tokens);
        return true;
    },
    // 登记用户
    register(id, password) {
        const idx = this.config.users.findIndex((user) => user.id === id);
        const key = this.encryptPassword(id, password);
        const timestamp = Date.now();
        if (idx === -1) {
            this.config.users.push({
                id,
                key,
                updateTime: timestamp,
            });
        } else {
            this.config.users[idx].key = key;
            this.config.users[idx].updateTime = timestamp;
        }
        fs.writeFileSync(
            Dir.storage.user,
            prettier.format(JSON.stringify(this.config), {
                parser: 'json',
            }),
        );
    },
    // 清理过期 token
    clearOldRegisterTokens() {
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
    User,
};
