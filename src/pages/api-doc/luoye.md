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
    workspaces: string[]; // 所属工作区 id
    docType: 'markdown'; // 文档类型
    content: string; // 文档内容
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
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

## 接口

| Method | Path             | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/workspaces`    | 获取工作区列表 |
| POST   | `/workspace`     | 创建工作区     |
| GET    | `/workspace/:id` | 获取工作区信息 |
| PUT    | `/workspace/:id` | 更新工作区信息 |
| GET    | `/docs`          | 获取文档列表   |
| GET    | `/doc/:id`       | 获取文档信息   |
| POST   | `/doc`           | 创建文档       |
| PUT    | `/doc/:id`       | 更新文档信息   |
| DELETE | `/doc/:id`       | 删除文档       |

### `GET` 获取工作区列表

```

/workspaces

```

**响应**

```ts
type Response = WorkspaceItem[];
```

### `GET` 获取工作区信息

```
/workspace/:id
```

**响应**

```ts
type Response = Workspace;
```

### `POST` 创建工作区

```
/workspace/:id
```

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

```
/workspace/:id
```

**参数**

```ts
interface Body {
    name?: string;
    description?: string;
    scope?: 'private' | 'public';
}
```

**响应**

```ts
type Response = Workspace;
```

### `GET` 获取文档列表

```
/docs
```

**响应**

```ts
type Response = DocItem[];
```

### `GET` 获取文档信息

```
/doc/:id
```

**响应**

```ts
type Response = Doc;
```

### `POST` 创建文档

```
/doc
```

**参数**

```ts
interface Body {
    workspaceId: string;
    name?: string;
}
```

**响应**

```ts
type Response = Doc;
```

### `PUT` 更新文档信息

```
/doc/:id
```

**参数**

```ts
interface Body {
    name?: string;
    content?: string;
    scope?: 'private' | 'public';
}
```

**响应**

```ts
type Response = Doc;
```

### `DELETE` 删除文档

```
/doc/:id
```

**响应**

```ts
type Response = Doc;
```