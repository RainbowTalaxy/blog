const { User, Dir } = require('../config');
const { writeJSON } = require('../utils');
const Version = require('../utils/version');

async function main() {
    const config = { ...User.config };
    const version = new Version(config.version);
    // migrate to 1.1.0
    if (version.isLessThan('1.1.0')) {
        config.users = config.users.map(({ id, key }) => {
            const newKey = User.encryptPassword(id, key);
            return { id, key: newKey };
        });
        config.version = '1.1.0';
    }
    writeJSON(Dir.storage.user, config);
}

module.exports = main;
