---
tags:
  - js
---

# Class 的继承

```js
class Point {
}

class ColorPoint extends Point {
}
```

子类必须先在 `constructor` 方法中调用 `super` 方法，然后才能用 `this` 关键字，否则子类就得不到 `this` 对象。`super` 方法只能在 `constructor` 中调用，否则报错。

如果子类没有定义 `constructor` 也不会报错，会隐式获得一个 `constructor` ：

```js
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

子类的实例对象既是子类也是父类，这和 ES5 行为一致。

`Object.getPrototypeOf` 可以用来获得子类的父类。

`super` 不能单独使用，即 `console.log(super)` 会报错。这是因为 JavaScript 无法解析是作为函数还是对象使用。

类里面 `super` 指向的是**父类原型对象**，可以在子类任何方法里使用。记住，不能通过 `super` 访问父类定义的属性，除非是原型上的属性。

在子类方法里通过 `super` 调用父类方法，调用者 `this` 为子类实例。

`super` 也可以用在静态方法里，指向的是父类（函数）。同样，调用者 `this` 为子类（函数）。

## `__proto__` 和 `prototype` 属性

每一个对象都有 `__proto__` 属性，指向其构造函数的 `prototype` 属性。这是为了能让对象使用原型方法。

在继承中，子类原型对象会有个 `__proto__` 属性指向父类原型。

```js
class Father {}
class Child extends Father {}

Child.__proto__ === Father // true
new Child().__proto__ === Child.prototype // true

// Child 的原型是个 Father 实例
Child.prototype instanceof Father // true
Child.prototype.__proto__ === Father.prototype // true
```

有点等价于：

```js
class Father {}
class Child {}

Object.setPrototypeOf(Child.prototype, Father.prototype);
```

`Object.setPrototypeOf` 的实现为：

```js
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```

如果没有明确继承，则自动继承 `Object` 类：

```js
class Hello {}

Hello.__proto__ === Funtion.prototype // true
Hello.prototype.__proto__ === Object.prototype // true
```

---

### 参考

[ECMAScript 6 入门，Class 的继承 - 阮一峰](https://es6.ruanyifeng.com/#docs/class-extends)