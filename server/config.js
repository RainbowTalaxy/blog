const path = require('path');
const fs = require('fs');
const { mkdirp } = require('mkdirp');

const PORT = 4000;

/** 本地开发 URL */
const LOCAL_SERVER_URL = `http://localhost:${PORT}`;
/** 服务端地址 */
const SERVER_URL = 'https://blog.talaxy.cn';

/** 暂存文件夹 */
const TEMP_DIR = path.join(__dirname, '..', 'temp');

const SERVER_DIR = {
    temp: TEMP_DIR,
    static: path.join('/home', 'ubuntu', 'statics'),
    storage: {
        whitelist: path.join('/home', 'ubuntu', 'storage', 'whitelist.json'),
        books: path.join('/home', 'ubuntu', 'storage', 'books'),
        projects: path.join('/home', 'ubuntu', 'storage', 'projects'),
    },
};

const LOCAL_DIR = {
    temp: TEMP_DIR,
    static: path.join(__dirname, '..', 'static'),
    storage: {
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

const Server = LOCAL_SERVER_URL;
const Statics = `${SERVER_URL}/statics`;

module.exports = {
    PORT,
    Server,
    Statics,
    Dir,
    APIKey,
};
