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
};

module.exports = PropList;
