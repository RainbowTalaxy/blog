---
tags:
  - react
  - js
  - 前端
---

# Refs 转发

Ref 转发允许某些组件接收 `ref` ，并将其向下传递给子组件。

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
))

// 你可以直接获取 DOM button 的 ref ：
const ref = React.createRef()
<FancyButton ref={ref}>Click me!</FancyButton>
```

和 `key` 一样，`ref` 不会向下传递（通过 `{...props}` 语句），React 会对其进行处理。不过我们可以通过 `React.forwardRef` 明确我们要传递的 `ref` ：

```js
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps)
      console.log('new props:', this.props)
    }

    render() {
      // 将 `ref` 分配给实例
      const {forwardedRef, ...rest} = this.props;
      return <Component ref={forwardedRef} {...rest} />
    }
  }

  // `React.forwardRef` 接受一个渲染函数
  // 其接收 `props` 和 `ref` 参数并返回一个 React 节点
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  })
}
```

## 自定义 DevTool 中的显示名称

默认情况下转发组件名称为 "ForwardRef(myFunction)" ，也可以通过设置渲染函数的 displayName 属性来设置名称：

```js
function logProps(Component) {
  class LogProps extends React.Component {
    // ...
  }

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  // 在 DevTools 中为该组件提供一个更有用的显示名。
  // 例如 "ForwardRef(logProps(MyComponent))"
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `logProps(${name})`;

  return React.forwardRef(forwardRef);
}
```

---

### 参考

[Refs 转发 - React](https://zh-hans.reactjs.org/docs/forwarding-refs.html)