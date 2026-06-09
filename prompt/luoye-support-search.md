# 落页支持搜索接口

搜索接口要求：

1. 搜索词 keyword 不支持模糊搜索，但支持大小写敏感搜索。
2. 支持限制返回结果数量 limit，默认为 15 条。
3. 搜索结果按照文档的更新时间降序排序。
4. 搜索结果中每条记录包含文档的 id、标题、摘要和更新时间。
5. 如果单个文档中包含多个匹配项，则所有匹配项都应该包含在搜索结果中，并且应当放在同一文档的数据项中，不作为 limit 的单独记录。
6. 支持按照工作区限定搜索范围。

## 任务一

请你调研项目，写一个精简的技术方案。

### 技术方案

#### 1. 数据存储现状

-   文档以 JSON 文件形式存储在 `luoye/docs/` 目录下，每个文档一个 `{docId}.json` 文件。
-   Doc 结构包含 `id`、`name`（标题）、`content`（正文）、`updatedAt`、`scope`、`workspaces`、`members`、`deletedAt` 等字段。
-   用户维度有 `docs.json`（文档列表，DocItem 不含内容正文）和 `workspaces.json`（工作区列表）。

#### 2. 接口设计

```
GET /api/luoye/search?keyword=xxx&workspaceId=xxx&limit=15
```

| 参数        | 类型   | 必填 | 说明                               |
| ----------- | ------ | ---- | ---------------------------------- |
| keyword     | string | 是   | 搜索关键词，精确匹配（大小写敏感） |
| workspaceId | string | 否   | 限定搜索的工作区 ID                |
| limit       | number | 否   | 返回结果数量上限，默认 15          |

鉴权：使用 `login` 中间件，仅搜索当前用户有权限访问的文档。

#### 3. 搜索逻辑

1. 通过 `Ctr.user(userId).docItems.content` 获取用户的文档 ID 列表。
2. 如指定 `workspaceId`，先校验工作区存在且用户有权限（`Access >= Member`），然后从 `workspace.docs` 中过滤出目标 doc ID 集合。
3. 遍历目标 doc ID，用 `Ctr.doc.ctr(docId)` 逐一读取文档完整内容。
4. 跳过 `deletedAt !== null` 的已删除文档。
5. 对每个文档要求所有关键词都在 `name` 或 `content` 中至少命中一次（大小写敏感子串匹配）。
6. 对每个匹配文档，提取所有匹配项的上下文摘要（匹配位置前后各截取约 30 字符），同一文档的多个匹配项归入同一项。
7. 按 `updatedAt` 降序排序，取前 `limit` 条文档返回。

#### 4. 返回数据结构

```ts
interface SearchResultItem {
    id: string; // 文档 ID
    name: string; // 文档标题
    updatedAt: number; // 更新时间
    matches: {
        field: 'name' | 'content'; // 匹配来源
        context: string; // 匹配上下文摘要
    }[];
}

// 响应: SearchResultItem[]
```

#### 5. 文件改动

| 文件                                   | 改动内容                                                   |
| -------------------------------------- | ---------------------------------------------------------- |
| `server/modules/luoye/router.js`       | 新增 `GET /search` 路由                                    |
| `server/modules/luoye/controller.js`   | 新增 `search` 方法：遍历文档文件、执行关键词匹配、生成摘要 |
| `server/modules/luoye/controller.d.ts` | 补充 `search` 方法类型声明                                 |

#### 6. 性能考量

-   当前数据以文件系统存储，搜索需逐文件读取，适合个人/小团队数据量场景。
-   先通过用户 docItems 列表（或工作区文档列表）缩小候选范围，避免全目录扫描。
-   `limit` 参数控制结果数量，命中足够数量后可提前终止遍历（注意需先排序再截断，故仍需全量匹配后排序）。

## 任务二

按照技术方案实现接口。并在下方写一个精简概要的总结，用作后续的上下文。

> 注意，先不要写单元测试。

### 总结

已实现搜索接口，改动涉及三个文件：

1. **`controller.js`** — 新增 `Controller.search(userId, keyword, options)` 方法。根据是否传入 `workspaceId` 确定候选文档范围（工作区文档列表或用户全部文档列表），逐一读取文档 JSON，跳过已删除文档，要求所有关键词在 `name` 或 `content` 中至少命中一次（大小写敏感子串匹配），提取匹配位置前后各 30 字符的上下文摘要，同一文档的多个匹配项归入同一条记录。最后按 `updatedAt` 降序排序并截取 `limit` 条返回。

2. **`router.js`** — 新增 `GET /search` 路由，使用 `login` 中间件鉴权。接收 `keyword`（必填）、`workspaceId`（可选）、`limit`（可选，默认 15）三个 query 参数。若指定 `workspaceId`，会先校验工作区存在且用户权限 `>= Member`。

3. **`controller.d.ts`** — 补充 `search` 方法的 TypeScript 类型声明，返回类型为 `SearchResultItem[] | null`（工作区不存在时返回 null）。

## 任务三

请你补充接口的单元测试。

## 任务四

支持一下多词搜索，例如搜索 "hello world" 时，仅返回同时包含 "hello" 和 "world" 的文档。

补充一下单元测试，并且更新一下接口文档 `src/pages/api-doc/luoye.md` 。
