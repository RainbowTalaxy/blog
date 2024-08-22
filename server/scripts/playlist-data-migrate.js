const path = require('path');
const { Dir } = require('../config');
const fs = require('fs');
const { readJSON, writeJSON } = require('../utils');
const File = require('../utils/file');
const Version = require('../utils/version');

async function main() {
    const moduleDir = Dir.storage.playlist;
    let config = null;

    if (File.exists(moduleDir.config)) {
        config = readJSON(moduleDir.config);
    }

    const version = config ? new Version(config.version) : null;

    // origin version: null
    // migrate to 1.0.0
    if (version === null) {
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

        const songLibrary = readJSON(moduleDir.songLibrary);

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
            if (!('duration' in data)) {
                const songInLibrary = songLibrary.songs.find(
                    (song) => song.id === data.id,
                );
                if (songInLibrary) {
                    data.duration = songInLibrary.duration;
                } else {
                    data.duration = 0;
                }
                writeJSON(file, data);
            }
        });

        config = {
            version: '1.0.0',
            resourcePrefix: '',
        };
    }

    // migrate to 1.1.0
    if (version?.isLessThan('1.1.0')) {
        // 迁移 `song` 数据
        const songFiles = fs
            .readdirSync(moduleDir.song)
            .map((file) => path.join(moduleDir.song, file));
        songFiles.forEach((file) => {
            const data = readJSON(file);
            data.resources = data.audios.map((audio) => ({
                label: audio.label,
                path: audio.url,
            }));
            delete data.audios;
            writeJSON(file, data);
        });
        config.version = '1.1.0';
    }

    writeJSON(moduleDir.config, config);
}

module.exports = main;
