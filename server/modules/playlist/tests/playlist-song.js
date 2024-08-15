const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Playlist - playlist song', true);

    const baseUrl = Server + '/playlist';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');
    const visitor = new Rocket(Server + '/playlist');

    const comparePlaylistSong = (playlistSong, song) => {
        Assert.expect(playlistSong.id, song.id);
        Assert.expect(playlistSong.name, song.name);
        Assert.expect(playlistSong.artist, song.artist);
        Assert.expect(playlistSong.album, song.album);
        Assert.expect(playlistSong.duration, song.duration);
        Assert.expect(playlistSong.tinyAlbumImgUrl, song.tinyAlbumImgUrl);
    };

    // ## POST /:playlistId/songs

    // 添加歌曲
    await testCase.pos('add song', async () => {
        const playlist = await talaxy.post('/', {
            name: '2023 年度歌单',
        });
        const song = await talaxy.post('/song', {
            name: 'Runaway',
            artist: '陶喆',
            album: '乐之路',
            duration: 25600,
            albumImgUrl: 'https://some.png.com/tao.png',
            tinyAlbumImgUrl: 'https://some.png.com/tao_tiny.png',
        });
        await talaxy.post(`/${playlist.id}/songs`, { songIds: [song.id] });
        const updatedPlaylist = await talaxy.get(`/${playlist.id}`);
        updatedPlaylist.songs.forEach((song) => {
            Assert.props(song, PropList.playlistSong);
        });
        Assert.array(updatedPlaylist.songs, 1);
        comparePlaylistSong(updatedPlaylist.songs[0], song);
        const updatedSong = await talaxy.get(`/song/${song.id}`);
        Assert.array(updatedSong.playlistIds, 1);
        Assert.expect(updatedSong.playlistIds[0], playlist.id);
    });

    // 添加多个歌曲
    const { playlist: testPlaylist, songs: testSongs } = await testCase.pos(
        'add songs',
        async () => {
            const playlist = await talaxy.post('/', {
                name: '测试歌单',
            });
            const songCount = 3;
            const songs = await Promise.all(
                Array(songCount)
                    .fill(null)
                    .map((_, index) =>
                        talaxy.post('/song', {
                            name: `歌曲${index}`,
                            artist: `艺术家${index}`,
                            album: `专辑${index}`,
                            duration: index * 1000,
                            albumImgUrl: `https://some.png.com/${index}.png`,
                            tinyAlbumImgUrl: `https://some.png.com/${index}_tiny.png`,
                        }),
                    ),
            );
            await talaxy.post(`/${playlist.id}/songs`, {
                songIds: songs.map((song) => song.id),
            });
            const updatedPlaylist = await talaxy.get(`/${playlist.id}`);
            updatedPlaylist.songs.forEach((song) => {
                Assert.props(song, PropList.playlistSong);
            });
            Assert.array(updatedPlaylist.songs, songCount);
            updatedPlaylist.songs.forEach((song, index) => {
                const targetSong = songs.find((s) => s.id === song.id);
                if (!targetSong) throw new Error('song not found');
                comparePlaylistSong(song, targetSong);
            });
            const updatedSongs = await Promise.all(
                songs.map((song) => talaxy.get(`/song/${song.id}`)),
            );
            updatedSongs.forEach((song) => {
                Assert.array(song.playlistIds, 1);
                Assert.expect(song.playlistIds[0], playlist.id);
            });
            return { playlist, songs };
        },
    );

    // 添加歌曲 - 歌曲不存在
    await testCase.pos('add song - song not exist', async () => {
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        await talaxy.post(`/${playlist.id}/songs`, { songIds: ['not-exist'] });
        const updatedPlaylist = await talaxy.get(`/${playlist.id}`);
        Assert.array(updatedPlaylist.songs, 0);
    });

    // 添加歌曲 - 播放列表不存在
    await testCase.neg('add song - playlist not exist', async () => {
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        await talaxy.post('/not-exist/songs', { songIds: [song.id] });
    });

    // 添加歌曲 - 游客
    await testCase.neg('add song - visitor', async () => {
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        await visitor.post(`/${playlist.id}/songs`, { songIds: [song.id] });
    });

    // ## DELETE /:playlistId/songs

    // 删除歌曲
    await testCase.pos('remove song', async () => {
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        await talaxy.post(`/${playlist.id}/songs`, { songIds: [song.id] });
        await talaxy.delete(`/${playlist.id}/song/${song.id}`);
        const updatedPlaylist = await talaxy.get(`/${playlist.id}`);
        Assert.array(updatedPlaylist.songs, 0);
        const updatedSong = await talaxy.get(`/song/${song.id}`);
        Assert.array(updatedSong.playlistIds, 0);
    });

    // 删除歌曲 - 歌曲不存在
    await testCase.neg('remove song - song not exist', async () => {
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        await talaxy.delete(`/${playlist.id}/songs/not-exist`);
    });

    // 删除歌曲 - 播放列表不存在
    await testCase.neg('remove song - playlist not exist', async () => {
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        await talaxy.delete(`/not-exist/songs/${song.id}`);
    });

    // 删除歌曲 - 游客
    await testCase.neg('remove song - visitor', async () => {
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        await talaxy.post(`/${playlist.id}/songs`, { songIds: [song.id] });
        await visitor.delete(`/${playlist.id}/songs/${song.id}`);
    });

    // ## PUT /:playlistId/song-order

    // 调整歌曲顺序
    await testCase.pos('reorder songs', async () => {
        const sortedSongIds = testSongs.map((song) => song.id).reverse();
        await talaxy.put(`/${testPlaylist.id}/song-order`, {
            songIds: sortedSongIds,
        });
        const updatedPlaylist = await talaxy.get(`/${testPlaylist.id}`);
        Assert.array(updatedPlaylist.songs, testSongs.length);
        updatedPlaylist.songs.forEach((song, index) => {
            Assert.expect(song.id, sortedSongIds[index]);
            comparePlaylistSong(
                song,
                testSongs.find((s) => s.id === song.id),
            );
        });
    });

    // 调整歌曲顺序 - 歌曲不存在
    await testCase.neg('reorder songs - song not exist', async () => {
        const songIds = testSongs.map((song) => song.id);
        songIds.splice(1, 0, 'not-exist');
        await talaxy.put(`/${testPlaylist.id}/song-order`, { songIds });
    });

    // 调整歌曲顺序 - 歌曲列表不完整
    await testCase.neg('reorder songs - song list incomplete', async () => {
        const songIds = testSongs.map((song) => song.id).slice(1);
        await talaxy.put(`/${testPlaylist.id}/song-order`, { songIds });
    });

    // 调整歌曲顺序 - 播放列表不存在
    await testCase.neg('reorder songs - playlist not exist', async () => {
        await talaxy.put('/not-exist/song-order', { songIds: [] });
    });

    // 调整歌曲顺序 - 游客
    await testCase.neg('reorder songs - visitor', async () => {
        await visitor.put(`/${testPlaylist.id}/song-order`, { songIds: [] });
    });

    // ## PUT /:playlistId/song/:songId/attributes

    // 更新歌曲属性
    await testCase.pos('update song attributes', async () => {
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        await talaxy.post(`/${playlist.id}/songs`, { songIds: [song.id] });
        await talaxy.put(`/${playlist.id}/song/${song.id}/attributes`, {
            featured: true,
        });
        const updatedPlaylist = await talaxy.get(`/${playlist.id}`);
        Assert.array(updatedPlaylist.songs, 1);
        const updatedSong = updatedPlaylist.songs[0];
        Assert.expect(updatedSong.featured, true);
    });

    // 更新歌曲属性 - 冗余属性
    await testCase.neg(
        'update song attributes - redundant attributes',
        async () => {
            const playlist = await talaxy.post('/', {
                name: 'test',
            });
            const song = await talaxy.post('/song', {
                name: 'test',
            });
            await talaxy.post(`/${playlist.id}/songs`, { songIds: [song.id] });
            await talaxy.put(`/${playlist.id}/song/${song.id}/attributes`, {
                name: 'new name',
                featured: 'new name',
            });
            const updatedPlaylist = await talaxy.get(`/${playlist.id}`);
            Assert.array(updatedPlaylist.songs, 1);
            const updatedSong = updatedPlaylist.songs[0];
            Assert.negExpect(updatedSong.name, 'test');
            Assert.expect(updatedSong.featured, false);
            comparePlaylistSong(updatedSong, song);
        },
    );

    // 更新歌曲属性 - 无参
    await testCase.pos('update song attributes - no attributes', async () => {
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        await talaxy.post(`/${playlist.id}/songs`, { songIds: [song.id] });
        await talaxy.put(`/${playlist.id}/song/${song.id}/attributes`, {});
        const updatedPlaylist = await talaxy.get(`/${playlist.id}`);
        comparePlaylistSong(updatedPlaylist.songs[0], song);
    });

    // 更新歌曲属性 - 歌曲不存在
    await testCase.neg('update song attributes - song not exist', async () => {
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        await talaxy.put(`/${playlist.id}/song/not-exist/attributes`, {
            featured: true,
        });
    });

    // 更新歌曲属性 - 播放列表不存在
    await testCase.neg(
        'update song attributes - playlist not exist',
        async () => {
            await talaxy.put('/not-exist/song/not-exist/attributes', {
                featured: true,
            });
        },
    );

    // 更新歌曲属性 - 游客
    await testCase.neg('update song attributes - visitor', async () => {
        const playlist = await talaxy.post('/', {
            name: 'test',
        });
        const song = await talaxy.post('/song', {
            name: 'test',
        });
        await talaxy.post(`/${playlist.id}/songs`, { songIds: [song.id] });
        await visitor.put(`/${playlist.id}/song/${song.id}/attributes`, {
            featured: true,
        });
    });

    return testCase;
}

module.exports = test;
