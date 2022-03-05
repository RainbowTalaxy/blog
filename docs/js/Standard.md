---
sidebar_position: 1
---

# 标准库

## [Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)

* 实例属性

  - :star: **`length`**
  
    函数形参的个数。

  - **`name`**
  
    函数实例的名称。

* 实例方法

  - :star: **`apply(thisArg, [args])`**
    
    将方法应用在 `thisArg` 上，`args` 为参数数组。
    
  - :star: **`call(thisArg, arg1, arg2, ...)`**
    
    将方法应用在 `thisArg` 上。

  - :star: **`bind(thisArg, arg1, arg2, ...)`**

    返回一个与 `thisArg` 绑定的函数实例，之后的参数会直接作为函数参数。调用函数时，实参会视为额外的参数。

  - **`toString()`**

    返回函数的源代码

## [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

* 实例属性

  - :star: **`__proto__`**

    实例对象上的原型指针，对于 `new Object()` 来说，它的 `__proto__` 即为 `Object.prototype` 。

    该属性因为性能原因已弃用，建议使用 `Object.getPrototypeOf` / `Reflect.getPrototypeOf` 和 `Object.setPrototypeOf` / `Reflect.setPrototypeOf` 。

* 实例方法

  - :star: **`constructor`**

    `Object` 构造函数的引用。

  - :star: **`hasOwnProperty(prop)`**

    判断是否含有指定属性。

  - :star: **`isPrototypeOf(obj)`**

    判断该对象是否存在于另一个对象的原型链上。

  - **`propertyIsEnumerable(prop)`**

    判断指定的属性是否可枚举。

  - **`toLocaleString()`**

    针对本地化的表示对象的字符串。

  - :star: **`toString()`**

    一个表示该对象的字符串。

  - :star: **`valueOf()`**

    返回对象所代表的值。可以手动覆盖这个方法来达到一些目的。

* 类属性

  - :star: **`Object.assign(obj, src1, src2, ...)`**

    将 `src` 的对象附加到 `obj` 上，且这种附加是浅拷贝，只复制引用值。

  - :star: **`Object.create(proto, [obj])`**

    以 `proto` 作为新对象的 `__proto__` 创建对象，同时将 `obj` 附加在新对象上。

  - :star: **`Object.defineProperty(obj, prop, descriptor)`**

    该方法会直接 `obj` 定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

  - **`Object.defineProperties(obj, props)`**

    直接在 `obj` 定义新的属性或修改现有属性，并返回该对象。

  - :star: **`Object.getPrototypeOf(obj)`**

    返回 `obj` 的原型，即 `obj.__proto__` 。

  - **`Object.setPrototypeOf(obj, proto)`**

    设置 `obj` 的原型为 `proto` 。

  - **`Object.is(obj1, obj2)`**

    判断 `obj1` 和 `obj2` 是否为同一个值。

    与 `==` 不同的是，`===` 运算符将数字 -0 和 +0 视为相等 ，而将`Number.NaN` 与 `NaN` 视为不相等。

  - **`Object.keys(obj)`**

    返回 `obj` 可枚举属性名的字符串数组，与循环遍历的顺序一致。

  - **`Object.values(obj)`**

    返回 `obj` 可枚举属性值的字符串数组，与循环遍历的顺序一致。

  - **`Object.entries(obj)`**

    返回 `obj` 可枚举属性的键值对数组，与循环遍历的顺序一致。

  - **`Object.freeze(obj)`**

    冻结 `obj` 使之不会以任何方式被修改。

  - **`Object.isFrozen(obj)`**

    判断 `obj` 是否被冻结。

  - **`Object.fromEntries(pairs)`**

    该方法把键值对列表转换为一个对象。

  - **`Object.getOwnPropertyDescriptor(obj, prop)`**

    返回 `obj` 的 `prop` 属性的属性描述符

  - **`Object.getOwnPropertyDescriptors(obj)`**

    返回一个包含 `obj` 所有属性的属性描述符的对象。

  - **`Object.getOwnPropertyNames(obj)`**

    返回 `obj` 的所有属性名所组成的数组。

  - **`Object.getOwnPropertySymbols(obj)`**

    返回 `obj` 的所有 `Symbol` 属性的数组。

  - **`Object.preventExtensions(obj)`**

    使 `obj` 永远不能再添加新的属性。

  - **`Object.isExtensible(obj)`**

    判断是否可以在 `obj` 上面添加新的属性。

  - **`Object.seal(obj)`**

    密封 `obj` 。密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变得不可删除，以及一个数据属性不能被重新定义成为访问器属性。

  - **`Object.isSealed(obj)`**

    判断一个对象是否被密封。

## [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

* 构造方法

  - **`[element0, element1, ..., elementN]`**

  - **`new Array(element0, element1[, ...[, elementN]])`**

  - **`new Array(arrayLength)`**

* 实例属性

  - :star: **`length`**

    数组的元素个数

* 实例方法

  - **`at(index)`**

    （实验性用法）返回下标所对应的元素。与下标语法不同的是，`index` 可以为负数来表示倒数。

  - :star: **`concat(arr1, arr2, ...)`**

    返回一个与所给数组合并的数组。原数组不会更改。

  - **`copyWithin(target[, start, end])`**

    浅复制下标 `start` 到 `end`（不包括 `end` ）的元素到从 `target` 开始的位置，并返回这个数组。该方法会修改原数组，但不会改变原数组的长度。

    如果 `target` 大于等于 `length`，将会不发生拷贝。

    如果 `start` 被忽略，`copyWithin` 将会从 0 开始复制。

    如果 `end` 被忽略，`copyWithin` 方法将会一直复制至数组结尾（即 `length` ）。

  - :star: **`slice([begin, end])`**

    返回一个新的数组对象，这一对象是一个由 `begin` 和 `end`（不包括 `end` ）决定的原数组的浅拷贝。

    如果省略 `begin`，则 `slice` 从索引 0 开始。

    如果 `begin` 超出原数组的索引范围，则会返回空数组。

    如果 `end` 被省略，或大于数组长度，则 `slice` 会一直提取到原数组末尾。

  - :star: **`splice(start[, deleteCount, item1, item2, ...])`**

    从 `start` 开始，删除 `deleteCount` 个元素，然后在该位置向后添加元素。该方法会修改原数组，并返回包含被删除元素的数组。

    如果 `deleteCount` 被省略了，那么 `start` 之后数组的所有元素都会被删除。

    如果 `deleteCount` 是 0 或者负数，则不移除元素。这种情况下，至少应添加一个新元素。

  - :star: **`fill(value[, start, end])`**

    用 `value` 填充一个数组
    
    `start` 默认为 0 ，`end` 默认为 `length` 。

  - :star: **`push(element1, ..., elementN)`**

    在末尾添加元素，并返回数组的新长度。

  - :star: **`pop()`**

    删除最后一个元素，并返回该元素。

  - :star: **`unshift(element1, ..., elementN)`**

    在开头添加元素，并返回数组的新长度。

  - :star: **`shift()`**

    删除第一个元素，并返回该元素。

  - :star: **`join([separator])`**

    返回一个字符串，用 `separator` 将每个元素进行连接形成。

  - :star: **`includes(value[, fromIndex])`**

    判断一个数组是否包含 `value` 。

    `fromIndex` 默认为 0 ，下同。

  - :star: **`indexOf(value[, fromIndex])`**

    返回第一个值为 `value` 的索引。如果不存在返回 -1 。

  - **`lastIndexOf(value[, fromIndex])`**

    返回最后一个值为 `value` 的索引。如果不存在返回 -1 。

  - :star: **`every(callback(element[, index, array]), thisArg)`**

    返回一个布尔值，判断是否每一个元素满足给定的测试函数。

    `thisArg` 为执行 `callback` 时使用的 `this` 值，可选，下同。

  - :star: **`some(callback, thisArg)`**

    返回一个布尔值，判断是否存在一个元素满足给定的测试函数。

  - :star: **`filter(callback, thisArg)`**

    利用测试函数来过滤数组中的元素，返回一个新数组。

  - :star: **`find(callback, thisArg)`**

    返回满足测试函数的第一个元素。否则返回 `undefined` 。

  - :star: **`findIndex(callback, thisArg)`**

    返回满足测试函数的元素的索引。否则返回 -1 。

  - :star: **`map(callback, thisArg)`**

    返回一个新数组，每个元素将通过 `callback` 进行转换。

  - :star: **`reduce(callback(accumulator, currentValue[, index, array]), initialValue)`**

    在初始值 `initialValue` 的基础上，对每一个元素执行 `callback` ，`accumulator` 为当前累加的状态。

    如果没有提供 `initialValue` ，则使用第一个值。该参数可选，下同。

    比如数组求和可以写为 `[1, 2, 3].reduce((accu, curr) => accu + curr, 0)` 。

  - **`reduceRight(callback(accumulator, currentValue[, index, array]), initialValue)`**

    同 `reduce` 方法，却别在于从右向左累加。

  - :star: **`reverse()`**

    逆转数组，该方法会修改原数组。

  - :star: **`sort([compareFunction])`**

    在数组自身上，根据 `compareFunction` 进行排序。

    `compareFunction` 中，返回小于 0 的值表示 "小于" ，0 表示等于，大于 0 的值表示 "大于" 。

  - :star: **`flat([depth])`**

    将数组扁平化。比如 `[1, [2]]` 扁平化为 `[1, 2]` ，深度为 1 。该方法返回一个新数组。

    可以指定 `depth` 为 `Infinity` 来完全扁平化。

  - :star: **`flatMap(callback(currentValue[, index, array]), thisArg)`**

    返回一个新数组，每个元素将通过 `callback` 进行转换，转换后还会进行深度为 1 的扁平化处理。

  - :star: **`forEach(callback(currentValue[, index, array]), thisArg)`**

    对每一个元素执行一次 `callback` 。

  - **`keys()`**

    返回一个包含数组中每个索引键的迭代器对象。

  - **`values()`**

    返回一个包含数组中每个元素的迭代器对象。

  - **`entrys()`**

    返回一个包含数组中所有键值对的迭代器对象。

* 类方法

  - :star: **`Array.from(arrayLike, mapFn, thisArg)`**

    从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。每个元素会通过 `mapFn` 转化，该参数同 `thisArg` 可选。

  - :star: **`Array.isArray(obj)`**

    判断 `obj` 是否为数组实例。

  - :star: **`Array.of(element0, element1, ...)`**

    根据所给元素创建数组。

## [Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)

* 构造方法

  - **`new Number(value)`**

    创建一个 `Number` 对象。

  - **`Number(value)`**

    返回一个数值。

* 实例方法

  - **`toExponential(fractionDigits)`**

    返回一个指数计数法表示的字符串。`fractionDigits` 指定小数点后保留位数。

  - **`toFixed(digits)`**

    返回一个字符串，四舍五入到小数点保留 `digits` 位。

  - **`toPrecision(precision)`**

    返回一个字符串，精确到 `precision` 位有效数字的字符串。

* 类属性

  - **`Number.EPSILON`**

    大于 1 的最小的浮点数与 1 之间的差值。即 2 的 -52 次方。

  - **`Number.MAX_SAFE_INTEGER`**

    表示在 JavaScript 中最大的安全整数（2^53 - 1）。

  - **`Number.MAX_VALUE`**

    表示在 JavaScript 里所能表示的最大数值。

  - **`Number.MIN_SAFE_INTEGER`**

    表示在 JavaScript 中最大的安全整数（- 2^53 + 1）。

  - **`Number.MIN_VALUE`**

    表示在 JavaScript 里所能表示的最小数值。

  - **`Number.NaN`**

    和 `NaN` 相同。

  - **`Number.NEGATIVE_INFINITY`**

  - **`Number.POSITIVE_INFINITY`**

* 类方法

  - **`Number.isFinite(value)`**

  - **`Number.isInteger(value)`**

  - **`Number.isNaN(value)`**

  - **`Number.isSafeInteger(testValue)`**

  - **`Number.parseFloat(string)`**

    给定值被解析成浮点数，如果无法被解析成浮点数，则返回 `NaN` 。

  - **`Number.parseInt(string[, radix])`**

    根据基数 `radix` 解析成整数，如果无法被解析成浮点数，则返回 `NaN` 。

## [String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)

* 构造方法

  - **`new String(thing)`**

    创建一个 String 对象。

  - **`String(thing)`**

    返回一个原始类型字符串。

* [实例原型 - MDN](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/JavaScript/Reference/Global_Objects/String)

* 实例属性

  - **`length`**

* 实例方法

  - :star: **`toLowerCase()`** / **`toLocaleLowerCase([...locales])`**

    返回一个新字符串，将所有大写字符转为小写。

  - :star: **`toUpperCase()`** / **`toLocaleUpperCase([...locales])`**

    返回一个新字符串，将所有小写字符转为大写。

  - **`repeat(count)`**

    返回一个指定数量连接起来的字符串。

  - **`concat(...strs)`**

    返回一个拼接后的字符串。

    出于性能，强烈建议使用赋值操作符（ `+` `+=` ）代替 `concat` 方法。

  - **`padStart(maxLength[, padString])`**

    返回一个新字符串，在字符串开头添加数个 `padString` ，使整个字符串长度控制为 `maxLength` 。

  - **`padEnd(maxLength[, padString])`**

    返回一个新字符串，在字符串末尾添加数个 `padString` ，使整个字符串长度控制为 `maxLength` 。

  - **`trimStart()`** / **`trimLeft()`**

    返回一个新字符串，去除开头空白。

  - **`trimEnd()`** / **`trimRight()`**

    返回一个新字符串，去除末尾空白。

  - :star: **`trim()`**

    返回一个新字符串，去除两端空白。

  - :star: **`split([separator[, limit]])`**

    分割字符串。`separator` 分隔符可以是字符串或正则表达式。`limit` 为分割片段数量。

    如果没有指定 `separator` 则会返回整个字符串。

  - :star: **`slice(beginIndex[, endIndex])`**

  - :star: **`substring(indexStart[, indexEnd])`**

    返回一个子字符串。与 `slice` 方法不同，索引值不可以为负数。但是 `indexStart` 可以小于 `indexEnd` ，执行方法的时候会取两者正确的大小顺序。

  - :star: **`startsWith(searchString[, position])`**

    判断字符串开头是否匹配。

  - :star: **`endsWith(searchString[, length])`**

    判断字符串结尾是否匹配。

  - :star: **`includes(searchString[, position])`**

    判断一个字符串是否包含在另一个字符串中。

  - **`charAt(index)`**

  - **`charCodeAt(index)`**

    返回 0 到 65535 之间的整数，表示给定索引处的 UTF-16 代码单元。

  - **`codePointAt(pos)`**

    返回一个 Unicode 编码点值的非负整数。

  - **`normalize([form])`**

    返回根据 `form` 标准化后的字符串。

  - :star: **`indexOf(searchValue [, fromIndex])`**

    查找的字符串 `searchValue` 的第一次出现的索引，如果没有找到，则返回 -1 。

  - **`lastIndexOf(searchValue[, fromIndex])`**

  - :star: **`match(regexp)`**

    返回一个字符串匹配正则表达式的字符串数组。

    如果使用 `g` 标志，则将返回与完整正则表达式匹配的所有结果，但不会返回捕获组。

    如果未使用 `g` 标志，则仅返回第一个完整匹配及其相关的捕获组。

  - :star: **`matchAll(regexp)`**

    返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。

  - :star: **`search(regexp)`**

    返回正则表达式在字符串中首次匹配项的索引，否则返回 -1 。

  - :star: **`replace(pattern, newSubStr|function)`**

    替换字符串中匹配的字符串。第二个参数可以是字符串，或者一个处理匹配项的函数。

    如果 `pattern` 是字符串，则只替换第一个匹配项。

    如果 `pattern` 是正则对象，则会应用每一个匹配项。

  - :star: **`replaceAll(pattern, newSubStr|function)`**

    根据 `pattern` 替换所有匹配项。

  - **`localeCompare(compareString[, locales[, options]])`**

    返回一个数字来指示一个参考字符串是否在排序顺序前面或之后或与给定字符串相同。

  - **`valueOf()`**

* 类方法

  - **`String.fromCharCode(...nums)`**

    返回由 `nums` UTF-16 代码单元组成的字符串。

  - **`String.fromCodePoint(...nums)`**

    返回由 `nums` Unicode 编码位置组成的字符串。

  - **`String.raw(template, ...substitutions)`**

    根据 `template` 参数创建新字符串，`substitutions` 是内插字符串。（具体见链接）

    **``String.raw `template` ``**

    返回一个字符串，`template` 中可以使用 `${...}` 。

## [Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)

* 构造方法

  - **`new Date()`**

  - **`new Date(timestamp)`**

  - **`new Date(dateString)`**

  - **`new Date(year, month, date, hrs, min, sec, ms)`**

    参数从右向左可选。

  - **`Date()`**

    返回一个字符串。

* [实例原型 - MDN](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/JavaScript/Reference/Global_Objects/Date)

* 类方法

  - **`Date.now()`**

    返回自 1970-1-1 00:00:00 UTC 到当前时间的毫秒数。

  - **`Date.parse(dateString)`**

    返回自 1970-1-1 00:00:00 UTC 到给定日期字符串所表示时间的毫秒数。

    等同于 `new Date(dateString).getTime()` 。

  - **`Date.UTC(year, month, date, hrs, min, sec, ms)`**

    返回从 1970-1-1 00:00:00 UTC 到指定日期的的毫秒数。

### 参考

[Function - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)

[Object - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

[Array - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

[Number - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)

[String - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)

[Date - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
