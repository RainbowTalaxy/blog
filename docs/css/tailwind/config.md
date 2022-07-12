# 基本配置

## [Content](https://tailwindcss.com/docs/content-configuration)

### 源

指定文件：

```js
module.exports = {
    content: ['./pages/**/*.{html,js}'],
    // ...
};
```

> 不要放进任何 CSS 文件。

Tailwind 使用细致的正则直接匹配代码中潜在的类名，不仅匹配 HTML 标签的 `class` 、JSX 的 `className` 、还有 JS 中的 `classList` 属性等：

```js
let classList = document.getElementById('nav').classList;
classList.toggle('hidden');
```

Tailwind 能够识别嵌套：

```js
const sizes = {
    md: 'px-4 py-2 rounded-md text-base',
    lg: 'px-5 py-3 rounded-lg text-lg',
};

export default function Button({ size, children }) {
    let sizeClasses = sizes[size];

    return (
        <button type="button" className={`font-bold ${sizeClasses}`}>
            {children}
        </button>
    );
}
```

但是禁止对单个便捷名进行动态创建：

```html
<!-- 错误 -->
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>

<!-- 正确 -->
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

如果你用 Tailwind 建了组件库，并用在了多个项目中，请确保 Tailwind 也能识别到组件库：

```js
module.exports = {
    content: [
        './pages/**/*.{html,js}',
        './node_modules/@my-company/tailwind-components/**/*.js',
    ],
    // ...
};
```

### Safe list

如果你（担心，或者真的无法识别到）的类名没有被 Tailwind 识别，可以将它们放入 `safelist` 列表中：

```js
module.exports = {
    content: ['./pages/**/*.{html,js}'],
    safelist: [
        // 基本使用
        'bg-red-500',
        'text-3xl',
        'lg:text-4xl'，
        // 使用正则
        {
            // 无法识别带变量修饰符的正则，比如 `/hover:bg-red-.+/`
            pattern: /bg-(red|green|blue)-(100|200|300)/,
        },
        // 带变量修饰
        {
            pattern: /bg-(red|green|blue)-(100|200|300)/,
            variants: ['lg', 'hover', 'focus', 'lg:hover'],
        },
    ],
    // ...
};
```

### 注意点

如果 Tailwind 在构建 CSS 样式时导致了别的文件修改，可能会导致（比如，Webpack ）的重新构建，然后再次触发了 Tailwind 构建，依次循环。理想情况下 Tailwind 会在 `console` 里警告这个循环。

可以通过细化 content 路径来避开导致循环的文件：

```js
module.exports = {
    content: [
        // './src/**/*.{html,js}',
        './src/pages/**/*.{html,js}',
        './src/components/**/*.{html,js}',
        './src/layouts/**/*.{html,js}',
        './src/index.html',
    ],
    // ...
};
```

## [Theme](https://tailwindcss.com/docs/theme)

`theme` 属性用来定义颜色、字体、尺寸、边框等值。[完整默认样式](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js)。

### 结构

#### Screen

用来处理响应式屏幕尺寸断点，[文档](https://tailwindcss.com/docs/screens)。

```js
module.exports = {
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
    },
};
```

#### Colors

定义颜色，[文档](https://tailwindcss.com/docs/colors)。`backgroundColor` `borderColor` 等默认会继承 `colors` 的属性值。

```js
module.exports = {
    theme: {
        colors: {
            transparent: 'transparent',
            black: '#000',
            white: '#fff',
            gray: {
                100: '#f7fafc',
                // ...
                900: '#1a202c',
            },
            // ...
        },
    },
};
```

> 官方推荐的调色网站：[Palettte](https://palettte.app/) 、[ColorBox](https://colorbox.io/)

#### Spacing

定义全局大小间距的尺寸，[文档](https://tailwindcss.com/docs/customizing-spacing)。`padding` `margin` `width` `height` 等默认继承 `spacing` 属性。

```js
module.exports = {
    theme: {
        spacing: {
            px: '1px',
            0: '0',
            0.5: '0.125rem',
            1: '0.25rem',
            1.5: '0.375rem',
            2: '0.5rem',
            2.5: '0.625rem',
            3: '0.75rem',
            // ...
        },
    },
};
```

### 自定义默认值

若保留默认值，并进行扩展（或者覆盖默认值），在 `extend` 中添加：

```js
module.exports = {
    theme: {
        extend: {
            // Adds a new breakpoint in addition to the default breakpoints
            screens: {
                '3xl': '1600px',
            },
        },
    },
};
```

可以在直接继承别的属性的配置：

```js
module.exports = {
    theme: {
        spacing: {
            // ...
        },
        backgroundSize: ({ theme }) => ({
            auto: 'auto',
            cover: 'cover',
            contain: 'contain',
            ...theme('spacing'),
        }),
    },
};
```

禁用某个属性：

```js
module.exports = {
    corePlugins: {
        opacity: false,
    },
};
```
