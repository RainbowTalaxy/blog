# 落页

「落页」是一个在线文档工具，支持 Markdown 语法，多人协作。

它由以下实体组成：

-   工作区 `workspace`
-   文档 `doc`

## 数据设计

### 文件结构

该项目数据使用 json 文件进行存储。在根目录下，有以下目录：

-   `workspaces` 工作区目录
    -   `{id}.json` 工作区信息 `Workspace`
-   `docs` 文档目录
    -   `{id}.json` 文档信息 `Doc`
-   `users` 用户目录
    -   `{id}` 用户目录
        -   `workspaces.json` 工作区列表 `WorkspaceItem[]`
        -   `docs.json` 文档列表 `DocItem[]`
        -   `recent-docs.json` 最近文档列表 `DocItem[]`
        -   `doc-bin` 文档回收站

### 权限管理

-   工作区
    -   管理员：读、更新、创建文档
    -   成员：读、创建文档
    -   访客：读
-   文档
    -   管理员：读、更新、删除
    -   成员：读、更新
    -   访客：读

## 数据类型

### Workspace

```ts
interface Workspace {
    id: string; // 工作区 id
    name: string; // 工作区名称
    description: string; // 工作区描述
    scope: 'private' | 'public'; // 可见范围
    creator: string; // 创建者
    admins: string[]; // 管理员列表
    members: string[]; // 成员列表
    docs: DocDir[]; // 文档列表
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
}
```

### WorkspaceItem

```ts
interface WorkspaceItem {
    id: string; // 工作区 id
    name: string; // 工作区名称
    description: string; // 工作区描述
    scope: 'private' | 'public'; // 可见范围
    joinAt: number; // 添加时间
}
```

### Doc

```ts
interface Doc {
    id: string; // 文档 id
    name: string; // 文档名称
    creator: string; // 创建者
    admins: string[]; // 管理员列表
    members: string[]; // 成员列表
    scope: 'private' | 'public'; // 可见范围
    date: number; // 所属日期
    workspaces: string[]; // 所属工作区 id
    docType: 'markdown'; // 文档类型
    content: string; // 文档内容
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
    deletedAt: number | null; // 删除时间
}
```

### DocItem

```ts
interface DocItem {
    id: string; // 文档 id
    name: string; // 文档名称
    creator: string; // 创建者
    scope: 'private' | 'public'; // 可见范围
    docType: 'markdown'; // 文档类型
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
}
```

### DocDir

```ts
interface DocDir {
    docId: string; // 文档 id
    name: string; // 文档名称
    scope: 'private' | 'public'; // 可见范围
    updatedAt: number; // 更新时间
}
```

### DocBinItem

```ts
interface DocBinItem {
    docId: string; // 文档 id
    name: string; // 文档名称
    executor: string; // 执行者
    deletedAt: number; // 删除时间
}
```

## 接口

### `GET` 获取工作区列表

`/workspaces`

**响应**

```ts
type Response = WorkspaceItem[];
```

### `PUT` 更新工作区列表

`/workspaces`

**参数**

```ts
interface Body {
    workspaceIds: WorkspaceItem[];
}
```

**响应**

```ts
type Response = WorkspaceItem[];
```

### `GET` 获取工作区信息

`/workspace/:id`

**响应**

```ts
type Response = Workspace;
```

### `POST` 创建工作区

`/workspace/:id`

**参数**

```ts
interface Body {
    name: string;
    description?: string;
    scope?: 'private' | 'public'; // 默认 `private`
}
```

**响应**

```ts
type Response = Workspace;
```

### `PUT` 更新工作区信息

`/workspace/:id`

**参数**

```ts
interface Body {
    name?: string;
    description?: string;
    scope?: 'private' | 'public';
    docs?: DocDir[];
}
```

**响应**

```ts
type Response = Workspace;
```

### `DELETE` 删除工作区

`/workspace/:id`

**响应**

```ts
interface Response = {
    success: boolean;
};
```

### `GET` 获取最近文档

`/recent-docs`

**响应**

```ts
type Response = DocItem[];
```

### `GET` 获取文档列表

`/docs`

**响应**

```ts
type Response = DocItem[];
```

### `GET` 获取文档信息

`/doc/:id`

**响应**

```ts
type Response = Doc;
```

### `POST` 创建文档

`/doc`

**参数**

```ts
interface Body {
    workspaceId: string;
    name?: string;
    date?: number;
}
```

**响应**

```ts
type Response = Doc;
```

### `PUT` 更新文档信息

`/doc/:id`

**参数**

```ts
interface Body {
    name?: string;
    content?: string;
    scope?: 'private' | 'public';
    date?: number;
}
```

**响应**

```ts
type Response = Doc;
```

### `DELETE` 删除文档

`/doc/:id`

**响应**

```ts
interface Response = {
    success: boolean;
};
```

### `GET` 获取文档回收站

`/doc-bin`

**响应**

```ts
type Response = DocBinItem[];
```
