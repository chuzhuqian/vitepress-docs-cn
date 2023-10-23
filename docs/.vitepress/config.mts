import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress",
  description: "a blog site",
  cleanUrls: true,
  base: '/vitepress-doc-cn/',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-logo-mini.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/vitepress-logo-mini.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'VitePress' }],
    ['meta', { name: 'og:image', content: 'https://vitepress.dev/vitepress-og.jpg' }],
    ['script', { src: 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', defer: '' }]
  ],
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