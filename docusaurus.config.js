// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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

    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'gallery',
                path: 'gallery',
                routeBasePath: 'gallery',
                sidebarPath: require.resolve('./sidebars.js'),
            },
        ],
    ],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
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
                        href: 'https://unsplash.com/@talaxy',
                        label: 'Unsplash',
                        position: 'right',
                    },
                    {
                        href: 'https://github.com/RainbowTalaxy',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [],
                copyright: `Copyright © ${new Date().getFullYear()} Your Talaxy`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
