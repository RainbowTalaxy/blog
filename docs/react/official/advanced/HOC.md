---
tags:
  - react
  - js
  - 前端
---

# 高阶组件 Higher-Order Components

高阶组件（HOC）是一种基于 React 的组合特性而形成的设计模式。

```js
// 高阶组件是参数为组件，返回值为新组件的函数
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

## 例子

这里举一个在尾部显示时间的组件函数的例子：

```js
function withClock(WrappedComponent) {
  return function(props) {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
      const timerID = setInterval(() => { setTime(new Date()) }, 1000)
      return () => { clearInterval(timerID) }
    })

    return (
      <div>
        <WrappedComponent {...props} />
        <p><i>现在是 {time.toLocaleTimeString()}.</i></p>
      </div>
    )
  }
}

// 我们可以直接封装在已有组件上，生成一个新的组件
const TitlewithClock = withClock((props) => <h1>{props.title}</h1>)
const title = <TitlewithClock title='Hello React'/>
```

> 记得将不相关的 props 传递给被包裹的组件。

可以包装显示名称以便轻松调试：

```js
HOComponent.displayName = `HOComponent(${getDisplayName(WrappedComponent)})`
```

## 注意事项

* 不要在 `render` 方法中使用 HOC

* 务必复制静态方法

* Refs 不会被传递

---

### 参考

[高阶组件 - React](https://zh-hans.reactjs.org/docs/higher-order-components.html)