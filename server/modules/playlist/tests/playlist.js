const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Playlist - playlist', true);

    const baseUrl = Server + '/playlist';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');
    const visitor = new Rocket(Server + '/playlist');

    // ## GET /playlist/library

    // 获取播放列表库
    await testCase.pos('get playlist library', async () => {
        const library = await talaxy.get('/library');
        Assert.props(library, PropList.library);
        Assert.array(library.playlists, 0);
    });

    // 获取播放列表库 - 游客
    await testCase.pos('get playlist - no admin', async () => {
        await visitor.get('/library');
    });

    // ## POST /playlist

    // 创建播放列表
    const testPlaylist = await testCase.pos('create playlist', async () => {
        const data = {
            name: '2024长途电台（feat. DT）',
            description:
                '循此苦旅，以达天际。\n谢谢你陶喆，2024的伤痛由你而解。',
            category: '2024',
            coverImgUrl: 'https://some.png.com/2024.png',
            tinyCoverImgUrl: 'https://some.png.com/2024_tiny.png',
            releaseDate: '2024-01-01',
        };
        const playlist = await talaxy.post('/', data);
        Assert.props(playlist, PropList.playlist);
        Assert.expect(playlist.name, data.name);
        Assert.expect(playlist.description, data.description);
        Assert.expect(playlist.category, data.category);
        Assert.expect(playlist.coverImgUrl, data.coverImgUrl);
        Assert.expect(playlist.tinyCoverImgUrl, data.tinyCoverImgUrl);
        Assert.expect(playlist.releaseDate, data.releaseDate);
        Assert.expect(playlist.creator, talaxy.id);
        Assert.array(playlist.songs, 0);
        return playlist;
    });

    // 创建播放列表 - 缺少名称
    await testCase.neg('create playlist - require name', async () => {
        await talaxy.post('/', {});
    });

    // 创建播放列表 - 游客
    await testCase.neg('create playlist - no admin', async () => {
        await visitor.post('/', {
            name: 'test',
        });
    });

    // ## GET /playlist/:playlistId

    // 获取播放列表
    await testCase.pos('get playlist', async () => {
        const playlist = await talaxy.get(`/${testPlaylist.id}`);
        Assert.props(playlist, PropList.playlist);
        Assert.expect(playlist.id, testPlaylist.id);
        Assert.expect(playlist.name, testPlaylist.name);
        Assert.expect(playlist.description, testPlaylist.description);
        Assert.expect(playlist.category, testPlaylist.category);
        Assert.expect(playlist.coverImgUrl, testPlaylist.coverImgUrl);
        Assert.expect(playlist.tinyCoverImgUrl, testPlaylist.tinyCoverImgUrl);
        Assert.expect(playlist.releaseDate, testPlaylist.releaseDate);
        Assert.expect(playlist.creator, testPlaylist.creator);
        Assert.array(playlist.songs, 0);
    });

    // 获取播放列表 - 不存在
    await testCase.neg('get playlist - not exist', async () => {
        await talaxy.get('/not-exist');
    });

    // 获取播放列表 - 游客
    await testCase.pos('get playlist - no admin', async () => {
        await visitor.get(`/${testPlaylist.id}`);
    });

    // ## PUT /playlist/:playlistId

    // 更新播放列表
    await testCase.pos('update playlist', async () => {
        const data = {
            id: testPlaylist.id,
            name: '2023长途电台（feat. DT）',
            description:
                '循此苦旅，以达天际。\n谢谢你陶喆，2023的伤痛由你而解。',
            category: '2023',
            coverImgUrl: 'https://some.png.com/2023.png',
            tinyCoverImgUrl: 'https://some.png.com/2023_tiny.png',
            releaseDate: '2023-01-01',
        };

        const playlist = await talaxy.put(`/${testPlaylist.id}`, data);
        Assert.props(playlist, PropList.playlist);
        Assert.expect(playlist.id, testPlaylist.id);
        Assert.expect(playlist.name, data.name);
        Assert.expect(playlist.description, data.description);
        Assert.expect(playlist.category, data.category);
        Assert.expect(playlist.coverImgUrl, data.coverImgUrl);
        Assert.expect(playlist.tinyCoverImgUrl, data.tinyCoverImgUrl);
        Assert.expect(playlist.releaseDate, data.releaseDate);
        Assert.expect(playlist.creator, talaxy.id);
        Assert.array(playlist.songs, 0);

        const updatedPlaylist = await talaxy.get(`/${testPlaylist.id}`);
        Assert.expect(updatedPlaylist.name, data.name);
        Assert.expect(updatedPlaylist.description, data.description);
        Assert.expect(updatedPlaylist.category, data.category);
        Assert.expect(updatedPlaylist.coverImgUrl, data.coverImgUrl);
        Assert.expect(updatedPlaylist.tinyCoverImgUrl, data.tinyCoverImgUrl);
        Assert.expect(updatedPlaylist.releaseDate, data.releaseDate);

        const library = await talaxy.get('/library');
        Assert.array(library.playlists, 1);
        Assert.expect(library.playlists[0].id, testPlaylist.id);
        Assert.expect(library.playlists[0].name, data.name);
        Assert.expect(library.playlists[0].category, data.category);
        Assert.expect(
            library.playlists[0].tinyCoverImgUrl,
            data.tinyCoverImgUrl,
        );
    });

    // 更新播放列表 - 不存在
    await testCase.neg('update playlist - not exist', async () => {
        await talaxy.put('/not-exist', {});
    });

    // 更新播放列表 - 游客
    await testCase.neg('update playlist - no admin', async () => {
        await visitor.put(`/${testPlaylist.id}`, {});
    });

    // ## DELETE /playlist/:playlistId

    // 删除播放列表 - 游客
    await testCase.neg('delete playlist - no admin', async () => {
        await visitor.delete(`/${testPlaylist.id}`);
    });

    // 删除播放列表
    await testCase.pos('delete playlist', async () => {
        await talaxy.delete(`/${testPlaylist.id}`);
    });

    // 删除播放列表 - 不存在
    await testCase.neg('delete playlist - not exist', async () => {
        await talaxy.delete('/not-exist');
    });

    return testCase;
}

module.exports = test;
