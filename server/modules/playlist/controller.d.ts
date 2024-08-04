import { Playlist, PlaylistLibrary } from './model';

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
        };
    };
};

export = Controller;
