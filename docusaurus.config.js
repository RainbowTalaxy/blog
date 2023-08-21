// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Talaxy',
    url: 'https://blog.talaxy.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/mercy.png',
    organizationName: 'RainbowTalaxy', // Usually your GitHub org/user name.
    projectName: 'blog', // Usually your repo name.

    markdown: {
        mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],

    plugins: [
        () => ({
            name: 'tailwind-extension',
            configurePostCss(postcssOptions) {
                postcssOptions.plugins.push('tailwindcss', 'autoprefixer');
                return postcssOptions;
            },
        }),
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'gallery',
                path: 'gallery',
                routeBasePath: 'gallery',
            },
        ],
    ],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./templates/sidebars.js'),
                    remarkPlugins: [math],
                    rehypePlugins: [katex],
                },
                blog: {
                    showReadingTime: true,
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    stylesheets: [
        {
            href: 'https://blog.talaxy.cn/statics/katex/katex.min.css',
            type: 'text/css',
            crossorigin: 'anonymous',
        },
        {
            href: 'https://blog.talaxy.cn/statics/firacode/fira_code.css',
            type: 'text/css',
            crossorigin: 'anonymous',
        },
    ],

    i18n: {
        defaultLocale: 'zh-cn',
        locales: ['zh-cn'],
    },

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Talaxy',
                logo: {
                    alt: 'My Site Logo',
                    src: 'img/mercy.png',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'doc-intro',
                        label: '笔记',
                        position: 'left',
                    },
                    { to: '/blog', label: '博客', position: 'left' },
                    { to: '/gallery', label: '画廊', position: 'left' },
                    {
                        to: '/changelog',
                        label: '版本更新',
                        position: 'right',
                        className: 'header-placeholder',
                    },
                    {
                        href: 'https://github.com/RainbowTalaxy',
                        position: 'right',
                        className: 'header-github-link',
                        'aria-label': 'GitHub repository',
                    },
                ],
            },
            footer: {
                style: 'light',
                links: [],
                copyright: `Copyright © ${new Date().getFullYear()} Your Talaxy<br/><a href="http://beian.miit.gov.cn/" target="_blank">苏ICP备19075978号</a>`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
