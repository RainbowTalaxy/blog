---
title: Yarn link 使用
authors: RainbowTalaxy
---

`yarn link` 命令可以用来在你的项目中链接本地的包，一般用于测试。

<!--truncate-->

## 使用

> 如果你已经通过 `yarn add` 安装了该包，建议先删了它。（当然我也不知道必不必要）

1. 在你要连接的本地包里执行：

    ```sh
    yarn link
    ```

    它会在 `~/.config/yarn/link` 里注册包名所对应的文件路径（需要的话可以手动修改路径）。

2. 上述命令执行后 Yarn 通常会告诉你包链接创建完成，以及如何在项目中链接该本地包。一般为：

    ```sh
    # 在你的项目中
    yarn link 包名
    ```

这个时候 `node_modules` 下会有一个 `my-utils` 文件，且软链接到你的本地包（即，你本地包的修改是对 `node_modules` 有效的）。

## 断开链接

对应的，可以使用 `yarn unlink` 注销链接，以及用 `yarn unlink 包名` 来断开链接。

项目中断开链接后 Yarn 也会提示你使用 `yarn install --force` ，否则无法用 `yarn add` 安装该包。

## 参考

[yarn link - classic.yarnpkg.com](https://classic.yarnpkg.com/en/docs/cli/link)

[yarn link 与 npm link 使用及原理，Lion - 掘金](https://juejin.cn/post/6844904164468768776)
