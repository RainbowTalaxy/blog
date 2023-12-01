# 赵云杯

## 数据结构

```ts
interface Team {
    players: string[];
}
```

```ts
interface Round {
    map: string;
    score_a: number;
    score_b: number;
}
```

```ts
interface Match {
    team_a: Team[];
    team_b: Team[];
    rounds: Round[];
}
```

```ts
interface MatchDay {
    id: string;
    date: number;
    description: string;
    matches: Match[];
    created_at: number;
    updated_at: number;
    removed: boolean;
    creator: string;
    updater: string;
}
```

```ts
interface Statistics {
    updated_at: number;
    match_days: Array<{
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
