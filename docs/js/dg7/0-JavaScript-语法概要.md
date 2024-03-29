
# JavaScript 语法概要

## 词法结构

区分大小写、注释、标识符、保留字、支持 Unicode、代码换行可不加分号。

## 类型、值、变量

#### 类型分类

* 原始类型（不可修改）：number、string、boolean、symbol、null、undefined、bigint ；

* 对象类型（可修改）：object 。

#### 数值类型

使用 IEEE 754 标准 定义的 64 位双精度浮点型表示数值，可以准确表示 [-2<sup>53</sup>, 2<sup>53</sup>] 区间所有整数。

可以用数字分隔符 `_` 来进行数字的位数分组，提高可读性。

数值操作中出现上溢出会得到 ±Infinity ；下溢出会得到 ±0 ；零除以零会得到非数值 NaN 。

BigInt 数值类型来表示任意精度整数，字面量以 n 结尾（ Math 对象不支持大数值）。

#### 字符串

字符串是无符号 16 位值的不可修改的有序序列，每个值表示一个 Unicode 字符。

常见的 Unicode 字符的码点为 16 位。若超过 16 位，则用两个 16 位值表示，称为代理对。

ES6 中字符串是可迭代的，迭代的是字符而不是 16 位值。

用 `'` 或 `"` 包裹字符串，ES6 可以用反引号 `` ` ``（通过 `${表达式}` 进行插值，支持多行）。

需要用 `\` 转义引号和其他一些字符。

#### 字符串方法

* 获取子串：`substring()` `slice()` `split()`

* 搜索：`indexOf()` `lastIndexOf()`【ES6】`startsWith()` `endsWith()` `includes()`

* 访问字符：`charAt()` `charCodeAt()`【ES6】`codePointAt()`
  
* 匹配：`match()` `matchAll()` `search()` `replace()` `replaceAll()`

* 大小写：`toLowerCase()` `toUpperCase()`

* 归一化：【ES6】`normalize()`

* 填充：【ES2017】`padStart()` `padEnd()`

* 去除空格：`trim()`【ES2019】`trimStart()` `trimEnd()`

* 拼接：`concat()`【ES6】`repeat()`

#### 布尔值

`undefined`、`null`、±0 、NaN、`""` 都会转为 `false` ，其余的值会转为 `true` 。

#### null & undefined

都表示空值。两者相等，但不严格相等。`typeof null` 为 "object" 。

#### 符号类型

创建符号需要调用 `Symbol()` 函数，即使是相同的实参也永远不会返回相同的值。

可以用 `Symbol.for()` 进行全局符号的查询，行为类似字典，用于与别的代码共享符号值。

#### 全局对象

JS 解释器启动后，都会创建一个新的全局对象，并为其设置一些初始属性及函数方法。

Node 的全局对象为 `global` ；浏览器为 `window` 。ES2020 定义了 `globalThis` 作为全局对象引用。

#### 原始值 & 对象引用

原始值不可修改。比较两值时，原始值会纯粹比较值，而对象值会比较引用的是否为同一对象。

#### 隐式类型转换

JS 会尝试将值转为想要的类型。相等 `==` 会先尝试类型转换，而严格相等 `===` 不会。

对于数组，JS 会调用其 `join()` 方法来转为字符串，通常用 `,` 进行拼接。

#### 显式类型转换

`Boolean()` `Number()` `parseInt()` `parseFloat()` `String()` 等函数。或手动触发隐式转换。

#### 对象转换

* 对象转布尔值为 `true` ；

* 对象转字符串，先 `toString()` 后 `valueOf()`（会期盼这些方法返回原始值，下同）；

* 对象转数值，先 `valueOf()` 后 `toString()` ；

* 无类型指向，则先转为数值（除了 Date 会先转为字符串）。

一般操作符，如 `+` `==` `!=` 等会先对对象进行无偏好转换。而大小于号会进行偏数值转换。

#### 变量声明

var（函数作用域、声明提升、可以多次声明）、let 、const（常量，必须赋初值）

#### 解构赋值

ES6 中左值可以模拟数组（或可迭代对象）或对象字面量来获取右值中对应的值。

支持嵌套、用 `,` 跳跃数组元素。多余的变量会赋值为 `undefined` 。可以提供默认值。

## 表达式 & 操作符

#### 表达式类型

* 主表达式、数组 & 对象字面量；

* 函数表达式（箭头函数）、属性访问（点语法、中括号）、函数/方法调用；

* 可选链 `?.` 、创建对象（ new 操作符）。

#### 操作符

操作符可以用于算术、比较、逻辑、赋值等表达式中，也有用 delete、instanceof 等关键字表示。

操作数分一元、二元、三元。`?:` 是唯一的三元操作符。

一元操作符的优先级最高，赋值操作符优先级很低。可以用圆括号确保优先级。

四则运算均为左结合性（从左往右），而幂、一元、赋值、三元操作符均为右结合性。

#### 基本算术操作符

`+` `-` `*` `/` `%` 以及 ES2016 新增的 `**` 。幂操作会优先于乘、除、取模操作。

对于取模运算，求得的余数的符号与被除数一致（包括 -0 ），浮点数也可以取模。

#### + 操作符的行为

1. 如果存在操作数为对象，则先根据无偏好算法转为原始值；

2. 将对象转为原始值后，如果存在操作数为字符串，则将另一个操作数也转为字符串，然后进行拼接；

3. 否则，两个操作数都被转为数值，进行加法计算。

#### 一元算数操作符

* `+` 会将操作数转为数值，然后返回（如果原本是数值则什么都不做。不能用在大数值）；

* `-` 先将操作数转为数值，然后更改符号。

* `++` `--` 的操作数应当是个变量，返回值取决于操作符相对于变量的位置。

#### 位操作符

`&` `|` `^` `~` `<<` `>>` `>>>`（无符号右移）。除了 `>>>` ，其余可用在大数值上。

#### 相等 & 严格相等

`===` 用于严格比较两个操作数是否完全相同，而 `==` 会先尝试类型转换再进行比较。

一个对象只与自己严格相等，与其他任何对象都不相等，因为每一个对象都有独一无二的内存地址。

`null` 和 `undefined` 相等，但不严格相等。`NaN` 与任何值不等，包括自身。0 和 -0 严格相等。

两个字符串应当包含完全相同的 16 位值，否则即便看起来完全相同，也会判为不等。

#### 比较操作符的转换规则

* 如果有操作数为对象，则先采用无偏好算法转为原始值；

* 字符串之间的比较会根据字母表顺序，即 16 位 Unicode 值的数值顺序；

* 如果存在一个操作数不是字符串，则会将两个操作数转为数值再进行比较。

#### 其它关系操作符

* in（判断左操作数是否为右操作数的一个属性）；

* instanceof（判断原型，左操作数如果为原始值返回 `false` ，右操作数如果不是对象抛出异常）。

#### 逻辑操作符

`&&` 的左操作数是假值时，不会对右操作数求值。若左操作数为真值，整个表达式的值为右操作数。

`||` 会返回第一个为真值的操作数，并不再处理后面的操作数；若一个都没有，则返回最后一个操作数。

`!` 会对操作数取反，如操作数不是布尔值，会先转换为布尔值。可用 `!!` 直接转为布尔值。

#### 赋值表达式

`=` 的左操作数应当是个左值（即变量标识符）。支持解构赋值。

算术及位操作符支持简写，如 `+=` `-=` 等。

#### 求值表达式

可将一个表达式字符串传给全局函数 `eval()` 来求得表达式的值。它拥有自己的作用域。

如果 `eval()` 以别名身份调用，则应当将表达式字符串当作全局代码来执行。

#### 其他一些操作符

typeof 类型检查，"undefined" "boolean" "number" "bigint" "string" "symbol" "function" "object" 。

delete 删除变量/属性。删除失败返回 `false` ，严格模式只能作用于属性访问表达式。

`?:`（三目运算符）、`??`（可选符号）、await（异步）、void（丢弃返回值）。

逗号 `,` 操作符会返回右操作数，且为左结合性。

## 语句

#### 表达式语句

表达式语句为带副作用的表达式，比如赋值、函数调用等。

#### 复合语句 & 空语句

可用一对 `{}` 表示语句块存放多个语句；或者只用 `;` 表示空语句。

#### 条件语句

if 语句、switch 语句（使用严格相等、default 标签可选）。

#### 循环语句

while 、do-while 、for 、for-of（可迭代对象）、for-in（枚举对象）、for-await（异步迭代）。

#### 跳转语句

语句标签、break 、continue 、return 、yield（生成器）、throw 、try-catch-finally 。

#### 其他语句

with（作用域）、debugger（断点）、"use strict"（严格模式）、声明语句。

## 对象

#### 四个特性

value、writable、enumerable、configurable 。

#### 对象使用

* 创建对象：字面量、`new` 操作符、`Object.create()` 。

* 属性访问：点语法、中括号。

* 测试属性：`undefined` 判断、`in` 操作符、`Reflect.has()` 。

* 扩展属性：ES6 的 `Object.assign(target, ...sources)` 。

#### 属性枚举

在用 for-in 进行枚举时，从原型继承的属性也会被枚举，但方法不会枚举。

#### 获取属性名数组

`Object.keys()` `Object.getOwnPropertyNames()` `Object.getOwnPropertySymbols()` `Reflect.ownKeys()`

#### 属性枚举顺序

1. 非负整数（即索引，升序枚举）；

2. 字符串（按添加顺序枚举，非字典序）；

3. 符号属性。

#### JSON 合法值

* 对象、数组、字符串、有限数值、`true`、`false`、`null` ；

* NaN 、±Infinity 会被转为 `null` ；

* 日期对象会调用 `toJSON()` 方法转为 ISO 格式的日期字符串；

* 函数、RegExp 对象、Error 对象以及 `undefined` 无法序列化，会被直接删除。

#### 更多语法

* 【ES6】属性简写、计算属性名（中括号）、符号属性、方法简写、访问器属性（ get 、set ）；

* 【ES2018】对象展开（ `...` 扩展操作符）。

## 数组

#### 数组长度

数组最大长度 2<sup>32</sup>-1，即合法索引区间为 [0, 2<sup>32</sup>-2] 。

#### 创建数组

字面量（可用展开语法）、`new Array()`（ new 可不加）、`Array.of()`、`Array.from()` 。

#### 添加删除元素

`push()` `pop()` `shift()` `unshift()` `splice()`

手动指定 `length` 值，则会对数组进行末尾留空或删除元素。

#### 遍历数组

for-of 语句会遍历数组中空值，而 `forEach()` 等迭代方法不会。

#### 迭代方法

* `forEach()` `map()` `filter()` `every()` `some()`

* `reduce()` `reduceRight()`（空数组且无初始值报错，两者合并仍只有一个元素则直接返回）

* `find()`（找不到返回 `undefined` ） `findIndex()`（找不到返回 -1 ）

#### 查找方法

除了 `includes()`（ NaN 与自身相等），其他方法均使用严格相等。

* `indexOf()`（找不到返回 -1 ，后同）`lastIndexOf()` `includes()`

#### 构建新数组

这些方法中的位置参数均可使用负数表示倒数。

`slice()` `concat()`（一级扁平化）`fill()` `copyWithin()`

#### 元素顺序

`reverse()` `sort()`（字母序，正数、0、负数）。这两个方法均会修改数组自身。

#### 其他方法

* 扁平化：`flat()` `flatMap()`（类似 `arr.map(fn).flat()` ）

* 键值对：`keys()` `values()` `entries()`

* 转为字符串：`join()`

* 类方法：`Array.isArray()` `Array.from()` `Array.of()`

#### 类数组对象

一个对象有一个数值属性 `length` ，且有相应的（可以不完全）非负整数属性，则可以视为类数组。

#### 字符串

字符串的行为类似 UTF-16 Unicode 字符的只读数组，除了用 `charAt()` 方法，也可以用方括号语法。

## 函数

#### 定义函数

函数声明、函数表达式、ES6 中的箭头函数。

还可以用 `Function()` 构造函数定义新函数。还有一些特殊函数，比如生成器函数、异步函数。

#### 调用上下文

非严格模式下的函数调用，调用上下文 `this` 值是全局对象；严格模式下是 `undefined` 。方法调用时，对象会成为调用上下文。箭头函数会从定义自己的环境中继承 `this` 值，且没有 `prototype` 属性。

JS 运行的时候会有个调用栈，应当注意递归函数的调用次数。

#### 构造函数

调用构造函数会创建一个新的空对象，这个对象继承构造函数的 `prototype` 属性。同时，这个对象会被用作函数的调用上下文（即便构造函数为对象方法）。

如果使用 return 返回了一个对象，则会返回这个对象；否则会隐式返回创建的新对象。

箭头函数没有 `prototype` 属性，不能作为构造函数调用。

#### 函数参数

* 可选参数应当放在参数列表的末尾；

* ES6 可以为形参设置默认值，通过 `...` 定义剩余参数（必须为最后一个参数）；

* 可以使用展开（ `...` 操作符）、解构语法。ES2018 支持剩余参数解构对象。

#### 函数作为命名空间

在函数体内声明的变量在函数外部不可见。可以把函数用作临时的命名空间，不污染全局命名空间。

#### 作用域 & 闭包

函数执行时使用的是定义函数时生效的变量作用域，而非调用函数时生效的变量作用域。JS 函数对象的内部状态除了包括函数代码，还要包括对函数定义所在作用域的引用。

函数对象与作用域组合起来解析函数变量的机制，称为闭包。

函数调用都会创建一个新的闭包，闭包之间的内部变量互不共享（可称为私有变量）。

ES6 引入了块级作用域。一对 `{}` 为一个块级作用域。let 和 const 声明的变量会限制在块级作用域里。

#### 函数属性 & 方法

`length`（声明的形参个数）、`name`（定义函数时的名字）、`prototype`（匿名函数没有原型）。

`call(thisArg, arg1, arg2, ...)` & `apply(thisArg, args)` 间接调用函数。

`bind(thisArg, arg1, arg2, ...)` 返回一个新函数，其会绑定指定的 `this` 值。

`toString()` 返回一个表示当前函数源代码的字符串。

#### Funtion() 构造函数

`Function()` 允许在运行时动态创建编译 JS 函数。它的前几个参数为形参列表，最后一个参数为函数体代码字符串（无法指定函数名，因此也为匿名函数）。

#### 高阶函数

高阶函数即操作函数的函数，它接受函数作为参数，或者返回一个新函数。

## 类

#### 原型 & 构造函数

用 `Object.create()` 来根据一个原型创建对象。或者定义一个构造函数。

在函数里可以使用 `new.target` 来判断函数是否以构造函数方式调用。

和函数调用不同，class 定义的类必须使用 new 操作符来调用它们的构造函数。

instanceof 操作符实际是比较左操作数是否继承了右操作数的原型对象。也可以用对象的 `isPrototypeOf()` 方法判断。

构造函数的 `constructor` 属性不可枚举。

#### 定义类

用 class 声明语句、表达式。用 extends 关键字继承另一个类。

如果一个类不需要初始化属性，则可以省略 `constructor` ，JS 会自动创建一个空构造函数。

#### 方法 & 字段

* 静态方法（ static 修饰）、get & set 、内部方法（ "_" 前缀，非标准）。

* 公有字段（赋值语句）、私有字段（ "#" 前缀）、静态字段（ static ）。

#### 子类

设置子类的原型对象为父类（旧）、使用 extends 定义（新）。

通过 extends 创建子类，B 原型（实例）和 B 类自身（静态）都会从 A 中继承。

用 super 关键字来使用父类。子类构造函数中必须调用父类构造函数。

#### 委托（组合）

除了继承，可以将要继承的实例作为当前类的一个属性，并在需要时委托这个实例干事。

#### 抽象方法

可以在方法中抛出异常来达到抽象方法的效果。

## 模块

#### 模块化的作用

模块化的作用主要体现在封装、隐藏私有实现细节、保证全局命名空间清洁。

#### Node 中的模块

Node 定义了一个全局 `exports` 对象，它是 `module.exports` 的引用。

通过 `require("文件路径")` 导入其他模块导出的对象（文件名可忽略 ".js" 后缀）。

#### ES6 中的模块

ES6 模块自动应用严格模式。导入导出代码只能出现在顶层代码。

导出内容可以是声明语句、大括号、默认导出（ default ）。

导入有提升效果。导入方式可以为大括号、标识符接收默认导出、`*` 接收所有常规导出。

导入导出均可重命名。支持来源文件的再导出 `export ... from "file.js"` 。

#### 启用模块

* 浏览器在脚本标签中添加模块属性 `<script type="module">` ；

* Node 在 package.json 里添加 `type: "module"` 属性。

#### 动态导入模块

ES2020 引入了 `import()` 来动态加载模块。它返回一个 Promise 对象。

## 迭代器 & 生成器

#### 迭代器对象

指拥有 `next()` 方法的对象，该方法返回下一次的迭代结果对象（具有 `value` 或 `done` 属性）。

可以定义 `return()` 方法，来执行一些清理工作。

#### 可迭代对象

指有 `Symbol.iterator` 方法的对象，该方法应当返回一个迭代器对象。

#### 生成器

生成器自身既是可迭代对象，又是迭代器对象。

#### 定义生成器

生成器使用 `function*` 声明、方法名前加 `*` 。

yield 关键字只能在生成器函数中使用。可以用 `yield*` 来委托迭代可迭代对象（包括生成器）。

可以有 return 语句，其对应的迭代结果为：`value` 为返回值，`done` 为 `true` 。

#### yield 表达式的值

生成器的 `next()` 方法时可以传入参数，它会成为上次暂停的 yield 表达式的值。

#### 生成器方法

`next()`、`return()`（迭代终止）、`throw()`（抛出异常，生成器中可以用 try-catch-finally 语句）。

## 异步

#### 异步语法

ES6 的 Promise 对象、ES2017 的 async/await 关键字、ES2018 的 for-await 异步迭代。

#### 使用回调的异步编程

定时器、事件监听、网络事件。

#### Promise 特征

两个优点：链式调用、标准化异常处理。

三种状态：`pending` `fulfilled` `rejected` 。

#### 构造 Promise

`new Promise()` `Promise.resolve(value)` `Promise.reject(reason)` 。

#### Promise 方法

三个方法：`then()` `catch()`【ES2018】`finally()` 。

`then()` 方法类似事件注册，可以多次调用。传入 `then()` 方法的回调会被异步执行。

#### 并行多个 Promise

* `Promise.all()` 需要全被兑现才为兑现；

* `Promise.allSettled()` 全部落定后兑现（数组元素属性 `status`、`value`、`reason` ）；

* `Promise.race()` 返回第一个落定的。

#### 串行多个 Promise

需要手动通过 `then()` 连接。

#### async & await

await 关键字接收一个 Promise 对象并将其转为一个返回值或一个异常。

只能在 async 关键字声明的函数（箭头函数、类方法都可用）内部使用 await 关键字。

async 函数会返回一个 Promise 对象。

#### for-await 循环

for-await 的循环体会先等待循环头中 Promise 的兑现，才去执行。

#### 异步迭代器与常规迭代器区别

* 使用 `Symbol.asyncIterator` 代替 `Symbol.iterator` ；

* `next()` 应当返回一个兑现结果为迭代结果的 Promise 对象。

#### 异步生成器

通过 `async function*` 来生成一个异步生成器。

## 元编程

#### 属性的特性

数据属性的 4 个特性：value、writable、enumerable、configurable 。

访问器属性的 4 个特性：get、set、enumerable、configurable 。

#### 属性描述符

* 用 `Object.getOwnPropertyDescriptor()` 获取（自有）属性的属性描述符；

* 用 `Object.defineProperty()` 方法来创建或修改属性，或 `Object.defineProperties()` 。

#### 对象的可扩展能力

* `Object.isExtensible()`、`Object.preventExtensions()` 不能添加属性 ；

* `Object.isSealed()`、`Object.seal()` 不能添加删除属性；

* `Object.isFrozen()`、`Object.freeze()` 只读。

#### 原型特性

* 一般对象会用 `Object.prototype` 作为原型；

* 用 new 创建的对象会用构造函数的原型作为原型；

* 使用 `Object.create()` 创建的对象则会以传入的第一个参数作为原型。

#### 查询原型

`Object.getPrototypeOf()`、Object 的 `isPrototypeOf()` 方法、instanceof 操作符。

#### 公认符号

* `Symbol.iterator` & `Symbol.asyncIterator` 让对象或类把自己变为可迭代或异步可迭代对象；

* `Symbol.hasInstance` 使用 instanceof 前先检查该符号方法；

* `Symbol.toStringTag` 调用 `Object.prototype.toString()` 前会先查找该符号属性；

* `Symbol.toPrimitive` 覆盖对象转换行为（ "string"、"number"、"default" ）；

* `Symbol.isConcatSpreadable` 在 Array 的 `concat()` 中是否展开；

* `Symbol.unscopables` 根据该符号属性判断对象各属性是否放入 with 语句的作用域中。

#### 模板标签函数

第一个参数为模板字面量中被插值分割的字符串，其余参数则为插值。返回值不限于为字符串。

#### Reflect API

Reflect 对象的方法可以模拟一些核心语法的行为。与 Proxy 对象中的处理器对象的方法是一一对应的。

#### 代理对象作用

拦截 JS 对象的基础行为。

#### 创建代理对象

* `new Proxy()` 第一个参数为目标对象，第二个为处理器对象（ Reflect 上的方法 ）；

* `Proxy.recovable()` 创建代理，它返回一个对象，包含一个代理对象和一个撤销代理的函数。

#### 代理不变式

代理对象所表现的特性是可以与目标对象不一致的，但应当合理。
