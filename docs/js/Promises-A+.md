---
tags:
  - js
---

# Promises/A+

## 术语

1. "promise" 是一个对象或者函数，它拥有一个 `then` 方法。

2. "thenable" 是一个对象或者函数，且定义了 `then` 方法。

3. "value" 是任何合法的 JS 值。

4. "exception" 是一个值，它通过 throw 语句抛出。

5. "reason" 是一个值，它表明为什么一个 promise 被拒绝。

## 要求

### Promise 状态

一个 promise 必须为三个状态中的其一：`pending`、`fulfilled`、`rejected` 。

* 当为 `pending` 时，promise 应当：

  - 可以转变为 `fulfilled` 或 `rejected` 。

* 当为 `fulfilled` 时，promise 应当：

  - 不可以转为其他状态；

  - 必须有一个 value ，且不能改变。

* 当为 `rejected` 时，promise 应当：

  - 不可以转为其他状态；

  - 必须有一个 reason ，且不能改变。

### then 方法

一个 promise 必须提供一个 `then` 方法来访问它当前或最终的 value 或 reason 。

一个 promise 的 `then` 方法接收两个参数：

```js
promise.then(onFulfilled, onRejected)
```

* `onFulfilled` 和 `onRejected` 皆为可选参数：

  - 如果 `onFulfilled` 不是函数，则忽略；

  - 如果 `onRejected` 不是函数，则忽略。

* 当 `onFulfilled` 为函数时：

  - 它必须在 promise 为 `fulfilled` 后被调用，且 promise 的 value 将作为参数传入；

  - 它不能在 promise 为 `fulfilled` 之前被调用；

  - 它不能被多次调用。

* 当 `onRejected` 为函数时：

  - 它必须在 promise 为 `rejected` 后被调用，且 promise 的 reason 将作为参数传入；

  - 它不能在 promise 为 `rejected` 之前被调用；

  - 它不能被多次调用。

* 直到执行上下文栈仅包含平台代码<sup>[[1]](#注释)</sup>，`onFulfilled` 和 `onRejected` 不能被调用。

* `onFulfilled` 和 `onRejected` 必须以函数形式调用（也就是说不能用 `this` 值<sup>[[2]](#注释)</sup>）。

* 在同一个 promise 上，`then` 可能被调用许多次。

  - 当 promise 为 `fulfilled` 时，所有各自的 `onFulfilled` 回调必须根据 `then` 的调用顺序执行；

  - 当 promise 为 `rejected` 时，所有各自的 `onRejected` 回调必须根据 `then` 的调用顺序执行。

* `then` 必须返回一个 promise 。

  ```js
  promise2 = promise1.then(onFulfilled, onRejected)
  ```

  - 当 `onFulfilled` 或 `onRejected` 返回了一个 value `x` ，则运行 Promise 解决流程 `[[Resolve]](promise2, x)` ；

  - 当 `onFulfilled` 或 `onRejected` 抛出了一个异常 `e` ，`promise2` 必须拒绝 `e` 作为 `reason` ；

  - 如果 `onFulfilled` 不是个函数且 `promise1` 为 `fulfilled` ，`promise2` 必须以和 `promise1` 同样的 value 变为 `fulfilled` 状态；

  - 如果 `onRejected` 不是个函数且 `promise1` 为 `rejected` ，`promise2` 必须以和 `promise1` 同样的 reason 变为 `rejected` 状态；

### Promise 解决流程

Promise 解决流程是一个抽象的操作，它接收一个 promise 和一个 value ，或者表示为 `[[Resolve]](promise, x)` 。如果 `x` 是 thenable ，它尝试去让 `promise` 采纳 `x` （假设 `x` 行为得至少像一个 promise ），然后用 `x` 来让 `promise` 处于 `fulfilled` 状态。

执行 `[[Resolve]](promise, x)` 遵循以下步骤：

1. 如果 `promise` 和 `x` 是同一个对象，则拒绝 `promise` 并将 TypeError 作为 reason 。

2. 如果 `x` 是个 promise ，采用它的状态：

    - 如果 `x` 为 `pending` ，promise 必须保持 `pending` 直到 `x` 改变状态；

    - 如果 `x` 为 `fulfilled` ，则用相同的 value 将 `promise` 状态改为 `fulfilled` ；

    - 如果 `x` 为 `rejected` ，则用相同的 reason 将 `promise` 状态改为 `rejected` 。

3. 如果 `x` 不是 `promise` ，但它是一个对象或函数：

    1. 将 `then` 赋值为 `x.then` ；

    2. 如果访问 `x.then` 会抛出异常 `e` ，则拒绝 `promise` ，并将 `e` 作为 reason ；

    3. 如果 `then` 是一个函数，则以 `x` 作为 `this` 调用它，且第一个参数为 `resolvePromise` ，第二个为 `rejectPromise` ，其中：

        - 当 `resolvePromise` 通过 `y` value 调用，则运行 `[[Resolve]](promise, y)` ；

        - 当 `rejectPromise` 通过 `r` reason 调用，则用 `r` 拒绝 `promise` ；

        - 如果 `resolvePromise` 和 `rejectPromise` 都被调用了，或者被调用了多次，则只有第一次调用有效；

        - 如果调用 `then` 的时候抛出异常 `e` ：

          + 如果 `resolvePromise` 或 `rejectPromise` 被调用了，则忽略它；

          + 否则，以 `e` 作为理由拒绝 `promise` 。

        - 如果 `then` 不是一个函数，则用 `x` 将 `promise` 状态改为 `fulfilled` 。

    4. 如果 `x` 不是对象或函数，则用 `x` 将 `promise` 状态改为 `fulfilled` 。

## 注释

[1] 这里的 "平台代码" 是指引擎、环境、promise 实现代码。在实践中，这个要求能确保在 `then` 被调用的事件循环轮次之后，`onFulfilled` 和 `onRejected` 在新的栈中异步地执行。这可以用 "宏任务" 机制（比如 `setTimeout` 或 `setImmediate` ），或者 "微任务" 机制（比如 `MutationObserver` 或 `process.nextTick` ）来实现。虽然 promise 的实现被认为是平台代码，但它自身可能包含一个任务调度队列，或者是一个调用处理函数的 "trampoline" 。

[2] 在严格模式中，`this` 值为 `undefined` ；非严格模式则为全局对象。

---

### 参考

[Promises/A+ - promisesaplus.com](https://promisesaplus.com/)