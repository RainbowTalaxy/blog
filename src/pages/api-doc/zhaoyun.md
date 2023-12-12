# 赵云杯

## 数据结构

```ts
// 枚举类型
type Player = string;
type Hero = string;
type MatchMode = string;
type GameMap = string;
```

```ts
interface Team {
    players: Player[];
    wolf?: {
        real: Player;
        fake: Player;
    };
}
```

```ts
interface Round {
    map: GameMap;
    scoreA: number;
    scoreB: number;
    ban: Hero[];
    wolf?: {
        voteA: Player;
        voteB: Player;
    };
}
```

```ts
interface Match {
    mode: MatchMode;
    teamA: Team;
    teamB: Team;
    rounds: Round[];
}
```

```ts
interface MatchDay {
    id: string;
    date: number;
    description: string;
    matches: Match[];
    createdAt: number;
    updatedAt: number;
    removed: boolean;
    creator: string;
    updater: string;
}
```

```ts
interface Statistics {
    updatedAt: number;
    matchDays: Array<{
        id: string;
        date: number;
        description: string;
        matches: Match[];
    }>;
}
```

## 接口

### `GET` 获取比赛所有信息

`/statistics`

**响应**

```ts
type Response = Statistics;
```

### `GET` 获取比赛日信息

`/match-day/:id`

**响应**

```ts
type Response = MatchDay;
```

### `POST` 创建比赛日

`/match-day`

**参数**

```ts
interface Body {
    date: number;
    description: string;
    matches: Match[];
}
```

**响应**

```ts
type Response = MatchDay;
```

### `PUT` 更新比赛日

`/match-day/:id`

**参数**

```ts
interface Body {
    date: number;
    description: string;
    matches: Match[];
}
```

**响应**

```ts
type Response = MatchDay;
```

### `DELETE` 删除比赛日

`/match-day/:id`

**响应**

```ts
interface Response {
    success: boolean;
}
```
