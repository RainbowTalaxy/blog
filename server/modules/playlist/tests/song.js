const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Playlist - song', true);

    const baseUrl = Server + '/playlist';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');
    const visitor = new Rocket(Server + '/playlist');

    // ## GET /playlist/library

    // 获取歌曲库
    await testCase.pos('get song library', async () => {
        const library = await talaxy.get('/songs');
        Assert.props(library, PropList.songLibrary);
        Assert.array(library.songs, 0);
    });

    // 获取歌曲库 - 游客
    await testCase.neg('get song library - visitor', async () => {
        await visitor.get('/songs');
    });

    // ## POST /playlist/song

    // 创建歌曲
    const testSong = await testCase.pos('create song', async () => {
        const data = {
            name: 'Runaway',
            artist: '陶喆',
            album: '乐之路',
            duration: 25600,
            albumImgUrl: 'https://some.png.com/tao.png',
            tinyAlbumImgUrl: 'https://some.png.com/tao_tiny.png',
        };
        const song = await talaxy.post('/song', data);
        Assert.props(song, PropList.song);
        Assert.expect(song.name, data.name);
        Assert.expect(song.artist, data.artist);
        Assert.expect(song.album, data.album);
        Assert.expect(song.duration, data.duration);
        Assert.expect(song.albumImgUrl, data.albumImgUrl);
        Assert.expect(song.tinyAlbumImgUrl, data.tinyAlbumImgUrl);
        Assert.array(song.audios, 0);
        Assert.array(song.lyrics, 0);
        Assert.expect(song.background, null);
        return song;
    });

    // 创建歌曲 - 可选参数
    const testSong2 = await testCase.pos(
        'create song - optional parma',
        async () => {
            const data = {
                name: 'Runaway',
                artist: '陶喆',
            };
            const song = await talaxy.post('/song', data);
            Assert.props(song, PropList.song);
            Assert.expect(song.name, data.name);
            Assert.expect(song.artist, data.artist);
            Assert.expect(song.album, '');
            Assert.expect(song.duration, 0);
            Assert.expect(song.albumImgUrl, null);
            Assert.expect(song.tinyAlbumImgUrl, null);
            return song;
        },
    );

    // 创建歌曲 - 缺少名称
    await testCase.neg('create song - require name', async () => {
        await talaxy.post('/song', {});
    });

    // 创建歌曲 - 游客
    await testCase.neg('create song - visitor', async () => {
        await visitor.post('/song', {
            name: 'test',
        });
    });

    // ## GET /playlist/song/:songId

    const compareSong = (song1, song2) => {
        Assert.expect(song1.id, song2.id);
        Assert.expect(song1.name, song2.name);
        Assert.expect(song1.artist, song2.artist);
        Assert.expect(song1.album, song2.album);
        Assert.expect(song1.duration, song2.duration);
        Assert.expect(song1.albumImgUrl, song2.albumImgUrl);
        Assert.expect(song1.tinyAlbumImgUrl, song2.tinyAlbumImgUrl);
        Assert.array(song1.audios, song2.audios.length);
        Assert.array(song1.lyrics, song2.lyrics.length);
        Assert.expect(song1.background, song2.background);
    };

    // 获取歌曲
    await testCase.pos('get song', async () => {
        const song = await talaxy.get(`/song/${testSong.id}`);
        Assert.props(song, PropList.song);
        compareSong(song, testSong);

        const song2 = await talaxy.get(`/song/${testSong2.id}`);
        Assert.props(song2, PropList.song);
    });

    // 获取歌曲 - 不存在
    await testCase.neg('get song - not exist', async () => {
        await talaxy.get('/song/not-exist');
    });

    // 获取歌曲 - 游客
    await testCase.pos('get song - visitor', async () => {
        await visitor.get(`/song/${testSong.id}`);
    });

    // ## PUT /playlist/song/:songId

    // 更新歌曲
    await testCase.pos('update song', async () => {
        const data = {
            name: "I'm OK",
            album: "I'm OK",
            albumImgUrl: 'https://some.png.com/tao_2.png',
            tinyAlbumImgUrl: 'https://some.png.com/tao_2_tiny.png',
        };
        const song = await talaxy.put(`/song/${testSong.id}`, data);
        Assert.props(song, PropList.song);
        Assert.expect(song.name, data.name);
        Assert.expect(song.album, data.album);
        Assert.expect(song.albumImgUrl, data.albumImgUrl);
        Assert.expect(song.tinyAlbumImgUrl, data.tinyAlbumImgUrl);

        const updatedSong = await talaxy.get(`/song/${testSong.id}`);
        Assert.props(updatedSong, PropList.song);
        compareSong(updatedSong, song);
        Assert.negExpect(updatedSong.updatedAt, testSong.updatedAt);
    });

    // 更新歌曲 - 不存在
    await testCase.neg('update song - not exist', async () => {
        await talaxy.put('/song/not-exist', {});
    });

    // 更新歌曲 - 游客
    await testCase.neg('update song - visitor', async () => {
        await visitor.put(`/song/${testSong.id}`, {});
    });

    // ## DELETE /playlist/song/:songId

    // 删除歌曲 - 游客
    await testCase.neg('delete song - visitor', async () => {
        await visitor.delete(`/song/${testSong.id}`);
    });

    // 删除歌曲
    await testCase.pos('delete song', async () => {
        await talaxy.delete(`/song/${testSong.id}`);
        await talaxy.delete(`/song/${testSong2.id}`);
    });

    // 删除歌曲 - 不存在
    await testCase.neg('delete song - not exist', async () => {
        await talaxy.delete('/song/not-exist');
    });

    return testCase;
}

module.exports = test;
