const { Dir } = require('../config');
const { readJSON, writeJSON } = require('../utils');

async function main() {
    const config = readJSON(Dir.storage.config);
    // origin: `undefined`
    // migrate to 2.0.0
    if (!(version in config)) {
        config.version = '2.0.0';
        config.password_encrypt_secret = config.secret;
        delete config.secret;
        config.log_access_tokens = [];
    }
    writeJSON(Dir.storage.config, config);
}

module.exports = main;
