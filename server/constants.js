const path = require('path');

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
        books: path.join('/home', 'ubuntu', 'storage', 'books'),
    },
};

const LOCAL_DIR = {
    temp: TEMP_DIR,
    static: path.join(__dirname, '..', 'static'),
    storage: {
        books: path.join(TEMP_DIR, 'books'),
    },
};

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
};
