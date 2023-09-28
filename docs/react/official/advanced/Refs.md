---
tags:
  - react
  - js
  - 前端
---

# Refs 和 DOM

Refs 允许我们直接对 DOM 节点或者 React 元素进行操作。

使用 Refs 的场景：

* 管理焦点，文本选择或媒体播放

* 触发强制动画

* 集成第三方 DOM 库

> 避免使用 refs 来做任何可以通过声明式实现来完成的事情。

## 创建 Refs

使用 `React.createRef()` 创建 Refs ：

``` js {4,8}
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  render() {
    return <div ref={this.myRef} />
  }
}
```

> 不能在函数组件上使用 `ref` 属性，因为其并没有实例。

## 访问 Refs

可以通过 `myRef.current` 访问实际 HTML 元素或 React 元素。

## 通过回调获取 Ref

可以通过这样的代码来以回调的形式获取元素：

``` js {4-6,15}
class CustomTextInput extends React.Component {
  constructor(props) {
    // ...
    this.setTextInputRef = element => {
      this.textInput = element
    }
    // ...
  }
  
  // ...

  render() {
    return (
      <div>
        <input type="text" ref={this.setTextInputRef} />
        {/* ... */}
      </div>
    )
  }
}
```

之前提到不能对函数组件使用 `ref` 属性，但是可以用回调形式获取函数组件中的非函数组件：

``` js {4,12}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  )
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    )
  }
}
```

---

### 参考

[Refs 和 DOM - React](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)