# Playlist

## 数据类型

### Song

```ts
interface Song {
    id: string;
    name: string;
    artist: string;
    album: string;
    duration: number; // 单位：毫秒
    albumImgUrl: string | null;
    tinyAlbumImgUrl: string | null;
    audios: Array<{
        label: string;
        url: string;
    }>;
    lyrics: object[];
    background: string | object | null;
    updatedAt: number;
}
```

### PlaylistSongItem

```ts
interface PlaylistSongItem {
    id: string;
    name: string;
    artist: string;
    album: string;
    duration: number; // 单位：毫秒
    tinyAlbumImgUrl: string | null;
    featured: boolean;
}
```

### Playlist

```ts
interface Playlist {
    id: string;
    name: string;
    description: string;
    creator: string;
    category: string | null;
    coverImgUrl: string | null;
    tinyCoverImgUrl: string | null;
    releaseDate: number;
    songs: PlaylistSongItem[];
    duration: number; // 单位：毫秒
    updatedAt: number;
}
```

## 接口

### `GET` 获取所有播放列表

`/library`

**响应**

```ts
type Response = {
    playlists: Array<{
        id: string;
        name: string;
        category: string | null;
        tinyCoverImgUrl: string | null;
    }>;
    updatedAt: number;
};
```

### `GET` 获取播放列表详情

`/:playlistId`

**响应**

```ts
type Response = Playlist;
```

### `POST` 创建播放列表

`/`

**参数**

```ts
interface Body {
    name: string;
    description?: string;
    category?: string | null;
    coverImgUrl?: string | null;
    tinyCoverImgUrl?: string | null;
    releaseDate?: number;
}
```

**响应**

```ts
type Response = Playlist;
```

### `PUT` 更新播放列表

`/:playlistId`

**参数**

```ts
interface Body {
    name?: string;
    description?: string;
    category?: string | null;
    coverImgUrl?: string | null;
    tinyCoverImgUrl?: string | null;
    releaseDate?: number;
}
```

**响应**

```ts
type Response = Playlist;
```

### `DELETE` 删除播放列表

`/:playlistId`

**响应**

```ts
type Response = Playlist;
```

### `GET` 获取曲库

`/songs`

**响应**

```ts
type Response = {
    songs: Array<{
        id: string;
        name: string;
        artist: string;
        album: string;
        duration: number; // 单位：毫秒
        tinyAlbumImgUrl: string | null;
    }>;
    updatedAt: number;
};
```

### `GET` 获取歌曲详情

`/song/:songId`

**响应**

```ts
type Response = Song;
```

### `POST` 创建歌曲

`/song`

**参数**

```ts
interface Body {
    name: string;
    artist?: string;
    album?: string;
    duration?: number;
    albumImgUrl?: string | null;
    tinyAlbumImgUrl?: string | null;
}
```

**响应**

```ts
type Response = Song;
```

### `PUT` 更新歌曲

`/song/:songId`

**参数**

```ts
interface Body {
    name?: string;
    artist?: string;
    album?: string;
    duration?: number;
    albumImgUrl?: string | null;
    tinyAlbumImgUrl?: string | null;
}
```

**响应**

```ts
type Response = Song;
```

### `DELETE` 删除歌曲

`/song/:songId`

**响应**

```ts
type Response = Song;
```
