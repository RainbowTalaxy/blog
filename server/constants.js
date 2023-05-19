const path = require('path');

const PORT = 4000;

/** 本地开发 URL */
const LOCAL_SERVER_URL = `http://localhost:${PORT}`;

/** 服务端地址 */
const SERVER_URL = 'https://blog.talaxy.cn';

/** 暂存目录名 */
const TEMP_DIR_NAME = 'temp';
/** 暂存文件夹 */
const TEMP_DIR = path.join(__dirname, '..', TEMP_DIR_NAME);

/** 静态文件目录名 */
const STATIC_DIR_NAME = 'statics';
/** 静态文件 URL */
const STATIC_URL = [SERVER_URL, STATIC_DIR_NAME].join('/');

/** 服务端静态文件目录 */
const SERVER_STATIC_DIR = path.join('/home', 'ubuntu', STATIC_DIR_NAME);
/** 本地开发静态文件目录 */
const DEV_STATIC_DIR = path.join(__dirname, '..', 'static');
/** 静态文件目录 */
const STATIC_DIR =
    process.env.NODE_ENV === 'production' ? SERVER_STATIC_DIR : DEV_STATIC_DIR;

/** 书籍目录 */
const BOOKS_DIR = path.join(TEMP_DIR_NAME, 'books');

module.exports = {
    PORT,
    LOCAL_SERVER_URL,
    TEMP_DIR,
    BOOKS_DIR,
    SERVER_URL,
    STATIC_URL,
    STATIC_DIR,
};
