const path = require('path');
const { Dir } = require('../config');
const fs = require('fs');
const { readJSON, writeJSON } = require('../utils');

async function main() {
    const moduleDir = Dir.storage.playlist;
    // 修正 `playlist` 数据
    const playlistFiles = fs
        .readdirSync(moduleDir.playlist)
        .map((file) => path.join(moduleDir.playlist, file));
    playlistFiles.forEach((file) => {
        const data = readJSON(file);
        if ('duration' in data) {
            delete data.duration;
            writeJSON(file, data);
        }
    });
    // 修正 `song` 数据
    const songFiles = fs
        .readdirSync(moduleDir.song)
        .map((file) => path.join(moduleDir.song, file));
    songFiles.forEach((file) => {
        const data = readJSON(file);
        if ('background' in data) {
            delete data.duration;
            data.theme = null;
            writeJSON(file, data);
        }
        if (!('playlistIds' in data)) {
            data.playlistIds = [];
            writeJSON(file, data);
        }
    });
}

module.exports = main;
