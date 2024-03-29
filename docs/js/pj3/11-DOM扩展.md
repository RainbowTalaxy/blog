# DOM扩展

## 选择符 API

Selector API 的核心是 `querySelector` 和 `querySelectorAll` 方法，可以用 `Document` 和 `Element` 的实例去调用。

## querySelector 方法

```js
// 获取 body 元素
var body = document.querySelector("body");

// 获取 id 为 "myDiv" 的元素
var myDiv = document.querySelector("#myDiv");

// 获取 class 为 "selected" 的元素
var selected = document.querySelector(".selected");

// 获取 class 为 button 的第一个 img 元素
var img = document.body.querySelector("img.button");
```

## querySelectorAll 方法

返回所有符合匹配的元素，且为 `NodeList` 实例，可以通过 `Document`、`Element`、`DocumentFragment` 实例进行调用。

可以用 `item` 方法或者下标语法获得元素。

## 元素遍历

对于元素中的间隔，大部分浏览器都会转为文本节点，会干扰节点的使用，可以用以下方法代替之前的元素调用：

* `childElementCount`

* `firstElementChild`，`lastElementChild`

* `previousElementSibling`，`nextElementSibling`

## HTML5

### getElementsByClassName 方法

该方法接受一个字符串，返回所有指定的元素：

```js
// 返回类为 "username current" 的元素
var allCurrentUsernames = document.getElementsbyClassName("username current")

// 返回 id 为 myDiv 的元素中所有类为 "selected" 的元素
var selected = document.getElementById("myDiv").getElementbyClassName("selected")
```

### classList 属性

可以用 `item` 或者下标方法访问元素的类名，同时可以操作类名：

* `add(value)`

* `contains(value)`

* `remove(value)`

* `toggle(value)` 如果元素中有这个类则删除，反之添加

### 焦点管理

可以用通过 `document.activeElement` 属性来获取当前获得焦点的元素，元素获得焦点的方式有：

* 页面加载完默认是 `body` 的引用，加载中则为 `null`

* 用户输入（通常是通过按 Tab 键）

* 代码中调用 `focus` 方法

可以用 `hasFocus` 方法来检测文档是否获得了焦点

### HTMLDoucment 的变化

1. `readState` 属性

    该属性有两个值

    - `loading` 正在加载文档

    - `complete` 已经加载完文档

2. `compatMode` 属性

    该属性可获得页面的渲染方式

3. `head` 属性

    和 `body` 一致，Chrome 和 Safari 支持这一属性

### 字符集属性

可以用 charset 属性获得文档中使用的字符集，默认是 UTF-16 ，但可以通过 `<meta>` 元素、响应头设置字符集。

可以用 `defaultCharset` 获得浏览器或操作系统的默认字符集。

### 自定义数据属性

可以为元素添加非标准的属性，但要加上 "data-" 前缀：

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

可以通过 dataset 属性调用非标准属性的方法：

```js
var div = document.getElementById("myDiv")
var appId = div.dataset.appId
div.dataset.myname = "Michael"
```

### 插入标记

可以用元素的 `innerHTML` 属性直接访问及设置子节点，比如：

```html
<div id="content">Hello World</div>
```

可以这样获得 `div` 的子节点：

```js
// 注意，有些浏览器可能会把标签转为大写
alert(div.innerHTML)    // "Hello World"
```

可以这样设置 `div` 的子节点：

```js
// 注意转义问题
// 大部分情况下 <script> 都会无效
div.innerHTML = "<p>Hello World</p>"
```

> 不支持 `innerHTML` 的标签元素见书 P295 。

可以用 `outerHTML` 属性获取包括自身的节点树（比 `innerHTML` 高一级）。

可以用 `insertAdjacentHTML` 方法插入 HTML 文本，接受两个参数：

* `position` ，为以下四种值

    - `"beforebegin"` 在当前元素之前插入

    - `"afterbegin"` 在当前元素下开头插入

    - `"beforeend"` 在当前元素下末尾插入

    - `"afterend"` 在当前元素之后插入

* `text` ，为 HTML 文本

合理控制设置 `innerHTML` 和 `outerHTML` 等的次数，此操作会导致内存占用问题

### scrollIntoView 方法

可以用该方法将页面中某个元素滚动到显示区域，具体见 [scrollIntoView](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView) 。

为某个元素设置焦点也会导致啊浏览器滚动到焦点位置。

## 专有拓展

建议在使用专有拓展之间先检查是否客户端浏览器是否支持。

### 文档模式

限 IE ，具体见书 P298 。

## children 属性

和 `childNodes` 几乎相同，大部分浏览器都支持这一属性。

## contains 方法

可以用该方法判断一个节点是不是另一个节点的后代，大部分浏览器支持。

也可以用 `compareDocumentPosition` 方法来判断与另一个元素之前的关系，返回值有：

* `1` 无关

* `2` 居前

* `4` 居后

* `8` 包含

* `16` 被包含

## textContent 属性

可以用该属性获得元素的文本内容，如果元素中有多个子节点，则连同子节点中的文本一同拼接返回值。

也可以设置元素的文本内容，但原有的所有子节点都会删除。

## 滚动

一些其他的页面滚动方式（限 Safari 和 Chrome）见书 P303 。