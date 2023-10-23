import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress",
  description: "a blog site",
  cleanUrls: true,
  base: '/vitepress-doc-cn/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/guide/what-is-VitePress' },
      { text: '参考', link: '/reference/site-config' }
    ],

    sidebar: {
        '/guide/': {
          base: '/guide/',
          items: [
            {
              text: '介绍',
              collapsed: false,
              items: [
                { text: '简介', link: 'what-is-VitePress' },
                { text: '快速上手', link: 'getting-started' },
                { text: '路由', link: 'routing' },
                { text: '部署', link: 'deploy' },
              ]
            },
            {
              text: '介绍',
              collapsed: false,
              items: [
                { text: 'Markdown Examples', link: '/markdown-examples' },
                { text: 'Runtime API Examples', link: '/api-examples' }
              ]
            }
          ]
        },
        '/reference/': {
          base: '/reference/',
          items: [
            {
              text: '介绍',
              collapsed: false,
              items: [
                { text: 'Markdown Examples', link: '/markdown-examples' },
                { text: 'Runtime API Examples', link: '/api-examples' }
              ]
            }
          ]
        }
      },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})