const PORT = 4000;

const LOCAL_SERVER_URL = `http://localhost:${PORT}`;
const SERVER_URL = 'https://blog.talaxy.cn';

const STATIC_URL = `${SERVER_URL}/statics`;

const TEMP_DIR = 'temp';

const BOOKS_DIR = `${TEMP_DIR}/books`;

module.exports = {
    PORT,
    LOCAL_SERVER_URL,
    TEMP_DIR,
    BOOKS_DIR,
    SERVER_URL,
    STATIC_URL,
};
