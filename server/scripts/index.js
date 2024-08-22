const user = require('./user');
const luoye = require('./luoye');
const migratePlaylistData = require('./playlist-data-migrate');

async function main() {
    await user();
    await luoye();
    await migratePlaylistData();
}

main();
