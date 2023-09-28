---
tags:
  - react
  - js
  - 前端
---

# 非受控组件

可以使用 `ref` 来从 DOM 节点中获取表单数据：

``` js {5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef()
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value)
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}
```

在 React 渲染生命周期时，表单元素上的 `value` 将会覆盖 DOM 节点中的值。如果你想设置默认值但不被 React 控制，可以用 `defaultValue` 属性。

## 文件输入

在 HTML 中，`<input type="file">` 可以让用户选择一个或多个文件上传到服务器，或者通过使用 [File API](https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications) 进行操作。

在 React 中，应该通过 DOM 节点使用 File API 与文件进行交互：

``` js {5,10,19}
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${this.fileInput.current.files[0].name}`
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

---

### 参考

[非受控组件 - React](https://zh-hans.reactjs.org/docs/uncontrolled-components.html)

[Controlled and uncontrolled form inputs in React don't have to be complicated - Gosha Arinich](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)

[在web应用程序中使用文件 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications)