import { Config, Playlist, PlaylistLibrary, Song, SongLibrary } from './model';

declare const Controller: {
    library: {
        content: PlaylistLibrary;
        addPlaylist: (playlist: Playlist) => void;
        updatePlaylist: (playlist: Playlist) => void;
        removePlaylist: (playlistId: string) => void;
    };
    playlist: {
        add(
            props: {
                name: string;
                description?: string;
                creator: string;
                category?: string;
                coverImgUrl?: string;
                tinyCoverImgUrl?: string;
                releaseDate?: number;
            },
            userId: string,
        ): Playlist;
        ctr(id: string): null | {
            content: Playlist;
            update(props: {
                name?: string;
                description?: string;
                category?: string;
                coverImgUrl?: string;
                tinyCoverImgUrl?: string;
                releaseDate?: number;
            }): Playlist;
            remove(): Playlist;
            addSongs(songIds: string[]): Playlist;
            updateSong(song: Song): Playlist;
            updateSongAttrs(
                songId: string,
                attrs: {
                    featured?: boolean;
                },
            ): Playlist;
            removeSongs(songIds: string[]): Playlist;
            orderSongs(songIds: string[]): Playlist;
        };
    };
    songLibrary: {
        content: SongLibrary;
        addSong: (song: Song) => void;
        updateSong: (song: Song) => void;
        removeSong: (songId: string) => void;
    };
    song: {
        add: (props: {
            name: string;
            artist?: string;
            album?: string;
            duration?: number;
            albumImgUrl?: string | null;
            tinyAlbumImgUrl?: string | null;
        }) => Song;
        ctr(id: string): null | {
            content: Song;
            update(props: {
                name?: string;
                artist?: string;
                album?: string;
                duration?: number;
                albumImgUrl?: string | null;
                tinyAlbumImgUrl?: string | null;
            }): Song;
            remove(): Song;
            addPlaylist(playlistId: string): Song;
            removePlaylist(playlistId: string): Song;
        };
    };
    config: {
        content: Config;
        update(props: { resourcePrefix?: string }): Config;
    };
};

export = Controller;
