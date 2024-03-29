# DOM 文件对象模型

## 节点层次

DOM 可以将 HTML 或 XML 描绘成一个由多层节点构成的结构。

文档节点是每个文档的根结点：

```html
<!-- 在这个例子中，<html> 是文档节点，或者称为文档元素 -->
<html>
    <head>
        <title>Sample Page</html>
    </head>
    <body>
        <p>Hello World!</p>
    </body>
</html>
```

## Node 类型

JS 中所有节点类型都继承自 `Node` 类型，每个节点都有 `nodeType` 属性，用于标明节点的类型，常用的有：

* `Node.ELEMENT_NODE`（常数值为 1 ）

* `Node.TEXT_NODE`（常数值为 3 ）

> 其余的节点类型见书 P248 。

考虑浏览器兼容，建议用常数值来判断节点类型：

```js
if (someNode.nodeType == 1) {
    alert("Node is an element.")
}
```

可以访问 `nodeName` 和 `nodeValue` 属性获得具体的节点信息，但访问之前最好检查节点类型：

```js
// 判断是不是元素节点
if (someNode.nodeType == 1) {
    // 在这里 nodeName 始终是元素的标签名
    name = someNode.nodeName
    // 而 nodeValue 始终为 null
    value = someNode.nodeValue
}
```

可以通过 `childNodes` 属性访问一个节点的子节点，且为一个 `NodeList` 对象（不是 `Array` ）：

```js
// 既可以用下标，也可以用 item 方法来获得子节点
var firstChild = someNode.childNodes[0]
var secondChild = someNode.childNodes.item(1)
// 获得子节点个数
var count = someNode.childNodes.length
```

将 `NodeList` 对象转为数组：

```js
// 转为数组
var arrayOfNodes = Array.prototype.slice.call(someNode.childNodes, 0)

// 或者这样转为数组
var array = new Array()
for (var i = 0, len = nodes.length; i < len; i += 1) {
    array.push(nodes[i])
}
```

别的访问节点的方式：

* 可以通过 `parentNode` 属性访问父节点

* 通过 `previousSibling` 和 `nextSibling` 访问兄弟节点

* 通过 `firstChild` 和 `lastChild` 访问第一个和最后一个子节点

> 可以见书 P251 查看关系图。

可以通过 `ownerDocument` 访问整个文档的文档节点。

节点操作：

* `appendChild` 方法在末端添加节点，如果是文档的一部分则为位置的变化

* `insertBefore(newNode, node)` 将 `newNode` 插入到 `node` 之前，`node` 可以为 `null` 表示在末端插节点

* `replace(newNode, node)` 替换节点，被替换的节点不会消失，只是没有位置

* `removeChild(node)` 删除节点

可以用 `cloneNode(flag)` 来复制节点。`flag` 为 `true` 时复制整棵节点树；`false` 只复制本节点，没有父亲和儿子。`cloneNode` 方法不会复制 DOM 节点中的 JS 属性。

## Document 类型

JS 用 `Document` 类型表示文档。在浏览器中，`document` 对象是 `HTMLDocument`（继承 `Document` ）的一个实例。同时，`document` 是 `window` 的一个属性，所以可以全局访问。

`Document` 节点的属性值：

* `nodeType` 为 9

* `nodeName` 为 `"#document"`

* `nodeValue` 为 `null`

* `parentNode` 为 `null`

* `ownerDocument` 为 `null`

快速访问节点：

* `documentElement` 属性访问 `document` 中的 `<html>` 元素

* `body` 属性访问 `<body>` 元素

* `doctype` 访问 `<!DOCTYPE>` 元素（慎用）

文档信息：

* `title` 访问 `<title>` 元素，可以直接设置 title 属性值为新标题名

* `URL` 返回地址栏显示的 URL

* `domain` 返回域名。如果有子域名，则不可以设置新域名

* `referer` 返回来源页面的 URL

查找元素：

* `getElementById(id)` 返回对应 `id` 属性的元素，严格匹配大小写

    - 建议 HTML 中不存在 `name` 属性和 `id` 属性值一致的情况

    - 文档中可能会有多个同 `id` 的元素，但只会返回第一个

* `getElementsByTagName(tag)` 返回对应标签的 `HTMLCollection`（和 `NodeList` 类似）

    - 可以通过 `namedItem(name)` 来获取对应 `name` 属性的项，这里的 `name` 不区分大小写，当 `name` 为 "*" 时可以匹配所有项

* `getElementsByName(name)` 返回对应 `name` 属性的元素的 `NodeList` ：

    ```html
    <fieldset>
        <legend>Which color do you prefer?</legend>
        <ul>
            <li>
                <input type="radio" value="red" name="color" id="colorRed">
                <!-- label 会去对应一个 input -->
                <label for="colorRed">Red</label>
            </li>
            <li>
                <input type="radio" value="green" name="color" id="colorGreen">
                <label for="colorGreen">Green</label>
            </li>
            <li>
                <input type="radio" value="blue" name="color" id="colorBlue">
                <label for="colorBlue">Blue</label>
            </li>
        </ul>
    </fieldset>
    ```

    可以这样获取所有 `name` 属性为 `"color"` 的元素，即所有单选按钮：

    ```js
    var radios = document.getElementsByName("color")
    ```

特殊集合：

* `anchors` 属性返回带 `name` 属性的 `<a>` 元素

* `forms` 属性返回 `<form>` 元素

* `images` 属性返回 `<img>` 元素

* `links` 属性返回带 `href` 属性的 `<a>` 元素

> 可以用 `document.implementation.hasFeature(func, ver)` 来检测 DOM 实现（慎用，具体见书 P259 ）。

文档写入：

* `write()` 方法直接在 HTML 中写入内容，注意转义上的严谨问题

* `writeln()` 方法会在 `write` 的基础上加 `"\n"`

* `open()` 和 `close()` 用于打开和关闭网页的输出流，一般用不到

## Element 类型

`Element` 是 Web 编程中最常用的类型，具有以下特征：

* `nodeType` 为 1

* `nodeName` 为元素的标签名，且返回值为大写，也可以用 `tagName` 属性访问

* `nodeValue` 为 `null`

HTML 元素：

* `id` 返回 id 属性

* `title` 返回 title 属性

* `className` 返回 class 属性

> 还有 `lang` 和 `dir` 属性，见书 P262 。

> 各种 HTML 元素实现类型见书 P263 。

也可以通过 `getAttribute(name)` 获取属性：

```js
var div = document.getElementById("myDiv")
alert(div.getAttribute("id"))               // "myDiv"
```
根据 HTML5 规范，自定义属性应当加上 "data-" 前缀以便验证

有两个特殊属性：

* `style`

    - 用 `getAttribute()` 访问 style 属性会获得一个 CSS 文本。

    - 直接访问 style 属性，会返回一个对象。

* onclick

    - 用 `getAttribute()` 访问 onclick 属性会获得一个 js 文本。

    - 直接访问 style 属性，会返回一个函数。

设置属性用 `setAttribute(name, value)` ，不管是已有的还是未有的属性：

```js
div.setAttribute("id", "someOtherId")
```

用 `removeAttribute(name)` 移除属性

`Element` 类型有 `attributes` 属性，其类型为 `NamedNodeMap` ，和 `NodeList` 类似，具体使用见书 P266 。

用 `document.createElement(type)` 可以创建新元素：

```js
// 此时 div 设置了 ownerDocument ，但没有添加到文档树中
var div = document.createElement("div")
div.id = "myNewDiv"

// 记得添加节点
document.body.appendChild(div)
```

## Text 类型

* `nodeType` 为 3

* `nodeName` 为 `"#text"`

* `nodeValue` 为节点所包含的文本，也可以通过 data 属性访问

* `parentNode` 为一个 `Element`

设置文本：

* `appendData(text)`

* `deleteData(offset, count)`

* `insertData(offset, text)`

* `replaceData(offset, count, text)`

* `splitText(offset, count)` 将文本节点分裂为两个文本节点，同时返回后一个文本节点，可见 [Text.splitText()](https://developer.mozilla.org/zh-CN/docs/Web/API/Text/splitText)

* `substringData(offset, count)`

一般情况下，一个包含内容的元素只能拥有一个文本节点

可以用 `document.createTextNode(text)` 来创建文本节点：

```js
// 创建元素节点
var element = document.createElement("div")
element.className = "message"
// 创建文本节点
var textNode = document.createTextNode("Hello world!")
// 将 textNode 添加到 element 中
element.appendChild(textNode)
// 将 element 添加到 body 中
document.body.appendChild(element)
```

如果一个元素有多个文本节点，可以用 `nomalize` 方法来合并这些节点，和 `splitText` 操作相反。

## Comment 类型

* `nodeType` 为 8

* `nodeName` 为 `"#comment"`

* `nodeValue` 为注释的内容

`Comment` 和 `Text` 继承自相同的基类，所以拥有除 `splitText` 外的字符串属性及方法：

```html
<div id="myDiv"><!--A comment--></div>
```

```js
var div = document.getElementById("myDiv")
var comment = div.firstChild
alert(comment.data)             // "A comment"
```

注意，只有文档节点下的注释才能被获得，同时可以用 `document.createComment()` 来创建注释节点（很少用）。

## 其他类型

### CDATASection 类型

只针对 XML 文档，见书 P274 。

### DocumentType 类型

处理 doctype 标签，见书 P274 。

### DocumentFragment 类型

这类节点不会出现在 HTML 中，也不能添加到文档树，但它可以包含和控制节点。

可以用 `document.createDocumentFragment` 方法来创建。

当别的节点用 `appendChild` 等方法添加文档片段时，会将其所有子节点添加到文档中：

```html
<ul id="myList"></ul>
```

```js
var fragment = document.createDocumentFragment()
var ul = document.getElementById("myList")
var li = null

for (var i = 0; i < 3; i += 1) {
    li = document.createElement("li")
    li.appendChild(document.createTextNode("Item " + (i + 1)))
    fragment.appendChild(li)
}

// 此时 ul 会多出三个 li
ul.appendChild(fragment)
```

## Attr 类型

属性其实也是节点，但不被认为文档树的一部分。开发人员常用 `getAttribute()` 等方法，很少直接引用节点，具体见书 P277 。

这里给一个创建属性节点的样例：

```js
var attr = document.createAttribute("align")
attr.value = "left"
element.setAttributeNode(attr)
alert(element.attributes["align"].value)        // left
alert(element.getAttributeNode("align").value)  // left
alert(element.getAttribute("align"))            // left
```

## DOM 操作技术

可以这样动态地植入一个脚本：

```js
function loadScript(url) {
    var script = document.createElement("script")
    script.type = "text/javascript"
    script.src = url
    document.body.appendChild(script)
}
```

和动态脚本类似，可以这样动态的植入一个样式：

```js
function loadStyles(url) {
    var link = document.createElement("link")
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = url
    var head = document.getElementsByTagName("head")[0]
    head.appendChild(link)
}
```

表格相关的属性及操作见书 P281，这里给出一个样例：

```js
var table = document.createElement("table")
table.border = 1
table.width = "100%"

var tbody = document.createElement("tbody")
table.appendChild(tbody)

// 创建第一行
tbody.insertRow(0)
tbody.rows[0].insertCell(0)
tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell 1,1"))
tbody.rows[0].insertCell(1)
tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell 2,1"))

// 创建第二行
tbody.insertRow(1)
tbody.rows[0].insertCell(0)
tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell 1,2"))
tbody.rows[0].insertCell(1)
tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell 2,2"))
```

其实现为：

```html
<table border="1" width="100%">
    <tbody>
        <tr>
            <td>Cell 1,1</td>
            <td>Cell 2,1</td>
        </tr>
        <tr>
            <td>Cell 1,2</td>
            <td>Cell 2,2</td>
        </tr>
    </tbody>
</table>
```
