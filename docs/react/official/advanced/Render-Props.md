---
tags:
  - react
  - js
  - 前端
---

# Render Props

Render Props ，即接受一个**返回 React 元素的函数**作为属性的组件。

```js
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

> 不一定要用名为 `render` 的属性来使用这种模式。

---

### 参考

[Render Props - React](https://zh-hans.reactjs.org/docs/render-props.html)