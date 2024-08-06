const PropList = {
    library: ['playlists', 'updatedAt'],
    playlist: [
        'id',
        'name',
        'description',
        'creator',
        'category',
        'coverImgUrl',
        'tinyCoverImgUrl',
        'releaseDate',
        'songs',
        'duration',
        'updatedAt',
    ],
    playlistItem: ['id', 'name', 'category', 'tinyCoverImgUrl'],
    songLibrary: ['songs', 'updatedAt'],
    song: [
        'id',
        'name',
        'artist',
        'album',
        'duration',
        'albumImgUrl',
        'tinyAlbumImgUrl',
        'audios',
        'lyrics',
        'background',
        'updatedAt',
    ],
};

module.exports = PropList;
