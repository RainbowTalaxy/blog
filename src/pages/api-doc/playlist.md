# Playlist

## 数据类型

### Song

```ts
interface Song {
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
```

### SongItem

```ts
interface SongItem {
    id: string;
    name: string;
    author: string;
    album: string;
    tinyAlbumImgUrl: string;
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
    songs: SongItem[];
    duration: number;
    updatedAt: number;
}
```

### PlaylistItem

```ts
interface PlaylistItem {
    id: string;
    name: string;
    category: string | null;
    tinyCoverImgUrl: string | null;
}
```

## 接口

### `GET` 获取所有播放列表

`/library`

**响应**

```ts
type Response = {
    playlists: PlaylistItem[];
    updatedAt: number;
};
```

### `GET` 获取播放列表详情

`/:id`

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

`/:id`

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

`/:id`

**响应**

```ts
type Response = Playlist;
```
