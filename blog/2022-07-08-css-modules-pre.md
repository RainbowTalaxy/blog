---
title: CSS Module 初探
authors: RainbowTalaxy
---

## import CSS 文件

Webpack 的 `css-loader` 允许了 CSS 文件作为导入：

```js
import './example.css';
```

但是文件中的 CSS 样式会直接放在 `<head>` 的 `<link>` 中，及全局样式。

## CSS Modules

CSS Modules 则是对 CSS 文件做了处理，让其中的 class 经过哈希映射成独立的样式。比如：

```css title="./example.module.css"
.title {
    font-size: 36px;
    font-weight: bold;
}
```

文件中的 `title` 会被哈希为类似 "izyufMaXFclQUpAi-RKh1Q\=\=" 的乱码，因此不会影响到别的 `title` 类元素。当然，在应用样式时 css-loader 也暴露了应用类名的方式：

```jsx
import { title } from './example.module.css';

const Title = ({ children }) => {
    return <div className={title}>{children}</div>;
};
```

## 配置 CSS Modules

css-loader 默认启用了 CSS Modules ，具体为 [`modules`](https://github.com/webpack-contrib/css-loader#modules) 选项。但是默认仅对（大概为，具体见文档） `*.module.css` 的文件名启用，如果需要对所有 CSS 文件启用，则需要将 `modules` 选项设为 `true` 。

对于 TypeScript ，可以装 `typescript-plugin-css-modules` 插件：

```json title="tsconfig.json"
{
    "name": "typescript-plugin-css-modules"
}
```

在一个全局的 `.d.ts` 文件里定义：

```ts title="global.d.ts"
declare module '*.module.css';
```

## 类名问题

因为 CSS 常规用 '-' 来分割词，而非驼峰命名，所以引用类名的时候可能会需要这样：

```jsx
import styles from './example.module.css';

const Title = ({ children }) => {
    return <div className={styles['card-label']}>{children}</div>;
};
```

不过 css-loader 可以将 '-' 命名转为驼峰，通过设置 `modules` 选项的 [`exportLocalsConvention`](https://github.com/webpack-contrib/css-loader#exportlocalsconvention) 属性：

```js
{
    loader: 'css-loader',
    options: {
        importLoaders: 2,
        modules: {
            exportLocalsConvention: 'dashes',
        },
    },
},
```

如果是 TypeScript ，需要同步 `typescript-plugin-css-modules` 的设置：

```json title="tsconfig.json"
{
    "name": "typescript-plugin-css-modules",
    "options": {
        "classnameTransform": "dashes"
    }
}
```

同时需要配置 VS Code 里使用的 TypeScript （ VS Code 默认使用自带的 typescript 而非 workspace 的）：

```json title=".vscode/settings.json"
{
    "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 参考

[CSS Modules - GitHub](https://github.com/css-modules/css-modules)

[typescript-plugin-css-modules - GitHub](https://github.com/mrmckeb/typescript-plugin-css-modules)
