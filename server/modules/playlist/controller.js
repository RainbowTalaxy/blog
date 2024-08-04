// @ts-check

const { Dir } = require('../../config');
const { uuid } = require('../../utils');
const File = require('../../utils/file');
const ModelHandler = require('../../utils/model');

const PlaylistDir = Dir.storage.playlist;

/** @type {import('./controller')} */
const Controller = {
    library: {
        get content() {
            return File.readJSON(PlaylistDir.library);
        },
        set content(value) {
            File.writeJSON(PlaylistDir.library, value);
        },
        addPlaylist(playlist) {
            const library = this.content;
            library.playlists.push({
                id: playlist.id,
                name: playlist.name,
                tinyCoverImgUrl: playlist.tinyCoverImgUrl,
                category: playlist.category,
            });
            library.updatedAt = Date.now();
            this.content = library;
        },
        updatePlaylist(playlist) {
            const library = this.content;
            const index = library.playlists.findIndex(
                (item) => item.id === playlist.id,
            );
            if (index === -1) return;
            const model = new ModelHandler(playlist);
            const hasFieldUpdated = model.update(playlist, [
                'name',
                'tinyCoverImgUrl',
                'category',
            ]);
            if (!hasFieldUpdated) return;
            library.updatedAt = Date.now();
            this.content = library;
        },
        removePlaylist(id) {
            const library = this.content;
            const index = library.playlists.findIndex((item) => item.id === id);
            if (index === -1) return;
            library.playlists.splice(index, 1);
            library.updatedAt = Date.now();
            this.content = library;
        },
    },
    playlist: {
        add(props) {
            if (!props) throw Error('Playlist props are required');
            if (props.name === undefined)
                throw Error('Playlist name is required');
            if (!props.creator) throw Error('Playlist creator is required');
            const now = Date.now();
            const playlist = {
                id: uuid(),
                name: props.name,
                description: props.description ?? '',
                creator: props.creator,
                category: props.category ?? null,
                coverImgUrl: props.coverImgUrl ?? null,
                tinyCoverImgUrl: props.tinyCoverImgUrl ?? null,
                songs: [],
                duration: 0,
                releaseDate: props.releaseDate ?? now,
                updatedAt: now,
            };
            Controller.library.addPlaylist(playlist);
            File.writeJSON(
                File.join(PlaylistDir.playlist, `${playlist.id}.json`),
                playlist,
            );
            return playlist;
        },
        ctr: (id) => {
            if (!id) throw Error('Playlist ID is required');
            const filePath = File.join(PlaylistDir.playlist, `${id}.json`);
            if (!File.exists(filePath)) return null;
            return {
                get content() {
                    return File.readJSON(filePath);
                },
                set content(value) {
                    File.writeJSON(filePath, value);
                    Controller.library.updatePlaylist(value);
                },
                update(props) {
                    if (!props) throw Error('Playlist props are required');
                    const handler = new ModelHandler(this.content);
                    const hasFieldUpdated = handler.update(props, [
                        'name',
                        'description',
                        'coverImgUrl',
                        'tinyCoverImgUrl',
                        'category',
                        'releaseDate',
                    ]);
                    if (!hasFieldUpdated) return handler.model;
                    handler.model.updatedAt = Date.now();
                    this.content = handler.model;
                    return handler.model;
                },
                remove() {
                    const playlist = this.content;
                    Controller.library.removePlaylist(playlist.id);
                    File.delete(filePath);
                    return playlist;
                },
            };
        },
    },
};

module.exports = Controller;
