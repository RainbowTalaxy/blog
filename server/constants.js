const path = require('path');

const PORT = 4000;

const LOCAL_SERVER_URL = `http://localhost:${PORT}`;

const SERVER_URL = 'https://blog.talaxy.cn';

const TEMP_DIR_NAME = 'temp';
const TEMP_DIR = path.join(__dirname, '..', TEMP_DIR_NAME);

const STATIC_DIR_NAME = 'statics';

const STATIC_URL = [SERVER_URL, STATIC_DIR_NAME].join('/');

console.log(STATIC_URL);

const SERVER_STATIC_DIR = path.join('/home', 'ubuntu', STATIC_DIR_NAME);
const DEV_STATIC_DIR = path.join(__dirname, '..', 'static');
const STATIC_DIR =
    process.env.NODE_ENV === 'production' ? SERVER_STATIC_DIR : DEV_STATIC_DIR;

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
