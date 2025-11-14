# 基础服务

## 静态资源

### `GET` 获取指定目录下的文件列表

`/statics/*`

**权限要求：** 需要登录

**示例：** `/statics/test/folder`

**响应**

```ts
type Response = {
    files: Array<{
        name: string;
        isDir: boolean;
    }>;
};
```

### `POST` 创建文件夹

`/statics/folder`

**权限要求：** 仅 admin

**参数**

```ts
interface Body {
    path: string; // 文件夹路径，例如：'test/folder'
}
```

**响应**

```ts
type Response = {
    message: string;
    path: string;
};
```

### `POST` 上传文件

`/statics/upload`

**权限要求：** 仅 admin

**参数**

```ts
// Content-Type: multipart/form-data
interface FormData {
    file: File; // 要上传的文件
    path?: string; // 目标路径（可选，默认为根目录）
}
```

**响应**

```ts
type Response = {
    message: string;
    file: {
        filename: string; // 服务器上的文件名（包含时间戳）
        originalname: string; // 原始文件名
        mimetype: string; // 文件 MIME 类型
        size: number; // 文件大小（字节）
        path: string; // 相对路径
        url: string; // 完整访问 URL
    };
};
```

## 日志

### `GET` 获取所有日志权限信息

`/admin/log-tokens`

**响应**

```ts
type Response = Array<{
    title: string;
    token: string;
}>;
```

## `POST` 创建日志权限

`/admin/log-token`

**参数**

```ts
interface Body {
    title: string;
}
```

**响应**

```ts
type Response = {
    title: string;
    token: string;
};
```

### `DELETE` 删除日志权限

`/admin/log-token/:token`

**响应**

```ts
type Response = {
    title: string;
    token: string;
};
```

### `GET` 获取某日日志

`/admin/log/:date`

**响应**

```ts
type Response = {
    log: string;
};
```

### `POST` 发送日志

`/log`

**参数**

```ts
interface Body {
    token?: string; // 或者是管理员账号
    message: string;
}
```

**响应**

```ts
type Response = {
    success: boolean;
};
```
