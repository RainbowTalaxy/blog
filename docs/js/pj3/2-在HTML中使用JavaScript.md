# 在HTML中使用JavaScript

## 嵌入 script 代码：

```js
<script type="text/javascript">
  function sayHi() {
    alert("Hi!");
  }
</script>
```

## 转义

```js
<script type="text/javascript">
  function sayHi() {
    alert("<\/script>");
  }
</script>
```

## 包含外来文件

```js
<script type="text/javascript" src="example.js"></script>
```

以下写法不适用于 HTML ：

```js
<script type="text/javascript" src="example.js" />
```

## 延迟脚本

使用 `defer` 标签，当 HTML 加载完后才会运行 JS 文件：

```js
<script type="text/javascript" defer="defer" src="example.js"></script>
```

## 异步脚本

`async` 只适用于外部脚本文件：

```js
<script type="text/javascript" async src="example.js"></script>
```

## `<noscript>` 元素

当浏览器不支持 JS 或者 JS 被禁用时：

```js
<noscript>
  <p>本页面需要浏览器支持（启用）JavaScript。</p>
</noscript>
```