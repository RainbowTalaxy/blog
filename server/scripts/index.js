const user = require('./user');
const luoye = require('./luoye');

async function main() {
    await user();
    await luoye();
}

main();
