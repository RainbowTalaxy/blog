const { login } = require('../../middlewares');
const express = require('express');
const Controller = require('./controller');
const router = express.Router();

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
        const userId = req.userId;
        const {
            name,
            description,
            category,
            coverImgUrl,
            tinyCoverImgUrl,
            releaseDate,
        } = req.body;
        if (!name)
            return res.status(400).send({
                error: 'Playlist name is required',
                message: '播放列表名称不得为空',
            });
        const props = {
            name,
            description,
            creator: userId,
            category,
            coverImgUrl,
            tinyCoverImgUrl,
            releaseDate,
        };
        const playlist = Controller.playlist.add(props);
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
        const props = {
            name: req.body.name,
            description: req.body.description,
            coverImgUrl: req.body.coverImgUrl,
            tinyCoverImgUrl: req.body.tinyCoverImgUrl,
            category: req.body.category,
            releaseDate: req.body.releaseDate,
        };
        const updatedPlaylist = playlistCtr.update(props);
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

module.exports = { playlistRouter: router };
