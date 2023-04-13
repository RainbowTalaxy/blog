---
tags:
  - js
sidebarDepth: 2
---

# 浏览器中的 JavaScript

浏览器中的 JS ，即 "客户端" JS ，它相对于 "服务器端" JS 。两者也常称为 "前端" 和 "后端" 。

[MDN 中文](https://developer.mozilla.org/zh-CN/) 永远是你查阅 JavaScript API 和 Web API 的靠谱全面的文档来源。

> 为了更好理解或查阅最新内容，你应当去浏览英文版本的 [MDN 英文](https://developer.mozilla.org/en-US/) 。

## Web 编程基础

### 在 HTML 中使用 JavaScript

HTML 使用 `<script>` 标签执行 JS 代码。可以在标签内直接写 JS 代码，或者提供一个 `src` 属性：

```html {5-7,9}
<head>
  <title>Use JavaScript</title>
</head>
<body>
  <script>
    // 写入代码...
  </script>

  <script src="/path/to/script.js"></script>
</body>
</html>
```

> 注意，HTML 不支持 `<script />` ，即尾标签 `</script>` 是必需的。

#### 使用模块

如果想使用 **模块** 功能，在 `<script>` 中加入 `type="module"` 属性。该属性在 Web 早期还用来指定脚本语言，比如 `type="application/javascript"`，但如今 JS 就是 Web 的默认语言，所以除非是使用模块功能，可以省略该属性。

#### 脚本运行时机

浏览器在从上往下解析 HTML 时遇到 `<script>` 元素时的默认行为是：停止解析和渲染，执行脚本，然后再继续解析。这在早期是用来通过 `document.write()` 动态生成文档内容的，但现在已经不提倡这样的阻塞式脚本执行。

可以加入 `defer` 或 `async` 属性（只能用在有 `src` 属性的脚本上）来使用别的执行策略：

* `defer` 会让浏览器把脚本的执行推迟到文档完全加载和解析之后；

* `async` 会让浏览器立即并行执行脚本，期间不会阻塞文档解析。

> 注意，`defer` 脚本会按照文档出现顺序执行。而 `async` 脚本则是不可预测的。

带有 `type="module"` 属性的脚本默认会在文档加载完毕后执行，即类似 `defer` 脚本。不过可以用 `async` 属性覆盖这一默认行为。同样的，可以将普通脚本放在文档最后，来起到和 defer 脚本类似的效果。

#### 按需加载脚本

在一些情况下，你可能希望在用户触发了某些操作后才加载执行脚本。可以编写这样的代码：

```js
function importScript(url) {
    return new Promise((resolve, reject) => {
        let s = document.createElement("script")
        s.onload = () => { resolve() }
        s.onerror = e => { reject(e) }
        s.src = url
        document.head.append(s)
    })
}
```

如果是模块脚本，也可以使用 `import()` 动态加载模块。

### 文档对象模型

客户端 JS 编程中最重要的一个对象就是 Document 对象，它代表当前要操作的 HTML 文档。用于操作 HTML 文档的 API 被称为文档对象模型 DOM（ Document Object Model ）。

HTML 文档为 **树形结构** ，依据嵌套关系来关联 HTML 元素。文档中的每个 HTML 标签都有一个对应的 Element 对象，每段文本也有对应的 Text 对象。Element、Text、Document 类都是 Node 的子类。

每个 HTML 标签都有一个对应的 JS 类。比如：

* `<body>` 标签对应一个 HTMLBodyElement 实例；

* `<table>` 标签对应一个 HTMLTableElement 实例；

* `<img>` 标签对应一个 HTMLImageElement 实例，等等 ……

### 浏览器中的全局对象

在浏览器中，全局对象不仅包含 JS 语言 API ，还有针对文档、浏览器的 Web API 。

比如有 `fetch()` 用来发送 HTTP 请求；`window.history` 属性用来控制用户的历史访问。

### 脚本的命名空间

同一文档中的所有脚本共用一个命名空间（除非该脚本是个模块，模块脚本会独自享有一个命名空间），因此在大型程序中应当考虑命名冲突发生的可能。

这样的命名空间共享存在一些历史遗留问题。比如 `var` 和 `function` 声明会在共享的全局对象上创建属性（使用 ES6 的 `let`、`const`、`class` 则不会）。

### JavaScript 程序的执行

JS 程序的执行可以分为两个阶段：

1. **脚本执行阶段** ，直接执行文档中的脚本；

2. **事件处理阶段** ，在第一个阶段中通常会进行事件的注册。

#### 客户端 JavaScript 的线程模型

JS 是 **单线程** 的语言（但不代表不支持异步编程），所以你可以肯定不会有别的线程同时修改一样东西。写 JS 代码时永远不需要关心锁、死锁、资源占用。

但是阻塞式的程序在执行时会停止响应用户输入。比如，如果脚本执行计算量大的任务，就会导致文档延迟加载，用户在脚本执行结束前将不会看到文档内容；又比如事件处理的时候执行计算密集型任务，浏览器可能变得没有响应，用户可能以为程序崩溃了。

Web 平台定义了一种受控的编程模型，即 Web 工作线程（ Web worker ）。工作线程是一个后台线程，可以在执行计算密集型任务的同时不冻结用户界面。但工作线程中的代码无权访问文档，且不会与主线程及其他线程共享任何状态，只能通过异步消息事件与别的线程通信。

#### 客户端 JavaScript 时间线

**脚本执行阶段** 和 **事件处理阶段** 两个阶段可以进一步分为下列步骤：

1. 浏览器创建 Document 对象并开始解析文档，不断向文档中添加 Element 对象和 Text 节点。此时的 `document.readyState` 为 "loading" ；

2. 解析的过程中若遇到没有 `async`、`defer`、`type="module"` 属性的 `<script>` 标签，则会同步执行该脚本（暂停解析文档）。通常这类脚本是用 `document.write()` 来动态写入文档，或者是简单定义一些函数或注册事件处理（该步骤是可以访问已经存在的文档树的）；

3. 若碰到 `async` 脚本，则会下载该脚本（如果是模块代码，依赖也会被下载），并尽快执行，同时并不会暂停对文档的解析；

4. 文档解析完成后，`document.readyState` 变为 "interactive" ；

5. 任何 `defer` 脚本（以及没有 `async` 属性的模块脚本）会按照在文档中出现的顺序执行。这一步 `defer` 脚本可以访问完整的文档；

6. 浏览器在 Document 对象上派发 "DOMContentLoaded" 事件。这标志着两个阶段的过渡；

7. 浏览器可能还在等待外部资源加载完毕或 async 脚本执行完成。都完成后 `document.readyState` 变为 "complete" ；

8. 开始对用户输入事件、网络事件、定时器事件等进行响应，异步调用事件处理程序。

### 程序输入 & 输出

客户端 JS 程序输入的来源有很多，比如：

* 文档内容本身，可以用 DOM API 访问；

* 事件形式的用户输入，比如 `<button>` 的点击事件；

* 当前 URL 可以通过 `document.URL` 获取，同时可以用 URL 构造函数提取信息；

* HTTP "Cookie" 请求头可以通过 `document.cookie` 读到；

* 全局 `navigator` 属性暴露了浏览器、操作系统等的信息；

* 全局 `screen` 属性暴露了用户显示器尺寸信息，等等 ...

而输出一般也是借助 DOM API 对文档进行操作。也可以用 `console.log()` 等方法在控制台进行输出调试。

### 程序错误

在浏览器中运行的 JS 程序不会真正 "崩溃" 。当 JS 程序运行期间发生异常，会在控制台中显示错误，但不会影响任何事件处理程序的响应及运行。

如果想定义一个终极错误处理程序，希望在出现任何未捕获异常时调用，可以把 `window.onerror` 属性设置为一个处理函数，该函数包含三个参数：错误信息、导致错误的代码 URL 字符串、文档中发生错误的行号。该函数可以通过返回 `true` 来告知浏览器已经处理了错误，不应该再显示错误信息了。

如果是 Promise 对象被拒绝且没有 `catch()` 函数处理，则可以通过定义 `window.onunhandledrejection` 函数，或者用 `window.addEventListener()` 注册 "unhandledrejection" 事件，来进行捕获处理。该函数会有个事件对象参数，事件对象会有 `promise` 和 `reason` 属性，同时可以调用 `preventDefault()` 来阻止浏览器后期的操作（在控制台输出错误信息）。

> 上述的错误处理在开发中经常不是必需的，不过可以通过这些方式将错误信息发送给服务器。

### Web 安全模型

由于网页可以在私人设备上任意执行 JS 代码，存在明显的安全隐患。

#### JS 不能做什么

客户端 JS 不能向计算机中写入删除文件，也不能展示文件目录。这意味着 JS 程序不能删除数据，也不能植入病毒。

客户端 JS 没有通用网络能力，只能发送 HTTP 请求以及 WebSocket 通信。

#### 同源策略

源即文档的源，它包含文档 URL 的协议、主机、端口。对于两个源，只要三个部分有一个不同即为不同源。对于服务器上的文件，浏览器会把每个 `file:URL` 看作一个独立的源。

有一点非常重要，就是脚本自身的源与同源策略不相关，相关的是包含脚本的文档的源。比如主机 A 的网页包含了一个主机 B 上的脚本，则该脚本的源是主机 A ，该脚本对包含它的文档具有完全访问权。如果文档中嵌入的 `<iframe>` 包含另一个来自主机 A 的文档，则该脚本同样拥有对这个文档的完全访问权。但是如果来源是主机 C （或甚至是主机 B ），则同源策略就会起作用，阻止脚本访问这个嵌入的文档。

同源策略也会应用到脚本发起的 HTTP 请求。JS 代码可以向托管其包含文档的服务器发送任意 HTTP 请求，但不能与其它服务器通信（除非那些服务器开启了 CORS ）。

同源策略对使用多子域的大型网站造成的麻烦，不过脚本可以通过 `document.domain` 修改源；或者采用跨源资源共享（ Cross-Origin Resource Sharing ，CORS ），它允许服务器决定对哪些源提供服务。

更多可见 [浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy) 以及 [跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) 。

#### 跨站点脚本

跨站点脚本（ Cross-Site Scripting ，XSS ）是一种攻击方式，指攻击者向目标网站注入 HTML 标签或脚本。

比如这个例子中，客户端脚本根据 URL 的 `name` 参数生成文档内容。攻击者可以通过将 HTML 文本作为 `name` 参数，间接将内容注入到文档中：

```html
<h1></h1>
<script>
  let name = new URL(document.URL).searchParams.get("name")
  document.querySeletor("h1").innerHTML = "Hello " + name
</script>
```

还有一种情况是，用户点击了恶意链接，然后导航到了目标网站，此时恶意链接的文档脚本可以随意操纵目标网站，甚至获取 cookie（它可能包含用户数据）。

防止 XSS 攻击的办法是从不可信数据中删除 HTML 标签，然后再使用它去动态创建文档内容。另一种解决思路是让自己的 Web 应用在使用 `<iframe>` 时显示不可信内容，并将这个 `<iframe>` 的 sandbox 属性设置为禁用脚本和其他能力。更多可见 [从对象到 iframe - 其他嵌入技术](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Other_embedding_technologies) 。

## 事件

客户端 JS 程序使用异步事件驱动的编程模型，它会等待用户触发事件然后给出响应。事件可以在 HTML 文档中的任何元素上发生。以下是一些重要的定义：

* **事件类型** 是一个字符串，表示发生了什么事件。比如 "mousemove" 表示用户移动了鼠标；

* **事件目标** 是一个对象，而事件就发生在该对象上，或者与之有关；

* **事件处理程序**（或 **事件监听器** ）是一个函数，负责处理或响应事件；

* **事件对象** 包含事件自身的信息，它会作为事件处理程序的参数传入；

* **事件传播** 是一个过程，浏览器会决定在该过程中对哪些对象触发事件。比如事件冒泡和捕获；

### 事件类别

> 所有事件可见 [事件参考 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/Events) 。

#### 设备相关输入事件

这类事件与输入设备（如键盘鼠标等）有关，包括 "mousedown" "mousemove" "mouseup" "touchstart" "touchmove" "touchend" "keydown" "keyup" 等等。

#### 设备无关输入事件

这类事件并不与输入设备直接相关。比如 "click" 表示一个链接或按钮被点击，但不一定是鼠标触发的。同样的 "input" 事件与键盘无关，"pointerdown" "pointermove" "pointerup" 既适用于鼠标指针也适用于触屏。

#### 用户界面事件

UI 事件是高级事件，通常在 HTML 表单元素上触发。比如 "focus"（当表单元素获得键盘焦点时）、"change"（当用户修改了表单元素的值）、"submit"（当用户点击表单中的 "提交" 按钮）。

#### 状态变化事件

这类事件不直接由用户触发，而是由网络或浏览器活动触发。比如 Window 和 Document 对象在文档加载结束时触发的 "load" 和 "DOMContentLoaded" 事件。浏览器会在网络连接变化时触发 "online" 或 "offline" 事件。

#### API 特定事件

Web API 中包含的事件。比如 HTML 的 `<video>` 和 `<audio>` 定义了一系列事件，比如 "waiting" "playing" "seeking" "volumechange" 等等。

### 注册事件处理程序

#### 在 JS 中设置事件处理属性

将事件目标的一个事件处理属性设置为事件处理函数。这类属性名通常为 "on" 加上事件类型。比如 `onclick`、`onchange`、`onload` 等等：

```js
window.onload = function() {
    let form = document.querySelector("form#shipping")
    form.onsubmit = function(event) {
        if (!isFormValid(this)) {
            event.preventDefault()    // 阻止默认行为（即提交表单）
        }
    }
}
```

这种注册方式有个缺点，即只能注册一个事件处理程序。

#### 在 HTML 中设置事件处理属性

该方式与前者类似，只是将属性写在 HTML 标签中，属性值应当为函数体内容：

```html
<button onclick="console.log('Thank you!')">Please Click</button>
```

浏览器会根据属性值转为一个函数，这个函数类似于：

```js
function(event) {
    with(document) {
        with(this.form || {}) {
            with(this) {
                /* 标签中的代码 */
            }
        }
    }
}
```

#### addEventListener()

可以在事件目标对象上使用 `addEventListener()` 方法，且可以多次为同一个事件类型注册事件处理程序。其中，第一个参数为字符串，即事件类型（事件名称）；第二个参数为事件处理函数；第三个为可选，如果传入布尔值，则表示是否注册为捕获事件处理程序，或者传入一个选项对象：

```js
document.addEventListener("click", handleClick, {
    capture: true,
    once: true,
    passive: true
})
```

选项对象的各属性作用如下：

* **`capture`** 与前文直接传入布尔值一致，是否注册为捕获事件处理程序；

* **`once`** 是否只触发一次，然后自动移除该事件监听器；

* **`passive`** 如果为 `true` ，则表示事件处理程序永远不调用 `preventDefault()` 。

同样地，可以用 `removeEventListener()` 来移除事件监听器，同样可以传入三个参数。

### 调用事件处理程序

#### 事件处理程序的参数

事件处理程序被调用时会接收到一个 Event 对象作为唯一的参数，它有如下属性信息：

* **`type`** 事件类型；

* **`target`** 发生事件的目标对象；

* **`currentTarget`** 对于传播的事件，该属性是注册当前事件处理程序的对象；

* **`timeStamp`** 表示事件发生时间的时间戳，非绝对时间；

* **`isTrusted`** 表示该事件是否由浏览器自身派发，即是否可信任。

#### 事件处理程序的上下文

不管是直接设置事件属性，还是使用 `addEventListener()` 注册，事件处理程序被调用时会将事件目标作为 `this` 值（除了箭头函数依然继承上层作用域的 `this` 值）。

#### 处理程序的返回值

在早期会通过返回 `false` 来阻止浏览器的默认动作。而目前应当使用 Event 对象的 `preventDefault()` 方法，且不应该返回值。

#### 调用顺序

如果一个事件注册了多个处理程序，不管是直接设置事件属性，还是使用 `addEventListener()` 注册，都会按照注册的顺序进行调用。

### 事件传播

如果事件目标是 Window 或其他独立对象，浏览器对其事件的响应就是简单调用对应的事件处理程序。

如果事件目标是 Document 或其他文档元素，在事件处理程序被调用后，多数事件都会沿着 DOM 树向上 "冒泡" ，即目标父元素的对应事件处理程序会被调用。就这样一直向上到 Document 对象，然后到 Window 对象。

由于事件冒泡，我们可以不用单独为具有公共祖先的元素分别注册事件，而是直接在其公共祖先上注册事件（有的地方称之为事件委托）。比如，可以在 `<form>` 元素上注册 "change" 事件，而不是在表单的每个元素上都注册 "change" 事件。

多数事件都会冒泡，但也有例外，明显的有 "scroll" "blur" "focus" 等事件。文档元素的 "load" 会到 Document 对象上停止冒泡，即不会传到 Window 对象（ Window 对象的 "load" 事件只会在整个文档加载完成后触发）。

事件传播的各阶段：

1. **捕获阶段** 。该阶段与 "冒泡" 相反，会从 Window 对象沿 DOM 树向下到目标对象。期间事件选项参数 `capture` 为 `true` 的注册事件会被调用；

2. **调用阶段** 。该阶段直接调用目标对象的事件处理程序；

3. **冒泡阶段** 。

事件捕获提供了把事件发送到目标之前先行处理的机会。

### 事件取消

如果是取消事件的默认执行，比如点击一个链接的默认行为为跳转，可以用 Event 对象的 `preventDefault()` 方法（注册事件的选项参数 `passive` 应当不为 `true` ）。

如果是取消事件传播，可以调用 Event 对象的 `stopPropagation()` 方法，它可以用在事件传播的各阶段。

### 派发自定义事件

可以用 `CustomEvent()` 构造函数创建一个自定义事件对象。第一个参数为事件类型，第二个为事件属性对象。接着可以用事件目标对象的 `dispatchEvent()` 方法主动派发事件，并将自定义事件对象作为参数传入：

```js
// 派发一个事件，通知 UI 正在等待网络请求
document.dispatchEvent(new CustomEvent("busy", { detail: true }))

fetch(url)
    .then(handleNetworkResponse)
    .catch(handleNetworkError)
    .finally(() => {
        // 派发一个事件，通知 UI 网络请求结束
        document.dispatchEvent(new CustomEvent("busy", { detail: false }))
    })

document.addEventListener("busy", event => {
    event.detail ? showSpinner() : hideSpinner()
})
```

## 操作 DOM

客户端 JS 存在的目的就是把 HTML 文档转为交互式 Web 应用，即通过脚本来操作网页内容。

### 选择 Document 元素

全局 `document` 属性引用 Document 对象，而 Document 对象有 `head` 和 `body` 属性，分别对应文档中的 `<head>` 和 `<body>` 对应的 Element 对象。而其他元素对象可以用几种方式获取。

#### 通过 CSS 选择器选择元素

对于 Document 和 Element 对象，可以用 `querySelector()` 和 `querySelectorAll()` 选择 **子元素** ，参数为选择器字符串。其中前者返回元素对象或者 `null` ，后者返回 NodeList 对象。NodeList 是个类数组类型，它是个可迭代对象，可以用 for-of 迭代。

对于 `::first-line` 和 `::first-letter` 这样的伪元素，两种方法是找不到的。同样，很多浏览器拒绝为 `:link` 和 `:visited` 伪类返回匹配结果，因为这有可能暴露用户的浏览历史。

Element 类还定义了 `closest()` 方法，与前两种方法相反，它是往父级查找，即沿 DOM 树向上查找。还有 `matches()` 方法，检查当前元素是否匹配指定选择器。

#### 其他选择元素的方法

DOM 还有一些传统的元素选择方法：

* `document.getElementById()` 通过 id 属性查找元素；

* `document.getElementsByName()` 通过 name 属性查找元素；

* `document.getElementsByTagName()` 通过标签类型查找元素；

* `document.getElementsByClassName()` 通过包含类名查找元素；

除了第一个返回一个 Element 对象，其余均返回 NodeList 对象。与 `querySelectorAll()` 不同的是，传统方法返回的 NodeList 是活的，即其内容会随文档内容变化。

#### 预选择的元素

Document 类还定义了一些快捷属性，比如 `images`、`forms`、`links` 属性可以直接访问文档中的 `<img>`、`<form>`、`<a>` 元素。这些属性引用的是 HTMLCollection 对象，与 NodeList 对象类似。比如可以用 `document.forms.address` 属性访问 `<form id="address">` 。

### 文档结构 & 遍历

Element 类定义了这些属性，可以引用元素相关的元素：

* `children` 子元素（仅包含 Element 节点），类型为 NodeList ；

* `childElementCount` 子元素个数，与 `children.length` 返回值相同；

* `firstElementChild`、`lastElementChild` 第一个、最后一个子元素；

* `previousElementSibling`、`nextElementSibling` 左侧、右侧紧邻的同辈元素。

> 更多相关 Element 类见 [Element - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 。

#### 作为节点树的文档

> Element 类实现了 Node 接口。各种类型的 DOM API 对象也会从这个接口继承。

如果在遍历过程中不想忽略 Text 节点等，可以使用在 Node 接口上定义的属性：

* `parentNode` 父节点，可以是 Element 或 Document 对象；

* `childNodes `子节点（不仅仅是 Element 节点）；

* `firstChild`、`lastChild`、`previousSibling`、`nextSibling` ；

* `nodeType` 节点类型的数值。Document 为 9 ，Element 为 1 ，Text 为 3 ，Comment 为 8 ；

* `nodeValue` Text 或 Comment 节点的文本内容；

* `nodeName` Element 节点的 HTML 标签名，完全大写。

> 更多相关 Node 接口见 [Node - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Node) 。

> 这套 API 对文档中的文本变化极为敏感，一个换行符都可以产生一个 Text 节点。

### 标签属性

HTML 元素由标签名和一组属性键值对构成。Element 类定义了一些属性方法：`getAttribute()`、`setAttribute()`、`hasAttribute()`、`removeAttribute()` 。无法用 delete 操作符直接删除标签属性。

同时，Element 对象自身也会有相应属性（仅包含 HTML 元素的标准属性，不包含自定义属性），比如：

```js
let image = document.querySelector("#main_image")
let url = image.src
image.id === "main_image"   // => true
```

有些 HTML 属性名会映射到不同的 JS 属性。比如 `<input>` 元素的 `value` 属性会映射到 JS 的 `defaultValue` ，而 JS 中的 `value` 代表 `<input>` 中用户输入的值。

HTML 属性不区分大小写，但 JS 中区分大小写。一般 HTML 到 JS 属性的对应规则为全部小写。如果属性名包含多个单词，则首字母大写，比如 `tabIndex`、`defaultChecked` 等。不过事件处理程序属性除外，比如 `onclick` 等，需要全部小写。

如果属性名是保留字，需要加前缀 "html" ，比如 `<label>` 元素的 `for` 属性对应到 JS 中的 `htmlFor` 。不过有个例外是，`class` 属性会对应为 `className` 。

#### class 属性

JS 中 `className` 是一个字符串值，而一般 `class` 属性是一个 CSS 类名的列表，因此使用 `className` 可能不好用。为此，Element 类定义了 `classList` 属性，它是一个可迭代的类数组对象。定义了 `add()`、`remove()`、`contains()`、`toggle()` 方法来处理类名。

#### dataset 属性

HTML 标签中带有 "data-" 前缀的小写属性都被认为是有效的，它会映射到 JS 元素对象的 dataset 属性。且连字符分隔的属性会被映射为驼峰属性名，比如：

假设 HTML 文档包含以下内容：

```html
<h2 id="title" data-section-number="15.3.3">Attributes</h2>
```

则可以这样访问元素的章节号：

```js
let number = document.querySelector("#title").dataset.sectionNumber
```

### 元素内容

#### HTML 标记本文

Element 类上定义了 `innerHTML` 和 `outerHTML` 属性，分别返回子元素的 HTML 文本和自身的 HTML 文本。比如对于 `<h1>Hello</h1>` ，它的 `innerHTML` 为 "Hello" ，`outerHTML` 为 "\<h1>Hello\</h1>" 。

直接设置 `innerHTML` 的效率通常很高，但是使用 `+=` 操作符追加内容的效率不高。

切记一定 **不要直接将用户的输入内容直接插入文档中** ，恶意用户会将脚本插入你的应用。

Element 类还有一个 `insertAdjacentHTML()` 方法，它可以在目标 HTML 标记文本上的指定位置插入任意 HTML 标记文本。第一个参数是插入的位置，可以是 "beforebegin" "afterbegin" "beforeend" "afterend" ，他们分别代表 HTML 元素的开始标签的左右端位置和结束标签的左右端位置；第二个参数是要插入的 HTML 标记文本。

#### 纯文本内容

有时我们想获取或者设置元素的纯文本内容（同时也能避免转义问题），可以使用 Node 接口定义的 `textContent` 属性。

Element 类还定义了一个 `innerText` 属性，与 `textContent` 类似，但存在浏览器兼容性问题等，不应该使用这个属性。

> 由于浏览器永远不会显示 `<script>` 的内容，而在 JS 中脚本元素会有个对应的 text 属性表示其文本内容。可以在 HTML 中设置脚本元素的 type 为某个值（比如 `text/x-custom-data` ），来明确它不是可执行的代码，此时脚本元素就充当了摆放文本内容的理想容器。

### 创建、插入、删除节点

使用 Document 类的 `createElement()` 方法创建一个元素对象。使用 Element 类的 `append()` 和 `prepend()` 方法可以在元素中尾插或前插多个文本、元素：

```js
let paragraph = document.createElement("p")
let emphasis = document.createElement("em")
emphasis.append("World")          // 字符串会转为 Text 节点，下同
paragraph.append(emphasis, "!")   // 两方法均能传入多个文本、元素
paragraph.prepend("Hello ")       // 文本节点也可以通过 document.createTextNode() 创建
paragraph.innerHTML               // => "Hello <em>World</em>!"
```

如果想要在元素的隔壁（非元素内）插入节点，可以用 Element 及 Text 类上定义的 `before()` 和 `after()` 方法。

一个元素只能有一个位置。如果你再次将元素插入另一个位置，则旧位置不会显示该元素。如果想复制一个元素，可以用 `cloneNode()` 方法。

Element 及 Text 节点可以使用 `remove()` 来将自己从文档中删除，或者用 `replaceWith()` 用另一个节点替代。

> Node 接口上也定义了一组插入删除的老一代方法，比如 `appendChild()`、`insertBefore()` 等，但会比上述的方法难用。

## 操作 CSS

### CSS 设置

最简单的，可以改变 HTML 元素的 `class` 属性来改变样式，即改变 Element 对象的 `classList` 属性。

或者可以设置 HTML 元素的行内样式，对应的，Element 类上定义了 `style` 属性，该属性是个 CSSStyleDeclaration 对象。CSS 属性采用连字符拼接命名，对应地在 JS 中应当相应改为驼峰命名：

```js
e.style.display = "block"
e.style.fontFamily = "sans-serif"
e.style.backgroundColor = "#ffffff"
```

> 样式属性值应当始终是字符串，必要时记得加上单位。

如果想获取纯字符串的行内样式，可以用 Element 定义的 `getAttribute()` 和 `setAttribute()` 方法，或者直接使用 CSSStyleDeclaration 对象的 `cssText` 属性：

```js
// 把元素 e 的行内样式赋值给元素 f
f.setAttribute("style", e.getAttribute("style"))
// 也可以这样做
f.style.cssText = e.style.cssText
```

### 计算样式

元素的计算样式（ computed style ）是浏览器根据样式表及元素的行内样式所导出的一组属性值，浏览器实际上会使用这组属性值来显示该元素。

使用 Window 对象的 `getComputedStyle()` 方法获取一个元素的计算样式。第一个参数为元素，可选的第二个参数用于指定一个伪元素。它同样返回一个 CSSStyleDeclaration 对象：

```js
let title = document.querySelector("#title")
let style = window.getComputedStyle(title)
let beforeStyle = window.getComputedStyle(title, "::before")
```

计算样式的 CSSStyleDeclaration 对象与行内样式的有一些重要区别：

* 计算样式的属性是只读的；

* 计算样式的属性是绝对值，即百分数等相对单位会转为像素单位（但依然会有 "px" 后缀）；

* 简写属性不会被计算（即 `border`、`margin` 等），只能查询基础属性；

* 计算样式的 `cssText` 属性是 `undefined` 。

> 查询元素的计算样式并非确定该元素大小和位置的理想方式。

### 操作样式表

`<style>` 和 `<link>` 都是标准的 HTML 元素，可以为其指定 `id` 属性，然后在 JS 中选择该元素。这两个标签对应的 Element 对象都有 `disabled` 属性，表示是否禁用样式表。

这两类元素对象可以使用 `sheet` 属性，它返回一个 CSSStyleSheet 对象。更多操作见 [CSS Object Model - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Object_Model) 及 [CSSStyleSheet - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet) 。

### CSS 动画与事件

#### Transition 动画

在 JS 中可以通过改变元素的 `class` 来触发 CSS 过渡动画（通常需要指定好 `transition` 属性）。

JS 也可以监控过渡动画的进度。浏览器会以发生动画的元素作为事件目标，派发 TransitionEvent 事件对象：

1. 浏览器先派发 "transitionrun" 事件，此时动画还没开始；

2. 接着派发 "transitionstart" 事件，同时动画开始；

3. 动画完成时会派发 "transitionend" 事件。

TransitionEvent 对象的 `propertyName` 属性为发生动画的 CSS 属性，`elapsedTime` 属性为从 "transitionstart" 事件开始经历的秒数。

#### Animation 动画

对于使用 `animation` 属性和 `@keyframe` 规则的 CSS 动画，JS 同样可以进行触发和监听。不同的是：

* 事件对象类型为 AnimationEvent ；

* 事件对象会派发 "animationrun"、"animationstart"、"animationend" 事件；

* 事件对象的 `animationName` 属性为定义动画的 `animation-name` 属性，`elapsedTime` 属性则同样表示动画发生秒数。

## 文档几何与滚动

### 文档坐标 & 视口坐标

**文档坐标** 即元素相对于整个文档的位置，坐标原点为文档的左上角；**视口坐标** 即元素相对于视口（ viewport ，或称为视窗，即浏览器窗口中实际显示文档的区域）的位置，坐标原点也为左上角。对于 `<iframe>` 元素，它会自己定义自己的视口。

如果文档比视口大，则文档一般可上下滚动。同时实现两坐标系的转换，需要算上滚动位移。

一般 **文档坐标并不适合网页** 。比如，CSS 的 `overflow` 属性允许元素包含比它能显示的更多的内容；元素也可以有自己的滚动条。同时，客户端 JS 更多地会使用视口坐标。比如，Element 的 `getBoundingClientRect()` 方法和 `document.elementFromPoint()` 使用的就是视口坐标；鼠标和指针的事件对象的 `clientX` 和 `clientY` 也是使用视口坐标。

对于 CSS 中的 `position` 定位：

* 如果为 `fixed` ，则 `top` 和 `left` 属性会使用视口坐标；

* 如果为 `relative` ，则会相对于原来的位置；

* 如果为 `absolute` ，则会相对于文档或包含它的元素。

> CSS 中的像素（或称为软件像素）与设备像素并非一致，一个软件像素可能对应多个设备像素。Window 对象的 `devicePixelRatio` 属性则表示设备像素与软件像素的比值，该值取决于硬件的物理分辨率、操作系统的设置、浏览器的缩放比例。

### 查询元素的几何大小

调用 Element 上的 `getBoundingClientRect()` 可以获取元素的几何大小（包括 CSS 边框、内边距，但不包括外边距）及视口中的位置。它会返回一个 DOMRect 对象，它包含 `left`、`right`、`top`、`bottom`、`width`、`height` 属性。

块级元素（如图片、段落、`<div>` 元素）在浏览器中始终为矩形，而行内元素（如 `<span>`、`<b>`、`<code>` 等元素）则可能跨行，因而包含多个矩形。`getBoundingClientRect()` 则会合计这些矩形的宽度。如果想查询各个矩形的几何信息，则可以调用 `getClientRects()` 方法，它返回一个类数组对象，数组元素则为几何信息。

### 确定位于某一点的元素

调用 Document 对象的 `elementFromPoint()` 方法可以获取给定位置上的元素，传入的参数为视口坐标的 x 和 y 值。选择元素的碰撞检测算法没有明确规定，但该方法意图是获取嵌套最深、最外层（最大的 CSS 的 `z-index` 属性）的元素。

### 滚动

Window 对象的 `scrollTo()` 和 `scrollBy()` 方法可以用来滚动网页，均传入坐标 x 和 y 值。前者为绝对位置（使用文档坐标）滚动，后者则相对当前位置滚动。

> 如果要移动的位置太接近文档底部或右侧，浏览器则会尽可能让视口左上角接近这个点，但不会真的移动到该点。

如果想要平滑滚动，则需要传入一个 ScrollToOptions 选项对象，而不是两个数值：

```js
window.scrollTo({
    left: 0,
    top: documentHeight - viewportHeight,
    behavior: "smooth"
})
```

如果想要滚动到某个元素在视口中可见，可以在相应元素上调用 `scrollIntoView()` 方法。参数可以是：

* 一个布尔值。如果为 `true` ，则尽量让元素的上边对齐视口上沿；否则，尽量让元素底边与视口下沿对齐；

* 一个选项对象。`behavior` 属性指定平滑滚动；`block` 和 `inline` 属性指定垂直和水平方向上如何定位，有效值包括 "start"、"end"、"nearest"、"center" 。

> 实际上，Element 也定义了 `scrollTo()` 和 `scrollBy()` 方法。

### 视口大小、内容大小、滚动位置

> 下述的属性基本为 **只写** 。

视口大小可以通过 `window.innerWidth` 和 `window.innerHeight` 获取。针对移动设备优化的网页通常会在 `<head>` 中使用 `<meta name="viewport">` 设置想要的视窗宽度。

文档的整体大小与 `<html>` 元素（即 `document.documentElement` ）大小相同。获取文档大小，可以调用 `document.documentElement` 的 `getBoundingClientRect()` 方法，或者直接访问其 `offsetWidth` 和 `offsetHeight` 属性。

文档在视口中的滚动位置可以通过 `window.scrollX` 和 `window.scrollY` 获取。

Element 类上也定义了一些位置属性（基本均为 **只写** ）：

* `offsetWidth`、`offsetHeight` 返回元素的 CSS 像素大小（包括边框及内边距，不包括外边距）；

* `offsetLeft`、`offsetTop` 返回元素相对文档或所在父元素的位置坐标；

* `offsetParent` 返回前述坐标相对于哪个元素；

* `clientWidth`、`clientHeight` 包含内边距，但不包含边框和外边距；

* `clientLeft`、`clientTop` 为内边距外沿到边框外沿的水平和垂直距离；

* `scrollWidth`、`scrollHeight` 为元素内容加上内边距，再加上溢出内容的大小；

* `scrollLeft`、`scrollTop` 为元素内容在元素视口中的滚动位移，两属性可写。

## Web 组件

无笔记，仅作了解。

## SVG

无笔记，仅作了解。

## <canvas\> 与图形

无笔记，仅作了解。

## Audio API

无笔记，仅作了解。

## 位置、导航、历史

未来再补笔记。

## 网络

JS 中网络相关的 API 有：

* 基于 Promise 的 `fetch()` 方法；

* SSE（ Server-Send Event ，服务器发送事件），用来保持与服务器的连接；

* WebSocket ，它是一个网络协议，客户端与服务器可以通过类似 TCP 方式相互发送消息。

### fetch()



### 服务器发送事件



### WebSocket



## 存储

Web 应用可以使用浏览器 API 在用户计算机本地上存储数据，有这几种形式：

* Web Storage API ，包括 `localStorage` 和 `sessionStorage` ，适合存储大量数据；

* Cookie ，是一种古老且笨拙的 API ，是专门为服务端脚本使用而设计的，只适合保存少量数据；

* IndexedDB ，是一种异步 API ，可以访问支持索引的对象数据库。

> 任何形式的存储技术都不应该用来保存密码、账务账号等用户敏感信息。

### localStorage & sessionStorage

Window 对象的 `localStorage` 和 `sessionStorage` 属性引用的是 Storage 对象：

* Storage 对象的属性值必须是字符串（别的类型需手动编码解码）；

* Storage 对象中存储的属性是持久化的；

* 可用 for-in 语句或 `Object.keys()` 枚举 Storage 对象的属性；

* 可以直接访问和删除（使用 delete 操作符）属性；

* 上条可用 `getItem()`、`setItem()`、`deleteItem()` 代替。`clear()` 方法删除所有属性。

#### 存储的生命期和作用域

`localStorage` 和 `sessionStorage` 的差异体现在生命期和作用域上。

`localStorage` 存储的数据是永久性的，而 `sessionStorage` 会随着标签页关闭而删除（不过现代浏览器可以再次打开最近关闭的标签页并恢复用户上次浏览的会话，`sessionStorage` 也会被恢复）。

同源文档共享相同的 `localStorage` 数据，非同源的数据相互之间是隔离的。但不同的浏览器之间不会共享 `localStorage` 数据；而 `sessionStorage` 会在标签页之间隔离，即便是同源文档。

#### 存储事件

当存储在 Storage 对象的数据发生变化时，会对当前所有同源文档触发 Window 对象的 "storage" 事件。可以使用 `window.onstorage` ，或对 Window 对象注册 "storage" 事件。

"storage" 的事件对象的属性如下：

* **`key`** 写入或删除的键。如果是调用 `clear()` 方法则为 `null` ；

* **`newValue`** 保存的新值（如果有）。如果是删除了属性，则该属性不存在；

* **`oldValue`** 被修改或删除的旧值。如果添加了新属性，则该属性不存在；

* **`storageArea`** 变化的 Storage 对象。通常是 `localStorage` ；

* **`url`** 发生此次存储变化的所在文档的 URL（字符串）。

"storage" 事件可以作为一种广播机制，即浏览器向所有当前浏览同一网站的标签页发送消息。

### cookie

cookie 是为服务器编程而设计的，作为 HTTP 协议的扩展实现。cookie 只能保存少量数据，且会自动在浏览器与 Web 服务器之间传输。

#### 读取 cookie

通过 `document.cookie` 读取 cookie 。它是一个字符串，多个键值对以分号隔开，键值对以等号连接。

#### cookie 的生命期与作用域

cookie 默认的生命期很短，只在浏览器会话期间存在。但可以指定 cookie 的 `max-age` 属性（单位为秒）来设定多长时间过期。

cookie 的可见性又文档来源决定，也由文档路径决定。默认情况下，创建 cookie 的网页，以及与该网页位于相同目录及子目录的网页都可以访问 cookie 。但也可以手动设置 cookie 的 `path` 和 `domain` 属性来指定作用域。

cookie 还可以设定 `secure` 属性，这样 cookie 只能在 HTTPS 上传输。

#### 存储 cookie

键值对依然以等号连接，键值对之间用分号隔开。保存在 `document.cookie` 中。

cookie 自身属性同样写在 cookie 中。`secure` 属性则只需要在末尾添加 ";secure" 即可。

### IndexedDB

IndexedDB 是一种可以让你在用户的浏览器内持久化存储大量数据的方法。它使用索引的方式来存储或访问对象。所有数据库的变动都会以事务（ transaction ）的形式发生。

IndexedDB 同样使用同源策略，不同域名间的数据相互隔离。

#### 关键要点

* IndexedDB 存储的是键值对；

* IndexedDB 是基于事务数据库模型的；

* IndexedDB API 中大部分是异步调用的；

* IndexedDB 采取请求的方式访问数据，并不使用 SQL 语言；

* IndexedDB 使用 DOM 事件来告知你请求的数据可用了；

* IndexedDB 是面向对象的；

* IndexedDB 遵循同源策略。

#### 限制

一些情况下可能不适合使用 IndexedDB ：

* 国际化排序 internationalized sorting（?）；

* 同步；

* 全文搜索。

此外，还要注意浏览器可能会在这些情况下清除数据：

* 用户通过浏览器设置清楚网站数据（包括 cookie、书签、密码、IndexedDB 数据等）；

* 浏览器处于隐私浏览模式（或者叫 "无痕浏览" ）；

* 存储空间限制；

* 数据冲突；

* 由于浏览器的不兼容的改动。

## 工作线程 & 消息传递

## 参考

[<script\> - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script)

[Element - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)

[Text - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Text)

[DOM 概述 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)

[浏览器的同源策略 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

[跨源资源共享（CORS）- MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

[Cross-site scripting（跨站脚本攻击）- MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Cross-site_scripting)

[Cross-site scripting - Wikipedia](https://en.wikipedia.org/wiki/Cross-site_scripting)

[从对象到 iframe - 其他嵌入技术 - MDN](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Other_embedding_technologies)

[事件介绍 - MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events)

[CustomEvent - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)

[Node - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)

[CSS Object Model - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Object_Model)

[CSSStyleSheet - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet)

[IndexedDB - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)

[IndexedDB 的基本概念（英文）- MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Terminology)

[使用 IndexedDB - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)
