---
title: '使用 Tailwind CSS'
---

## 安装 Tailwind CSS

1. 安装 npm 包：

    ```sh
    yarn add -D tailwindcss autoprefixer
    ```

2. 添加配置文件 `tailwind.config.js` ：

    ```sh
    npx tailwindcss init --full
    ```

3. 添加配置文件 `postcss.config.js` ：

    ```js
    module.exports = {
        plugins: [
            require('tailwindcss'),
            require('tailwindcss/nesting'),
            require('autoprefixer'),
        ],
    };
    ```

4. 在 src/css/custom.css 头部导入 Tailwind ：

    ```css
    .tailwind {
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
    }
    ```

5. 组件 Demo ：

    ```tsx
    import React from 'react';
    import Layout from '@theme/Layout';

    const View = () => {
        return (
            <Layout pageClassName="tailwind">
                <div className="text-blue-600">Tailwind CSS</div>
            </Layout>
        );
    };

    export default View;
    ```

## VS Code 设置

添加插件：

-   Tailwind CSS IntelliSense - Tailwind Labs

-   PostCSS Language Support - csstools

## 参考

[Install Tailwind CSS with Create React App - Tailwind CSS](https://tailwindcss.com/docs/guides/create-react-app)

[如何在 Docusaurus 中引入 TailwindCSS - Stray Episode](https://farer.org/2021/10/08/docusaurus-with-tailwindcss/)
