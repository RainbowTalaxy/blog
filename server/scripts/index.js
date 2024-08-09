const migrateConfigData = require('./config-data-migrate');
const migrateUserData = require('./user-data-migrate');
const migrateLuoyeData = require('./luoye-data-migrate');
const migratePlaylistData = require('./playlist-data-migrate');

async function main() {
    await migrateConfigData();
    await migrateUserData();
    await migrateLuoyeData();
    await migratePlaylistData();
}

main();
