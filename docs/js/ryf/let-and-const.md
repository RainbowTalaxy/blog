---
tags:
  - js
---

# let 和 const

* 块级作用域

  ```js
  var a = [];
  for (let i = 0; i < 10; i++) {
    a[i] = function () {
      console.log(i);
    };
  }
  a[6](); // 6
  ```

  块级作用域一定要有大括号作为表示：

  ```js
  // 报错，不能在单行语句中定义
  if (true) let x = 1;
  ```

* 没有变量提升

  - `var` 在声明前也可以使用
  - `let` 在声明前不允许使用变量或再次的声明

  ```js
  // var 的情况
  console.log(foo); // undefined
  var foo = 2;

  // let 的情况
  console.log(bar); // ReferenceError
  let bar = 2;
  ```

* 暂时性死区

  从块级作用域的开始到 `let` 声明前变量都是不可用的

  ```js
  var tmp = 123;

  if (true) {
    tmp = 'abc'; // ReferenceError
    let tmp;
  }
  ```

* 块级作用域可以直接创建，以及嵌套

  ```js
  {
    {let insane = 'Hello World'}
    console.log(insane); // 报错
  }
  ```

* 函数声明

  - ES5 中，函数只能在函数作用域（包括全局）中，行为类似 `var`
  - ES6 中，函数可以在块级作用域中定义，但如果声明成功则会提升

  ```js
  function f(flag) {
      if (flag) {
          function f() { console.log('true') }
      }
      f()
  }

  f(true) // true
  f(false) // 报错，没有这个函数
  ```

  > 应当避免在块级作用域内声明函数，或者可以用函数表达式代替

* `const`

  * 声明的时候就应当初始化，一旦初始化，后续的修改将会报错
  * `const` 拥有和 `let` 差不多的性质
  * `const` 保存的是指向实际数据的指针，可以改变数据对象，但不可以改变引用
  * 如果想完全冻结对象，使用 `Object.freeze(data)` 方法

* ES6 六种方法声明变量

  * ES5：`var` `function`
  * `let` `const` `import` `class`

---

### 参考

[ECMAScript 6 入门，let 和 const 命令 - 阮一峰](https://es6.ruanyifeng.com/#docs/let)