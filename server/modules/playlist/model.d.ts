export interface Song {
    id: string;
    name: string;
    author: string;
    album: string;
    albumImgUrl: string;
    tinyAlbumImgUrl: string;
    audios: Array<{
        label: string;
        url: string;
    }>;
    duration: number;
    updatedAt: number;
}

export type SongItem = Pick<
    Song,
    'id' | 'name' | 'author' | 'album' | 'tinyAlbumImgUrl'
>;

export interface SongLibrary {
    songs: SongItem[];
    updatedAt: number;
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    creator: string;
    category: string | null;
    coverImgUrl: string | null;
    tinyCoverImgUrl: string | null;
    releaseDate: number;
    songs: SongItem[];
    duration: number;
    updatedAt: number;
}

export type PlaylistItem = Pick<
    Playlist,
    'id' | 'name' | 'tinyCoverImgUrl' | 'category'
>;

export interface PlaylistLibrary {
    playlists: PlaylistItem[];
    updatedAt: number;
}
