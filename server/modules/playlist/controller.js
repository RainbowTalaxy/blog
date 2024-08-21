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
            value.updatedAt = Date.now();
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
            this.content = library;
        },
        updatePlaylist(playlist) {
            const library = this.content;
            const index = library.playlists.findIndex(
                (item) => item.id === playlist.id,
            );
            if (index === -1) return;
            const handler = new ModelHandler(library.playlists[index]);
            const hasFieldUpdated = handler.update(playlist, [
                'name',
                'tinyCoverImgUrl',
                'category',
            ]);
            if (!hasFieldUpdated) return;
            this.content = library;
        },
        removePlaylist(id) {
            const library = this.content;
            const index = library.playlists.findIndex((item) => item.id === id);
            if (index === -1) return;
            library.playlists.splice(index, 1);
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
        ctr(id) {
            if (!id) throw Error('Playlist ID is required');
            const filePath = File.join(PlaylistDir.playlist, `${id}.json`);
            if (!File.exists(filePath)) return null;
            return {
                get content() {
                    return File.readJSON(filePath);
                },
                set content(value) {
                    value.updatedAt = Date.now();
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
                    this.content = handler.model;
                    return handler.model;
                },
                remove() {
                    const playlist = this.content;
                    playlist.songs.forEach((song) => {
                        Controller.song
                            .ctr(song.id)
                            ?.removePlaylist(playlist.id);
                    });
                    Controller.library.removePlaylist(playlist.id);
                    File.delete(filePath);
                    return playlist;
                },
                addSongs(songIds) {
                    if (!songIds) throw Error('`songIds` are required');
                    const playlist = this.content;
                    const playlistSongIds = playlist.songs.map(
                        (song) => song.id,
                    );
                    songIds.forEach((songId) => {
                        if (playlistSongIds.includes(songId)) return;
                        const songCtr = Controller.song.ctr(songId);
                        if (!songCtr) return;
                        const song = songCtr.content;
                        playlist.songs.push({
                            id: song.id,
                            name: song.name,
                            artist: song.artist,
                            album: song.album,
                            duration: song.duration,
                            tinyAlbumImgUrl: song.tinyAlbumImgUrl,
                            featured: false,
                        });
                        songCtr.addPlaylist(playlist.id);
                    });
                    this.content = playlist;
                    return playlist;
                },
                updateSong(song) {
                    if (!song) throw Error('Song is required');
                    const playlist = this.content;
                    const index = playlist.songs.findIndex(
                        (item) => item.id === song.id,
                    );
                    if (index === -1) return playlist;
                    const handler = new ModelHandler(playlist.songs[index]);
                    handler.update(song, [
                        'name',
                        'artist',
                        'album',
                        'duration',
                        'tinyAlbumImgUrl',
                    ]);
                    if (!handler.hasFieldUpdated) return playlist;
                    this.content = playlist;
                    return playlist;
                },
                updateSongAttrs(songId, attrs) {
                    if (!attrs) throw Error('Song attributes are required');
                    const playlist = this.content;
                    const index = playlist.songs.findIndex(
                        (item) => item.id === songId,
                    );
                    if (index === -1) return playlist;
                    const handler = new ModelHandler(playlist.songs[index]);
                    handler.update(attrs, ['featured']);
                    if (!handler.hasFieldUpdated) return playlist;
                    this.content = playlist;
                    return playlist;
                },
                removeSongs(songIds) {
                    if (!songIds) throw Error('`songIds` are required');
                    const playlist = this.content;
                    songIds.forEach((songId) => {
                        const index = playlist.songs.findIndex(
                            (item) => item.id === songId,
                        );
                        if (index === -1) return;
                        playlist.songs.splice(index, 1);
                        Controller.song
                            .ctr(songId)
                            ?.removePlaylist(playlist.id);
                    });
                    this.content = playlist;
                    return playlist;
                },
                orderSongs(songIds) {
                    const playlist = this.content;
                    if (
                        songIds.every(
                            (id, idx) => id === playlist.songs[idx].id,
                        )
                    )
                        return playlist;
                    const orderedSongs = songIds.map((songId) => {
                        const song = playlist.songs.find(
                            (item) => item.id === songId,
                        );
                        if (!song) throw Error(`Song ID ${songId} not found`);
                        return song;
                    });
                    playlist.songs = orderedSongs;
                    this.content = playlist;
                    return playlist;
                },
            };
        },
    },
    songLibrary: {
        get content() {
            return File.readJSON(PlaylistDir.songLibrary);
        },
        set content(value) {
            value.updatedAt = Date.now();
            File.writeJSON(PlaylistDir.songLibrary, value);
        },
        addSong(song) {
            const songLibrary = this.content;
            songLibrary.songs.push({
                id: song.id,
                name: song.name,
                artist: song.artist,
                album: song.album,
                duration: song.duration,
                tinyAlbumImgUrl: song.tinyAlbumImgUrl,
            });
            this.content = songLibrary;
        },
        updateSong(song) {
            const songLibrary = this.content;
            const index = songLibrary.songs.findIndex(
                (item) => item.id === song.id,
            );
            if (index === -1) return;
            const handler = new ModelHandler(songLibrary.songs[index]);
            const hasFieldUpdated = handler.update(song, [
                'name',
                'artist',
                'album',
                'duration',
                'tinyAlbumImgUrl',
            ]);
            if (!hasFieldUpdated) return;
            this.content = songLibrary;
        },
        removeSong(id) {
            const songLibrary = this.content;
            const index = songLibrary.songs.findIndex((item) => item.id === id);
            if (index === -1) return;
            songLibrary.songs.splice(index, 1);
            this.content = songLibrary;
        },
    },
    song: {
        add(props) {
            if (!props) throw Error('Song props are required');
            const now = Date.now();
            const song = {
                id: uuid(),
                name: props.name ?? '',
                artist: props.artist ?? '',
                album: props.album ?? '',
                duration: props.duration ?? 0,
                albumImgUrl: props.albumImgUrl || null,
                tinyAlbumImgUrl: props.tinyAlbumImgUrl || null,
                playlistIds: [],
                resources: [],
                lyrics: [],
                theme: null,
                updatedAt: now,
            };
            Controller.songLibrary.addSong(song);
            File.writeJSON(
                File.join(PlaylistDir.song, `${song.id}.json`),
                song,
            );
            return song;
        },
        ctr(id) {
            if (!id) throw Error('Song ID is required');
            const filePath = File.join(PlaylistDir.song, `${id}.json`);
            if (!File.exists(filePath)) return null;
            return {
                get content() {
                    return File.readJSON(filePath);
                },
                set content(value) {
                    value.updatedAt = Date.now();
                    File.writeJSON(filePath, value);
                    Controller.songLibrary.updateSong(value);
                },
                update(props) {
                    if (!props) throw Error('Song props are required');
                    const song = this.content;
                    const handler = new ModelHandler(song);
                    const hasFieldUpdated = handler.update(props, [
                        'name',
                        'artist',
                        'album',
                        'duration',
                        'albumImgUrl',
                        'tinyAlbumImgUrl',
                    ]);
                    if (!hasFieldUpdated) return handler.model;
                    this.content = handler.model;
                    // 更新播放列表
                    song.playlistIds.forEach((playlistId) => {
                        const playlistCtr = Controller.playlist.ctr(playlistId);
                        playlistCtr?.updateSong(handler.model);
                    });
                    return handler.model;
                },
                remove() {
                    const song = this.content;
                    song.playlistIds.forEach((playlistId) => {
                        const playlistCtr = Controller.playlist.ctr(playlistId);
                        playlistCtr?.removeSongs([song.id]);
                    });
                    Controller.songLibrary.removeSong(song.id);
                    File.delete(filePath);
                    return song;
                },
                addPlaylist(playlistId) {
                    const song = this.content;
                    if (song.playlistIds.includes(playlistId)) return song;
                    song.playlistIds.push(playlistId);
                    this.content = song;
                    return song;
                },
                removePlaylist(playlistId) {
                    const song = this.content;
                    const index = song.playlistIds.indexOf(playlistId);
                    if (index === -1) return song;
                    song.playlistIds.splice(index, 1);
                    this.content = song;
                    return song;
                },
                addResource(props) {
                    if (!props) throw Error('Resource props are required');
                    const song = this.content;
                    const resource = {
                        label: props.label ?? '',
                        path: props.path ?? '',
                    };
                    song.resources.push(resource);
                    this.content = song;
                    return song;
                },
                updateResource(label, props) {
                    if (!label) throw Error('Resource label is required');
                    if (!props) throw Error('Resource props are required');
                    const song = this.content;
                    const index = song.resources.findIndex(
                        (item) => item.label === label,
                    );
                    if (index === -1) return song;
                    const handler = new ModelHandler(song.resources[index]);
                    handler.update(props, ['path']);
                    if (!handler.hasFieldUpdated) return song;
                    this.content = song;
                    return song;
                },
                removeResource(label) {
                    if (!label) throw Error('Resource label is required');
                    const song = this.content;
                    const index = song.resources.findIndex(
                        (item) => item.label === label,
                    );
                    if (index === -1) return song;
                    song.resources.splice(index, 1);
                    this.content = song;
                    return song;
                },
            };
        },
    },
    config: {
        get content() {
            return File.readJSON(PlaylistDir.config);
        },
        set content(value) {
            File.writeJSON(PlaylistDir.config, value);
        },
        update(props) {
            if (!props) throw Error('Config props are required');
            const handler = new ModelHandler(this.content);
            const hasFieldUpdated = handler.update(props, ['resourcePrefix']);
            if (!hasFieldUpdated) return handler.model;
            this.content = handler.model;
            return handler.model;
        },
    },
};

module.exports = Controller;
