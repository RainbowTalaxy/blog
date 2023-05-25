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
    },
};

const LOCAL_DIR = {
    temp: TEMP_DIR,
    static: path.join(__dirname, '..', 'static'),
    storage: {
        whitelist: path.join(__dirname, 'whitelist.json'),
        books: path.join(TEMP_DIR, 'books'),
    },
};

const APIKey = {
    file: 'fileApiKey',
};

if (process.env.NODE_ENV === 'production') {
    mkdirp.sync(SERVER_DIR.temp);
    mkdirp.sync(SERVER_DIR.static);
    mkdirp.sync(SERVER_DIR.storage.books);
    // 如果没有 whitelist.json 文件，创建一个
    if (!fs.existsSync(SERVER_DIR.storage.whitelist)) {
        fs.writeFileSync(
            SERVER_DIR.storage.whitelist,
            JSON.stringify({
                [APIKey.file]: [],
            }),
        );
    }
}

const Dir = {
    ...(process.env.NODE_ENV === 'production' ? SERVER_DIR : LOCAL_DIR),
};

const Server = LOCAL_SERVER_URL;
const Statics = `${SERVER_URL}/statics`;

module.exports = {
    PORT,
    Server,
    Statics,
    Dir,
    APIKey,
};
