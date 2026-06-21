# 短链服务

「短链服务」是一个 URL 缩短工具，可以将长链接转换为短链接，支持自定义短链标识和访问统计。

它由以下实体组成：

-   短链 `shortcut`

## 数据设计

### 文件结构

该项目数据使用 json 文件进行存储。在根目录下，有以下目录：

-   `shortcuts` 短链目录
    -   `list.json` 所有短链信息 `{ [id: string]: Shortcut }`

### 权限管理

-   短链
    -   管理员：创建、读、更新、删除
    -   访客：重定向访问（无需登录）

## 数据类型

### Shortcut

```ts
interface Shortcut {
    id: string; // 短链标识（哈希值或自定义）
    url: string; // 原始长链接
    isCustom: boolean; // 是否为自定义短链标识
    name?: string; // 短链名称
    createdAt: number; // 创建时间戳
    visits: number; // 访问次数
    lastVisit?: number; // 最后访问时间戳
}
```

## 接口

### `GET` 获取所有短链列表

`/list`

**响应**

```ts
type Response = Shortcut[];
```

**说明**

-   仅管理员可访问
-   返回所有短链信息数组，按创建时间倒序排列
-   包含访问统计数据

### `GET` 获取短链详情

`/info/:shortcutId`

**响应**

```ts
type Response = Shortcut;
```

**说明**

-   仅管理员可访问
-   获取指定短链的完整信息，包括访问统计
-   与重定向接口不同，此接口不会增加访问计数

### `POST` 创建短链

`/`

**参数**

```ts
interface Body {
    url: string; // 必填，原始长链接
    customId?: string; // 可选，自定义短链标识（3-20位字母/数字/下划线/中划线）
    name?: string; // 可选，短链名称
}
```

**响应**

```ts
type Response = Shortcut;
```

**说明**

-   仅管理员可以创建
-   `url` 必须是有效的 URL 格式
-   `customId` 如果未提供，系统会自动生成 6 位随机哈希值
-   `customId` 必须唯一，不能与现有短链冲突

### `GET` 访问短链（重定向）

`/:shortcutId`

**响应**

302 重定向到目标 URL

**说明**

-   无需登录，公开访问
-   访问成功后会自动增加访问计数
-   更新最后访问时间
-   如果短链不存在，返回 404

### `PUT` 更新短链

`/:shortcutId`

**参数**

```ts
interface Body {
    url?: string; // 可选，新的目标 URL
    name?: string; // 可选，新的名称
}
```

**响应**

```ts
type Response = Shortcut;
```

**说明**

-   仅管理员可以修改
-   不支持修改短链标识 `id`

### `DELETE` 删除短链

`/:shortcutId`

**响应**

```ts
interface Response {
    success: boolean;
}
```

**说明**

-   仅管理员可以删除
