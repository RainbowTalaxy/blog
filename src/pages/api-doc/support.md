# 基础服务

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
