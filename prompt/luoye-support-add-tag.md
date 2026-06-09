# 落页：文档支持标注 Tag 标签

注意：不要动前端代码，只需要实现后端功能即可。

## 任务一

请对文档 Doc 实体增加 `tags` 字段，类型为可选的字符串数组 `string[]`，即 TS 类型定义为 `tags?: string[]`，用于存储文档的标签信息。并支持通过 POST/PUT `/doc/:id` 接口设置该字段。

同时需要在 `docs.json` 索引文件中增加该字段。需要注意的是，由于存量数据中并没有该字段，新增字段需要设置为可选类型，并且存量数据不需要进行任何迁移操作。

同时，请维护一个 tag 列表，存储用户所使用过的标签，文件命名为 `tags.json` 。同时也需要新增一个 GET `/tags` 接口，用于获取当前所有的标签列表。

### 总结

已完成以下修改：

1. **类型定义** (`constants.d.ts`): 为 `Doc` 和 `DocItem` 接口添加 `tags?: string[]` 可选字段
2. **Controller 类型** (`controller.d.ts`): 更新 `doc.add`、`doc.ctr.update` 方法参数支持 tags，在 `user` 模块下新增 `tags` 子模块类型
3. **业务逻辑** (`controller.js`):
    - `userFile` 增加 `tags.json` 路径，初始化时创建空数组
    - `user.tags` 模块管理用户标签列表（`content` getter/setter、`addTags` 去重添加）
    - `docItems.add/update` 同步 tags 到用户文档索引
    - `doc.add/update` 存储和更新 tags 字段
4. **校验函数** (`utility.js`): 新增 `tagsCheck(tags)` 验证标签数组合法性
5. **API 路由** (`router.js`):
    - `POST /doc`: 支持 tags 参数，创建时同步更新用户标签列表
    - `PUT /doc/:docId`: 支持 tags 参数，更新时同步用户标签列表
    - `GET /tags`: 新增接口返回当前用户的标签列表

## 任务二

请你在 `server/modules/luoye/tests` 中补充对应的单元测试。
