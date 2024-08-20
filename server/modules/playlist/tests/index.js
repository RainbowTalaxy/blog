const playlist = require('./playlist');
const song = require('./song');
const playlistSong = require('./playlist-song');
const config = require('./config');
const { TestCase } = require('../../../utils/test');

async function test() {
    try {
        const testCase = new TestCase('Playlist');

        testCase.merge(await playlist());

        testCase.merge(await song());

        testCase.merge(await playlistSong());

        testCase.merge(await config());

        return testCase.stat();
    } catch (error) {
        console.log(error);
    }
}

module.exports = test;
