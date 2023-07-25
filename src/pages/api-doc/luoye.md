# 落页

「落页」是一个在线文档工具，支持 Markdown 语法，多人协作。

它由以下实体组成：

-   工作区 `workspace`
-   文档 `doc`

## 数据结构

### 文件结构

该项目数据使用 json 文件进行存储。在根目录下，有以下目录：

-   `workspaces` 工作区目录
    -   `{id}.json` 工作区信息
-   `docs` 文档目录
    -   `{id}.json` 文档信息
-   `users` 用户目录
    -   `{id}` 用户目录
        -   `workspaces.json` 工作区列表
        -   `docs.json` 文档列表

### 工作区信息

-   `id` 工作区 id
-   `name` 工作区名称
-   `description` 工作区描述
-   `creator` 创建者
-   `owner` 所有者
-   `admins` 管理员列表
-   `members` 成员列表
-   `scope` 可见范围
    -   `public` 公开
    -   `private` 私有
-   `docs` 文档列表，数组元素为：
    -   `id` 文档 id
    -   `name` 文档名称
    -   `docs` 子文档列表，默认值为空数组
-   `createdAt` 创建时间
-   `updatedAt` 更新时间

### 用户工作区列表

列表元素为工作区的核心信息，有如下属性：

-   `id` 工作区 id
-   `name` 工作区名称
-   `description` 工作区描述
-   `scope` 可见范围
    -   `public` 公开
    -   `private` 私有
-   `joinAt` 添加时间

### 文档信息

-   `id` 文档 id
-   `author` 文档作者
-   `name` 文档名称
-   `createdAt` 创建时间
-   `updatedAt` 更新时间
-   `admins` 管理员列表
-   `members` 成员列表
-   `scope` 可见范围
    -   `public` 公开
    -   `private` 私有
-   `content` 文档内容

## 接口

| Method | Path             | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/workspaces`    | 获取工作区列表 |
| POST   | `/workspace`     | 创建工作区     |
| GET    | `/workspace/:id` | 获取工作区信息 |
| PUT    | `/workspace/:id` | 更新工作区信息 |
| GET    | `/doc/:id`       | 获取文档信息   |
| POST   | `/doc`           | 创建文档       |
| PUT    | `/doc/:id`       | 更新文档信息   |
| DELETE | `/doc/:id`       | 删除文档       |
