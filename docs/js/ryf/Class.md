---
tags:
  - js
---

# Class 的基本语法

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};
```

用类语法：

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

可以直接对 `prototype` 进行扩展：

```js
class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});
```

类的内部所有定义的方法，都是不可枚举的（non-enumerable）。这一点与 ES5 的行为不一致：

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

## constructor 方法

如果没有定义 `constructor` 方法，会隐式添加一个 `constructor() {}` 。

`constructor` 默认返回 `this` ，也可以显示 `return` 别的类型的对象。

## 类的实例

类必须用 `new` 调用，否则报错。（普通构造函数不会报错）

与 ES5 一样，实例会共享一个原型对象：

```js
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__ //true
```

> `__proto__` 并不是语言本身的特性。虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。

## get 和 set 方法

普通对象（记住，`get` 和 `set` 也是代表外部读写的权限）：

```js
let h = {
  _name: 'Talaxy',
  get name() {
    return this._name
  },
  set name(newValue) {
    this._name = newValue
  }
}
```

同样可以直接用在类里：

```js
class Hello {
  get hello() {
    console.log('hello')
  }
}
```

`get` 和 `set` 是设置在属性的 Descriptor 描述对象上的。

## 属性表达式

```js
let methodName = 'getArea'

class Square {
  constructor(length) {
    // ...
  }

  // 即 getArea()
  [methodName]() {
    // ...
  }
}
```

## Class 表达式

```js
const MyClass = class { /* ... */ }
```

表达式可以明确名称，但只能在类内部使用：

```js
const MyClass = class Me { /* ... */ }
```

立即使用 class ：

```js
let myClass = class { /* ... */ }()
```

## 注意点

* `class` 内部默认开启了严格模式
* 类没有变量提升
* 类其实是函数的封装，所以会继承函数的属性及方法
* 如果类定义中某个方法之前加上 `*` ，就表示该方法是一个 `Generator` 函数
* 确保方法的调用者为实例自身，或者用 `bind` 进行绑定，又或者用箭头函数：

  ```js
  class Logger {
    constructor() {
      this.printName = this.printName.bind(this);
    }

    // ...
  }
  ```
  
## 静态属性及方法

在方法前加上 `static` ，调用者应当为类自身：

```js
class Hello {
  static word = 'hello'

  static hello() {
    console.log(this.word)
  }
}
```

> 也可以在外部直接赋值。同时，ES6 只规定 `class` 有静态方法，没有规定必须有静态属性。

## 实例属性

属性可以在外部定义：

```js
class foo {
  bar = 'hello'

  constructor() {
    // ...
  }
}
```

## new.target

在构造函数中（包括普通构造函数）可以用 `new.target` 获取 `new` 调用的构造函数。

---

### 参考

[ECMAScript 6 入门，Class 的基本语法 - 阮一峰](https://es6.ruanyifeng.com/#docs/class)