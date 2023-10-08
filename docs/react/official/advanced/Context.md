---
tags:
  - react
  - js
  - 前端
---

# Context

一般数据是通过 `props` 属性自上而下（由父及子）进行传递的，对于一些类型的属性（比如地区偏好、UI 主题等）是应用于大部分组件的。`Context` 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 `props` 。

```js
// 为当前的 theme 创建一个 context（“light”为默认值）
const ThemeContext = React.createContext('light')

class App extends React.Component {
  render() {
    // 使用一个 `Provider` 来将当前的 theme 传递给以下的组件树
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

function Toolbar() {
  return <div><ThemedButton /></div>
}

class ThemedButton extends React.Component {
  // 指定 `contextType` 读取当前的 theme context
  // React 会往上找到最近的 theme Provider，然后使用它的值
  // 在这个例子中，当前的 theme 值为 “dark”
  static contextType = ThemeContext

  render() {
    return <Button theme={this.context} />
  }
}
```

> Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。

## API

* `React.createContext`

  创建一个 Context 对象。

  ```js
  const MyContext = React.createContext(defaultValue)
  ```

  > 只有当组件找不到 `Provider` 时会使用默认值，方便测试。

* `<MyContext.Provider value={/* 某个值 */}>`

  多个 `Provider` 也可以嵌套使用，里层的会覆盖外层的数据。

  当 `Provider` 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。如果值是对象，请不要在 JSX 里直接定义，因为每次都将视为一个新的对象。

* `Class.contextType`

  通过设置类的 `contextType` 属性，可以在任何生命周期里使用 `this.context` 属性来获取最近 Context 的值。

  ```js
  class MyClass extends React.Component {
    componentDidMount() {
      let value = this.context;
      /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
    }
    componentDidUpdate() {
      let value = this.context;
      /* ... */
    }
    componentWillUnmount() {
      let value = this.context;
      /* ... */
    }
    render() {
      let value = this.context;
      /* 基于 MyContext 组件的值进行渲染 */
    }
  }

  MyClass.contextType = MyContext;
  ```

* `Context.Consumer`

  一个函数式组件，用来订阅 context 的变更。

  ```js
  <MyContext.Consumer>
    {value => /* 基于 context 值进行渲染*/}
  </MyContext.Consumer>
  ```

  > 可以将改变 Context 的方法放在 `value` 对象里，然后在 `Consumer` 里使用。

* `Context.displayName`

  设置 Context 在 DevTools 中显示的名称。

---

### 参考

[Context - React](https://zh-hans.reactjs.org/docs/context.html)