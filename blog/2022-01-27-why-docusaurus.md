---
slug: why-docusaurus
title: 从 VuePress 迁移到 Docusaurus
authors: RainbowTalaxy
---

这篇文章会告诉你，为什么我从 VuePress 迁移到了 Docusaurus 。

<!--truncate-->

## 先来看看 VuePress

其实 VuePress 已经是个搭建文档网站的不错选择。我之前是用的 VuePress 的 v1 版本搭建的。现在的 v2 还在 beta 阶段，主要是接入了 TS ，以及提供更标准的 API 。

### 优点

当时还有别的文档搭建工具选择，比如老牌 WordPress 、Hexo 等（都挺出名的）。但还是选择了 VuePress ，因为：

-   **Markdown 驱动**，VuePress 会帮你将 MD 转为 HTML ；

-   **轻量化**，搭建成本低，学习成本也低；

-   页面**干净简单**，可以稍加定制。

### 小小不满

我已经使用了半年多的 VuePress ，在上面写了几十篇文章。它基本满足了我的需求，只有一些不满：

-   Markdown 的代码块样式太简陋（ v2 已经做了提升，样式和 VSCode 差不多）；

-   虽然路由很完善，但没有博客功能；

-   由于是使用 Vue ，React 用户不太能施展拳脚；

-   只支持页面的实时改动，改动配置项需重跑项目（没试过用 nodemon ）。

## 然后...选择了 Docusaurus

后来我是实在想在页面上使用 React ，就尝试搜了下类似 VuePress 的 React 文档网站构建工具，结果还真搜到了：Docusaurus 。'Docu' 应该是 “文档” 的意思，而 '-saurus'（ | ˈsɔːrəs | ），查了下是爬行动物的标准命名后缀（ Docusaurus 的 logo 也是只小鳄鱼）。

### 优点

它（ v2 版本）的优点太直接了，开门见山：

-   使用 React 构建的文档网站，支持用 React 编写文档页面；

-   支持 [MDX](https://mdxjs.com) ，即在 markdown 中使用 JSX ；

-   完全支持 TypeScript ;

-   除了文档，还支持博客功能、暗黑模式；

-   支持项目的实时编译构建（很少情况下需要手动重跑）。

就到我写这篇文章为止，Docusaurus 已经超出了我的预期。

## 如何用 Docusaurus

官网上有相应的 [中文教程](https://docusaurus.io/zh-CN/docs/category/getting-started) 。我稍微说下我具体是怎么构建的：

1.  创建项目。因为我使用 TypeScript ，所以加了 `--typescript` 修饰：

    ```sh
    npx create-docusaurus@latest blog classic --typescript
    ```

2.  由于装的是经典模版，所以要清除一些（比如 `blog` 、`docs` 文件夹中的）样例文件。

3.  更换一下图标文件，还有 `docusaurus.config.js` 中的基础属性。修改了 `blog/authors.yml` 中的作者信息。

4.  装了 styled-component 库，以及对应的 type 库。

5.  修改首页，即 `src/pages/index.tsx` 文件。在 `src/css/custom.css` 中修改了主题色（可以直接自定义暗黑模式两套颜色）。

## 小结

Docusaurus 真的是个宝藏工具，它的优点很明显。不过如果你是 Vue 用户，还是应当首选 VuePress 。

## 参考

[从 v1 迁移 - VuePress](https://v2.vuepress.vuejs.org/zh/guide/migration.html)
