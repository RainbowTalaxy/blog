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
        -   `tags.json` 用户标签列表 `string[]`
-   `chat` AI 聊天会话目录
    -   `{userId}` 用户会话目录
        -   `{sessionId}.json` 会话信息 `ChatSession`

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
    docType: 'text' | 'markdown'; // 文档类型
    content: string; // 文档内容
    tags?: string[]; // 文档标签
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
    docType: 'text' | 'markdown'; // 文档类型
    tags?: string[]; // 文档标签
    date: number; // 所属日期
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
    createdAt: number; // 创建时间
    date: number; // 所属日期
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

### ChatSession

```ts
interface ChatSession {
    schemaVersion: 1; // 会话数据结构版本
    sessionId: string; // 会话 id
    userId: string; // 所属用户 id
    docId?: string; // 关联文档 id
    title: string; // 会话标题
    messages: ChatMessage[]; // 消息列表
    docUpdatedAt?: number; // 会话记录的文档更新时间
    createdAt: number; // 创建时间
    updatedAt: number; // 更新时间
}
```

### ChatSessionSummary

```ts
interface ChatSessionSummary {
    schemaVersion: 1;
    sessionId: string;
    userId: string;
    docId?: string;
    title: string;
    messageCount: number;
    createdAt: number;
    updatedAt: number;
}
```

### ChatMessage

```ts
type ChatMessage = ChatUserMessage | ChatAssistantMessage;

interface ChatUserMessage {
    schemaVersion: 1;
    messageId: string;
    type: 'user_message';
    content: string;
    attachments?: ChatImageAttachment[];
    createdAt: number;
}

interface ChatAssistantMessage {
    schemaVersion: 1;
    messageId: string;
    type: 'assistant_message';
    parts: ChatMessagePart[];
    createdAt: number;
}
```

### ChatImageAttachment

```ts
interface ChatImageAttachment {
    id: string;
    url: string;
    name: string;
    mimeType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
    size: number;
}
```

**说明**

-   单条用户消息最多保留 3 张图片附件
-   `url` 仅允许 `http/https`，路径必须以 `/statics/temp/luoye/` 开头
-   `url` host 仅允许 `blog.talaxy.cn`、`localhost`、`127.0.0.1`
-   `size` 必须大于 0 且不超过 `50MB`
-   用户消息必须包含非空 `content` 或至少一个合法图片附件

### ChatMessagePart

```ts
type ChatMessagePart = ChatTextPart | ChatToolPart;

interface ChatTextPart {
    schemaVersion: 1;
    partId: string;
    type: 'text';
    content: string;
    createdAt: number;
}

interface ChatToolPart {
    schemaVersion: 1;
    partId: string;
    type: 'tool_call';
    toolName: string;
    runId: string; // 用于更新该 tool call 的稳定 id
    toolCallId?: string; // 外部工具调用 id
    input: Record<string, unknown>;
    output?: unknown;
    content?: string;
    status?: string; // 如 pending、confirmed、cancelled
    createdAt: number;
    updatedAt: number;
}
```

### ImageUploadResponse

```ts
interface ImageUploadResponse {
    message: string;
    file: {
        filename: string; // 接口返回的文件名
        originalname: string; // 原始文件名
        mimetype: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
        size: number; // 最终保存文件大小（字节）
        path: string; // 静态资源相对路径，例如 temp/luoye/xxx.png
        url: string; // 完整访问 URL
    };
}
```

### AI 聊天会话写入约定

AI 聊天会话接口只负责历史数据存储，不负责模型推理、流式响应和中断控制。调用方写入会话历史时建议遵循下面的顺序：

1. 调用 `POST /chat-sessions` 创建会话，后续请求使用返回的 `sessionId`。
2. 用户输入产生后，调用 `POST /chat-sessions/:sessionId/messages` 追加一条完整的 `user_message`。消息可以是纯文本、纯图片、或文本加图片。
3. 调用方可读取完整 `ChatSession`，并按自身需要转换为模型上下文。
4. 模型响应完成后，再追加一条完整的 `assistant_message`。中断或失败的未完成响应不强制写入历史。
5. 需要记录的工具调用应作为 `assistant_message.parts[]` 中的 `tool_call` 写入；状态或结果变化时，再调用 `PATCH /chat-sessions/:sessionId/tool-calls/:runId` 回写。

聊天会话写入类接口的 JSON 请求体上限为 `10MB`。

图片附件需要先通过 `POST /attachments/images` 上传，再使用上传接口返回值组装 `ChatImageAttachment`：

```ts
const attachment: ChatImageAttachment = {
    id: 'client-generated-id',
    url: upload.file.url,
    name: upload.file.originalname || upload.file.filename,
    mimeType: upload.file.mimetype,
    size: upload.file.size,
};
```

**注意**

-   `mimeType`、`size`、`url` 必须使用上传接口返回的最终值，不要使用上传前文件对象的原始值。
-   上传失败时不要追加对应附件；如果用户消息没有文本且没有合法附件，接口会拒绝追加。
-   消费会话数据时应按 `schemaVersion`、`message.type`、`part.type` 分支处理；遇到未知版本或未知类型时应做兼容兜底。

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

返回最近的 20 条文档记录。

**响应**

```ts
type Response = DocItem[];
```

### `DELETE` 删除最近文档

`/recent-docs/:docId`

```ts
interface Response = {
    success: boolean;
};
```

### `GET` 获取用户标签列表

`/tags`

**响应**

```ts
type Response = string[];
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
    scope?: 'private' | 'public';
    date?: number;
    docType?: 'text' | 'markdown';
    tags?: string[]; // 文档标签
}
```

**响应**

```ts
type Response = Doc;
```

**说明**

-   `tags` 参数用于设置文档的标签
-   必须是字符串数组，每个标签不能为空字符串
-   创建文档时设置的标签会自动添加到用户的标签列表中

### `PUT` 更新文档信息

`/doc/:id`

**参数**

```ts
interface Body {
    name?: string;
    content?: string;
    scope?: 'private' | 'public';
    date?: number;
    workspaces?: string[]; // 文档所属的工作区 ID（数组格式，目前仅支持单个）
    tags?: string[]; // 文档标签
}
```

**响应**

```ts
type Response = Doc;
```

**说明**

-   `workspaces` 参数用于修改文档所属的工作区
-   必须是包含单个工作区 ID 的数组
-   指定的工作区必须存在，且当前用户对该工作区有 Member 及以上权限
-   修改后会自动同步更新相关工作区的文档列表
-   `tags` 参数用于修改文档的标签
-   必须是字符串数组，每个标签不能为空字符串
-   更新文档时设置的标签会自动添加到用户的标签列表中

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

### `PUT` 恢复文档

`/doc/:docId/restore`

**响应**

```ts
interface Response = {
    success: boolean;
};
```

### `GET` 搜索文档

`/search`

**参数**

```ts
interface Query {
    keyword?: string; // 搜索关键词（大小写敏感，多词 AND 搜索，用空白分隔）
    workspaceId?: string; // 限定搜索的工作区 ID
    limit?: number; // 返回明细数量上限，默认 30，最大 30
    timeField?: 'updatedAt' | 'createdAt' | 'date'; // 时间筛选字段，默认 updatedAt
    startDate?: string; // 开始日期，格式 YYYY-MM-DD，包含当天 00:00:00.000
    endDate?: string; // 结束日期，格式 YYYY-MM-DD，包含当天 23:59:59.999
}
```

**响应**

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

interface Response {
    total: number; // 搜索结果总数
    items: SearchResultItem[]; // 搜索结果明细，最多 30 条
}
```

**说明**

-   `workspaceId` 是第一层筛选条件；如果指定 `workspaceId`，则仅在该工作区的文档中搜索，需要 Member 及以上权限
-   时间范围是第二层筛选条件，支持按 `updatedAt`、`createdAt` 或 `date` 筛选；不传 `timeField` 时默认按 `updatedAt` 筛选
-   `keyword` 是末位筛选条件；如果为空，则返回工作区和时间范围内的全部文档，且每条记录的 `matches` 为空数组
-   搜索关键词支持多词 AND 搜索，使用空白分隔多个词。例如搜索 "hello world" 仅返回同时包含 "hello" 和 "world" 的文档
-   搜索关键词为大小写敏感的精确子串匹配，不支持模糊搜索
-   搜索范围为当前用户有权限访问的文档的标题和正文
-   `startDate` 和 `endDate` 只支持 `YYYY-MM-DD`，可只传一端；若两端都传，`startDate` 不能晚于 `endDate`
-   同一文档的多个匹配项归入同一条记录，不单独计入明细数量上限
-   接口最多返回 30 条搜索结果明细，同时通过 `total` 返回完整命中数量
-   结果按文档更新时间降序排序
-   已删除的文档不会出现在搜索结果中

### `GET` 获取 AI 聊天会话列表

`/chat-sessions`

**参数**

```ts
interface Query {
    docId?: string; // 仅返回指定文档关联的会话
    limit?: number; // 返回数量上限，默认 20
}
```

**响应**

```ts
type Response = ChatSessionSummary[];
```

**说明**

-   仅返回当前登录用户自己的会话
-   结果按 `updatedAt` 降序排序
-   `limit` 默认 `20`，传入非法正整数时返回参数错误
-   每个用户保留最近 `50` 个会话，并清理超过 `90` 天未更新的会话

### `POST` 创建 AI 聊天会话

`/chat-sessions`

**参数**

```ts
interface Body {
    docId?: string;
    docUpdatedAt?: number;
}
```

**响应**

```ts
type Response = ChatSession;
```

**说明**

-   传入 `docId` 时，会校验当前用户是否有权限读取该文档
-   会话默认标题为 `新会话`，追加第一条用户消息后会自动生成标题
-   第一条用户消息是纯图片时，标题会按第一张图片名生成，例如 `图片：xxx.png`

### `GET` 获取 AI 聊天会话详情

`/chat-sessions/:sessionId`

**响应**

```ts
type Response = ChatSession;
```

**说明**

-   只允许当前会话所属用户读取
-   返回数据会使用当前 `schemaVersion`

### `PATCH` 更新 AI 聊天会话元信息

`/chat-sessions/:sessionId`

**参数**

```ts
interface Body {
    title?: string;
    docUpdatedAt?: number;
}
```

**响应**

```ts
type Response = ChatSession;
```

**说明**

-   该接口只更新会话元信息，不支持修改历史消息内容
-   `title` 会 `trim` 后保存，最长保留 80 个字符
-   `docUpdatedAt` 可用于调用方记录该会话对应的文档更新时间

### `POST` 追加 AI 聊天消息

`/chat-sessions/:sessionId/messages`

**参数**

```ts
interface Body {
    message: ChatMessage;
}
```

**响应**

```ts
type Response = ChatSession;
```

**说明**

-   消息只支持追加，不支持覆盖已有消息
-   返回数据会使用当前 `schemaVersion`
-   仅支持追加 `user_message` / `assistant_message`，兼容 `role: 'user' | 'assistant'` 输入
-   `user_message.content.trim()` 非空，或 `attachments` 中至少有 1 个合法图片附件；否则返回 `404`，错误文案为“会话不存在或消息格式错误”
-   `user_message.attachments` 会过滤非法项，并最多保留 3 张；如果文本非空但图片全部非法，消息仍会保存为纯文本
-   `assistant_message.parts` 用于保存完整 assistant 输出；文本内容使用 `{ type: 'text', content }`，工具调用使用 `{ type: 'tool_call', toolName, runId, input, output, status }`
-   需要后续确认、取消或结果回写的工具调用，应通过 `tool_call.status`、`tool_call.output` 等结构化字段表达，不建议写入文本 `content`

### `PATCH` 更新 AI 聊天 tool call

`/chat-sessions/:sessionId/tool-calls/:runId`

**参数**

```ts
interface Body {
    status?: string;
    output?: unknown;
    content?: string;
}
```

**响应**

```ts
type Response = ChatSession;
```

**说明**

-   用于更新指定 `runId` 对应的 `tool_call`
-   可用于工具调用的 `pending` / `confirmed` / `cancelled` 等状态回写，也可用于写入执行结果
-   请求体至少包含 `status`、`output`、`content` 中的一个字段，否则返回 `400`
-   如果会话不存在，或找不到对应 `runId` 的 `tool_call`，返回 `404`
-   该接口只更新 tool call 局部状态，不支持修改普通文本消息

### `DELETE` 删除 AI 聊天会话

`/chat-sessions/:sessionId`

**响应**

```ts
interface Response = {
    success: boolean;
};
```

### `POST` 上传 AI 聊天图片附件

`/attachments/images`

**权限要求：** 需要登录

**参数**

```ts
// Content-Type: multipart/form-data
interface FormData {
    file: File; // 要上传的图片，字段名固定为 file
}
```

**响应**

```ts
type Response = ImageUploadResponse;
```

**说明**

-   上传目录固定为静态资源目录下的 `temp/luoye`
-   接口会重新生成文件名，调用方不能指定目标目录
-   仅支持 `image/png`、`image/jpeg`、`image/webp`、`image/gif`
-   单文件最大 `50MB`
-   接口会校验图片格式；文件内容格式必须与上传 MIME 一致
-   `image/png`、`image/jpeg`、`image/webp` 可能会被压缩处理
-   `image/gif` 不压缩
-   返回的 `file.url` 可直接作为 `/statics/temp/luoye/...` 图片资源地址使用
-   上传失败返回 `400`；调用方不要把失败图片写入 `ChatImageAttachment`
-   后续追加会话消息时，应使用返回的 `file.url`、`file.mimetype`、`file.size` 作为附件可信字段
