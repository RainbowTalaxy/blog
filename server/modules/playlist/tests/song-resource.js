const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Playlist - song resource', true);

    const baseUrl = Server + '/playlist';
    const talaxy = new Rocket(baseUrl);
    await talaxy.login('talaxy', 'talaxy');
    const visitor = new Rocket(Server + '/playlist');

    // ## POST /playlist/:songId/resource

    // 添加歌曲资源
    await testCase.pos('song add resource', async () => {
        const song = await talaxy.post('/song', {
            name: 'Chill Kill',
            artist: 'Red Velvet',
        });
        const data = {
            label: 'HD',
            path: 'https://some.mp3.com/chill.mp3',
        };
        const updatedSong = await talaxy.post(
            `/song/${song.id}/resource`,
            data,
        );
        const resource = updatedSong.resources[0];
        Assert.props(resource, PropList.songResource);
        Assert.expect(resource.label, data.label);
        Assert.expect(resource.path, data.path);
    });

    // 添加歌曲资源 - 重复 label
    await testCase.neg('song add resource - duplicate label', async () => {
        const song = await talaxy.post('/song', {
            name: 'Chill Kill',
            artist: 'Red Velvet',
        });
        const data = {
            label: 'HD',
            path: 'https://some.mp3.com/chill.mp3',
        };
        await talaxy.post(`/song/${song.id}/resource`, data);
        await talaxy.post(`/song/${song.id}/resource`, data);
    });

    // 添加歌曲资源 - 中文 label
    await testCase.pos('song add resource - chinese label', async () => {
        const song = await talaxy.post('/song', {
            name: 'Chill Kill',
            artist: 'Red Velvet',
        });
        const data = {
            label: '高清',
            path: 'https://some.mp3.com/chill.mp3',
        };
        const updatedSong = await talaxy.post(
            `/song/${song.id}/resource`,
            data,
        );
        const resource = updatedSong.resources[0];
        Assert.props(resource, PropList.songResource);
        Assert.expect(resource.label, data.label);
        Assert.expect(resource.path, data.path);
    });

    // 添加歌曲资源 - 空 label
    await testCase.neg('song add resource - empty data', async () => {
        const song = await talaxy.post('/song', {
            name: 'Chill Kill',
            artist: 'Red Velvet',
        });
        await talaxy.post(`/song/${song.id}/resource`, {
            label: 'HD',
        });
    });

    // 添加歌曲资源 - 空 path
    await testCase.neg('song add resource - empty path', async () => {
        const song = await talaxy.post('/song', {
            name: 'Chill Kill',
            artist: 'Red Velvet',
        });
        await talaxy.post(`/song/${song.id}/resource`, {
            path: 'https://some.mp3.com/chill.mp3',
        });
    });

    // 添加歌曲资源 - 不存在的歌曲
    await testCase.neg('song add resource - song not exist', async () => {
        await talaxy.post(`/song/123/resource`, {
            label: 'HD',
            path: 'https://some.mp3.com/chill.mp3',
        });
    });

    // 添加歌曲资源 - 游客
    await testCase.neg('song add resource - visitor', async () => {
        const song = await talaxy.post('/song', {
            name: 'Chill Kill',
            artist: 'Red Velvet',
        });
        await visitor.post(`/song/${song.id}/resource`, {
            label: 'HD',
            path: 'https://some.mp3.com/chill.mp3',
        });
    });

    // ## PUT /playlist/:songId/resource/:label

    const testSong = await talaxy.post('/song', {
        name: 'Chill Kill',
        artist: 'Red Velvet',
    });
    const testResource = {
        label: '高清',
        path: 'https://some.mp3.com/chill.mp3',
    };
    await talaxy.post(`/song/${testSong.id}/resource`, testResource);

    const compareResource = (resource1, resource2) => {
        Assert.expect(resource1.label, resource2.label);
        Assert.expect(resource1.path, resource2.path);
    };

    // 更新歌曲资源
    await testCase.pos('song update resource', async () => {
        const data = {
            path: 'https://some.mp3.com/chill_2.mp3',
        };
        await talaxy.put(
            `/song/${testSong.id}/resource/${testResource.label}`,
            data,
        );
        const updatedSong = await talaxy.get(`/song/${testSong.id}`);
        compareResource(updatedSong.resources[0], {
            ...testResource,
            ...data,
        });
    });

    // 更新歌曲资源 - 不存在的歌曲
    await testCase.neg('song update resource - song not exist', async () => {
        await talaxy.put(
            `/song/123/resource/${testResource.label}`,
            testResource,
        );
    });

    // 更新歌曲资源 - 不存在的资源
    await testCase.neg(
        'song update resource - resource not exist',
        async () => {
            await talaxy.put(`/song/${testSong.id}/resource/123`, testResource);
        },
    );

    // 更新歌曲资源 - 游客
    await testCase.neg('song update resource - visitor', async () => {
        await visitor.put(
            `/song/${testSong.id}/resource/${testResource.label}`,
            testResource,
        );
    });

    // ## DELETE /playlist/:songId/resource/:label

    // 删除歌曲资源 - 游客
    await testCase.neg('song delete resource - visitor', async () => {
        await visitor.delete(
            `/song/${testSong.id}/resource/${testResource.label}`,
        );
    });

    // 删除歌曲资源 - 不存在的歌曲
    await testCase.neg('song delete resource - song not exist', async () => {
        await talaxy.delete(`/song/123/resource/${testResource.label}`);
    });

    // 删除歌曲资源 - 不存在的资源
    await testCase.neg(
        'song delete resource - resource not exist',
        async () => {
            await talaxy.delete(`/song/${testSong.id}/resource/123`);
        },
    );

    // 删除歌曲资源
    await testCase.pos('song delete resource', async () => {
        await talaxy.delete(
            `/song/${testSong.id}/resource/${testResource.label}`,
        );
        const updatedSong = await talaxy.get(`/song/${testSong.id}`);
        Assert.expect(updatedSong.resources.length, 0);
    });

    return testCase;
}

module.exports = test;
