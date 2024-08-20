const { login } = require('../../middlewares');
const express = require('express');
const Controller = require('./controller');
const router = express.Router();

router.get('/config', async (req, res, next) => {
    try {
        res.send(Controller.config.content);
    } catch (error) {
        res.error = 'Failed to get config';
        res.message = '获取配置信息失败';
        next(error);
    }
});

router.put('/config', login, async (req, res, next) => {
    try {
        const updatedConfig = Controller.config.update({
            resourcePrefix: req.body.resourcePrefix,
        });
        res.send(updatedConfig);
    } catch (error) {
        res.error = 'Failed to update config';
        res.message = '更新配置信息失败';
        next(error);
    }
});

router.get('/songs', login, async (req, res, next) => {
    try {
        const songs = Controller.songLibrary.content;
        res.send(songs);
    } catch (error) {
        res.error = 'Failed to get playlist songs';
        res.message = '获取播放列表歌曲失败';
        next(error);
    }
});

router.get('/song/:songId', async (req, res, next) => {
    try {
        const { songId } = req.params;
        const songCtr = Controller.song.ctr(songId);
        if (!songCtr)
            return res.status(404).send({
                error: 'Song not found',
                message: '歌曲不存在',
            });
        res.send(songCtr.content);
    } catch (error) {
        res.error = 'Failed to get song';
        res.message = '获取歌曲失败';
        next(error);
    }
});

router.post('/song', login, async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).send({
                error: 'Song name is required',
                message: '歌曲名称不得为空',
            });
        const song = Controller.song.add({
            name,
            artist: req.body.artist,
            album: req.body.album,
            duration: req.body.duration,
            albumImgUrl: req.body.albumImgUrl,
            tinyAlbumImgUrl: req.body.tinyAlbumImgUrl,
        });
        res.send(song);
    } catch (error) {
        res.error = 'Failed to add song';
        res.message = '创建歌曲失败';
        next(error);
    }
});

router.put('/song/:songId', login, async (req, res, next) => {
    try {
        const { songId } = req.params;
        const songCtr = Controller.song.ctr(songId);
        if (!songCtr)
            return res.status(404).send({
                error: 'Song not found',
                message: '歌曲不存在',
            });
        const updatedSong = songCtr.update({
            name: req.body.name,
            artist: req.body.artist,
            album: req.body.album,
            duration: req.body.duration,
            albumImgUrl: req.body.albumImgUrl,
            tinyAlbumImgUrl: req.body.tinyAlbumImgUrl,
        });
        res.send(updatedSong);
    } catch (error) {
        res.error = 'Failed to update song';
        res.message = '更新歌曲信息失败';
        next(error);
    }
});

router.delete('/song/:songId', login, async (req, res, next) => {
    try {
        const { songId } = req.params;
        const songCtr = Controller.song.ctr(songId);
        if (!songCtr)
            return res.status(404).send({
                error: 'Song not found',
                message: '歌曲不存在',
            });
        const removedSong = songCtr.remove();
        res.send(removedSong);
    } catch (error) {
        res.error = 'Failed to delete song';
        res.message = '删除歌曲失败';
        next(error);
    }
});

router.get('/library', async (req, res, next) => {
    try {
        res.send(Controller.library.content);
    } catch (error) {
        res.error = 'Failed to get playlist library';
        res.message = '获取播放列表库失败';
        next(error);
    }
});

router.post('/', login, async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.userId;
        if (!name)
            return res.status(400).send({
                error: 'Playlist name is required',
                message: '播放列表名称不得为空',
            });
        const playlist = Controller.playlist.add({
            name,
            description: req.body.description,
            creator: userId,
            category: req.body.category,
            coverImgUrl: req.body.coverImgUrl,
            tinyCoverImgUrl: req.body.tinyCoverImgUrl,
            releaseDate: req.body.releaseDate,
        });
        return res.send(playlist);
    } catch (error) {
        res.error = 'Failed to create playlist';
        res.message = '创建播放列表失败';
        next(error);
    }
});

router.get('/:playlistId', async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const playlistCtr = Controller.playlist.ctr(playlistId);
        if (!playlistCtr)
            return res.status(404).send({
                error: 'Playlist not found',
                message: '播放列表不存在',
            });
        res.send(playlistCtr.content);
    } catch (error) {
        res.error = 'Failed to get playlist';
        res.message = '获取播放列表信息失败';
        next(error);
    }
});

router.put('/:playlistId', login, async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const playlistCtr = Controller.playlist.ctr(playlistId);
        if (!playlistCtr)
            return res.status(404).send({
                error: 'Playlist not found',
                message: '播放列表不存在',
            });
        const updatedPlaylist = playlistCtr.update({
            name: req.body.name,
            description: req.body.description,
            coverImgUrl: req.body.coverImgUrl,
            tinyCoverImgUrl: req.body.tinyCoverImgUrl,
            category: req.body.category,
            releaseDate: req.body.releaseDate,
        });
        res.send(updatedPlaylist);
    } catch (error) {
        res.error = 'Failed to update playlist';
        res.message = '更新播放列表信息失败';
        next(error);
    }
});

router.delete('/:playlistId', login, async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const playlistCtr = Controller.playlist.ctr(playlistId);
        if (!playlistCtr)
            return res.status(404).send({
                error: 'Playlist not found',
                message: '播放列表不存在',
            });
        const removedPlaylist = playlistCtr.remove();
        res.send(removedPlaylist);
    } catch (error) {
        res.error = 'Failed to delete playlist';
        res.message = '删除播放列表失败';
        next(error);
    }
});

router.post('/:playlistId/songs', login, async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const playlistCtr = Controller.playlist.ctr(playlistId);
        if (!playlistCtr)
            return res.status(404).send({
                error: 'Playlist not found',
                message: '播放列表不存在',
            });
        const { songIds } = req.body;
        if (!Array.isArray(songIds))
            return res.status(400).send({
                error: '`songIds` are invalid',
                message: '歌曲 ID 无效',
            });
        const updatedPlaylist = playlistCtr.addSongs(songIds);
        res.send(updatedPlaylist);
    } catch (error) {
        res.error = 'Failed to add songs to playlist';
        res.message = '添加歌曲到播放列表失败';
        next(error);
    }
});

router.delete('/:playlistId/song/:songId', login, async (req, res, next) => {
    try {
        const { playlistId, songId } = req.params;
        const playlistCtr = Controller.playlist.ctr(playlistId);
        if (!playlistCtr)
            return res.status(404).send({
                error: 'Playlist not found',
                message: '播放列表不存在',
            });
        const songCtr = Controller.song.ctr(songId);
        if (!songCtr)
            return res.status(404).send({
                error: 'Song not found',
                message: '歌曲不存在',
            });
        const updatedPlaylist = playlistCtr.removeSongs([songCtr.content.id]);
        res.send(updatedPlaylist);
    } catch (error) {
        res.error = 'Failed to remove songs from playlist';
        res.message = '从播放列表删除歌曲失败';
        next(error);
    }
});

router.put('/:playlistId/song-order', login, async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const playlistCtr = Controller.playlist.ctr(playlistId);
        if (!playlistCtr)
            return res.status(404).send({
                error: 'Playlist not found',
                message: '播放列表不存在',
            });
        const { songIds } = req.body;
        if (!Array.isArray(songIds))
            return res.status(400).send({
                error: '`songIds` are invalid',
                message: '歌曲 ID 无效',
            });
        const playlistSongIds = playlistCtr.content.songs.map(
            (song) => song.id,
        );
        // 检查 songIds 完整性
        if (
            songIds.slice().sort().join() !==
            playlistSongIds.slice().sort().join()
        )
            return res.status(400).send({
                error: '`songIds` are invalid',
                message: '歌曲 ID 无效',
            });
        const updatedPlaylist = playlistCtr.orderSongs(songIds);
        res.send(updatedPlaylist);
    } catch (error) {
        res.error = 'Failed to update song order';
        res.message = '更新歌曲顺序失败';
        next(error);
    }
});

router.put(
    '/:playlistId/song/:songId/attributes',
    login,
    async (req, res, next) => {
        try {
            const { playlistId, songId } = req.params;
            const playlistCtr = Controller.playlist.ctr(playlistId);
            if (!playlistCtr)
                return res.status(404).send({
                    error: 'Playlist not found',
                    message: '播放列表不存在',
                });
            const songCtr = Controller.song.ctr(songId);
            if (!songCtr)
                return res.status(404).send({
                    error: 'Song not found',
                    message: '歌曲不存在',
                });
            const updatedPlaylist = playlistCtr.updateSongAttrs(songId, {
                featured: req.body.featured,
            });
            res.send(updatedPlaylist);
        } catch (error) {
            res.error = 'Failed to update playlist attributes';
            res.message = '更新播放列表信息失败';
            next(error);
        }
    },
);

module.exports = { playlistRouter: router };
