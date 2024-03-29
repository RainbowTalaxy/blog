# BOM 浏览器对象模型

## window 对象

在浏览器中，`window` 既是浏览器的接口，也是 JS 中的 Global 全局对象：

```js
var i = 29
alert(i)            // 29
alert(window.i)     // 29
```

## 窗口对象

如果页面包含框架（ `frame` 标签），则每一个框架都有自己的 `window` 对象。

`top` 对象始终指向最外层的框架，即浏览器窗口。

`parent` 对象指向当前框架的上层框架。

也可以用 `self` 代替 `window` 使用。

## 窗口位置

可以这样访问窗口的位置（左上角顶点）信息：

```js
// 因为 Firefox 是使用 `screenX` 和 `screenY` ，而大部分浏览器使用 `screenLeft` 和 `screenTop`
// 为了兼容性可以先判断属性的存在，然后取值
var leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX
var rightPos = (typeof window.screenRight == "number") ? window.screenRight : window.screenY
```

浏览器不同，其位置信息的标准也不同，仅供参考。

可以用 `moveTo(x, y)`、`moveBy(x, y)` 移动窗口，但可能被浏览器禁用。

## 窗口大小

用 `innerWidth`、`innerHeight` 或者 `document.documentElement.clientWidth/clientHeight` 获取页面视图区大小。

用 `outerWidth`、`outerHeight` 可能会返回浏览器窗口大小或者页面视图区大小。

可以用 `resizeTo(width, height)` 改变窗口大小，但可能被浏览器禁用。

## 导航和打开窗口

用 `window.open(url, target, features, replace)` 来实现。

* `target` 代表加载 url 的窗口或者框架

* `features` 用来设置特性，见书上 P200 

* `replace` 表示新页面是否取代浏览器历史记录中当前加载页面，是个布尔值

`window.open()` 会返回新窗口对象，可以访问 `closed` 和 `opener` 属性。

如果窗口被屏蔽，`window.open` 会返回 `null` 。

## 间歇调用和超时调用

用 `setTimeout(function, millsecond)` 来延迟调用，该方法会返回一个任务 ID ，可以用 `clearTimeout(ID)` 取消该调用。

用 `setInterval(function, millsecond)` 来间歇调用，同样返回一个 ID ，可以用 `clearInterval(ID)` 取消该调用。

## 系统对话框

* `alert()` 可以弹出警告对话框

* `comfirm()` 可以让用户选择 "确认" 或者 "取消" ，且返回对应的布尔值

* `prompt(info, placeholder)` 则在 `comfirm` 基础上多一个文本框，且返回对应的文本

* `window.print()` 打印

* `window.find()` 查找

## location 对象

`location` 有许多属性，比如 `hostname`、`pathname`、`port`、`search` 等，见书 P207 。

`location.search` 会返回 URL 中的查询字符串，比如 "?q=javascript" 。

可以写一个返回查询字符串参数的函数：

```js
function getQueryStringArgs() {
    var qs = location.search.length > 0 ? location.search.substring(1) : ""
    var args = {}
    var items = qs.length ? qs.split("&") : []
    var item = null, name = null, value = null, i = 0, len = items.length

    for (i = 0; i < len; i += 1) {
        item = items[i].split("=")
        name = decodeURIComponent(item[0])
        value = decodeURIComponent(item[1])
        if (name.length) {
            args[name] = value
        }
        return args
    }
}
```

可以通过以下方式跳转地址：

```js
location.assign("https://talaxy.cn")
location = "https://talaxy.cn"
location.href = "https://talaxy.cn"
// 也可以更改 location 中其他的属性
```

如果想在当前页面跳转（无法后退到上一个页面）：

```js
location.replace("https://talaxy.cn")
```

用 `reload` 重新加载页面，`reload` 后面的语句可能不执行，最好放最后：

```js
// 浏览器缓存中加载
location.reload()
// 服务器中加载
location.reload(true)
```

## navigator 对象

通过 `navigator` 可以识别客户端浏览器信息，比如 `appName`、`platform`、`userAgent` 等，见书上 P210 。

可以通过 `plugins` 检测插件存在，这是个数组，元素为：

* `name` 插件名

* `description` 描述

* `filename` 文件名

* `length` 所处理的媒体类型（ [MIME](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types) ）数量

可以这样查找是否有某插件：

```js
function hasPlugin(name) {
    name = name.toLowerCase()
    for (var i = 0; i < navigator.plugins.length; i += 1) {
        if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
            return true
        }
    }
}
```

`plugins.refresh` 能刷新插件，可以传一个布尔值表示是否重新加载页面。

注册处理程序 `registerContentHandler` 和 `registerProtocalHandler` 见书上 P213 。

## history 对象

浏览器打开的时候就会创建一个 `history` 对象，虽然服务器无法读具体内容，但可以实现前进后退：

```js
// 后退一页，也可以用 history.back
history.go(-1)
// 前进两页，也可以用 history.forward
history.go(2)
// 跳到最近的 "talaxy.cn" 页面
history.go("talaxy.cn")
```

`history.length` 查看历史记录数量
