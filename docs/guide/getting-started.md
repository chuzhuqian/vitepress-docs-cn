# 快速上手

## 在线尝试

你可以在浏览器打开 [StackBlitz](https://vitepress.new) 直接体验VitePress。

## 安装

### 先决条件

+ 使用18.x.x版本的 [Node.js](https://nodejs.cn/) 或者更高版本。
+ 通过命令行界面（CLI）使用VitePress的终端。
+ 支持 [Markdown](https://en.wikipedia.org/wiki/Markdown) 语法的文本编辑器。
  + 推荐使用 [VSCode](https://code.visualstudio.com/) 以及 [Vue](https://cn.vuejs.org/) 官方扩展 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。

你不仅可以独立使用 VitePress，还可以在一个现存的项目中安装它。两种情况下，都可以使用以下命令安装它：

::: code-group

``` sh [npm]
$ npm add -D vitepress
```

```sh [pnpm]
$ pnpm add -D vitepress
```

```sh [yarn]
$ yarn add -D vitepress
```

```sh [bun]
$ bun add -D vitepress
```

:::

::: details 收到缺少对等依赖警告?
如果使用PNPM进行安装，你会注意到缺少 `@docsearch/js` 的警告。这并不影响VitePress工作，如果你不想看到这个它， 可以将下列代码添加到`package.json`:

```json
"pnpm": {
  "peerDependencyRules": {
    "ignoreMissing": [
      "@algolia/client-search",
      "search-insights"
    ]
  }
}
```

:::

::: tip 注意

VitePress仅支持ESM模块标准，不要使用 `require()`来导入它, 并确保最近的 `package.json` 包含 `"type": "module"`，或者将相关文件（如`.vitepress/config.js`）的扩展名改成 `.mjs`/`.mts`，可以参考 [Vite的故障排除指南](http://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only) 查看更多细节。此外，在异步CJS上下文中， 你可以使用`await import('vitepress')`代替。

:::

### 设置向导

VitePress 附带一个命令行设置向导，可帮助你构建基本项目。安装后，通过运行以下命令启动向导：

::: code-group

```sh [npm]
$ npx vitepress init
```

```sh [pnpm]
$ pnpm dlx vitepress init
```

```sh [bun]
$ bunx vitepress init
```

:::

你将收到几个简单的问题：

<<< @/snippets/init.ansi

::: tip Vue 作为对等依赖
如果你打算利用 Vue 组件或者API进行定制，你还应该显示安装 `vue`作为对等依赖。
:::

## 文件结构

如果你正在构建一个独立的VitePress站点，你可以在当前目录(`./`)构建该站点。然而，如果你要将VitePress安装在一个包含其他源代码的现有项目中，建议将站点构建在嵌套目录（例如`./docs`）中，以便它和项目的其余部分分开。

假设你选择在`./docs`构建项目，生成的文件结构应该如下所示

```
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```

`docs`被视为项目的根目录；`.vitepress`目录是VitePress配置文件，开发服务缓存，构建物以及可选主题自定义代码的保留位置。

::: tip
VitePress 默认在`.vitepress/cache`存储开发服务缓存，在`.vitepress/dist`存储构建产物。如果使用Git，你应该将他们添加到`.gitignore`文件中，这些位置也可以[配置](../reference/site-config#输出目录).
:::

### 配置文件

配置文件 (`.vitepress/config.js`) 允许你自定义项目的各个方面，最基础的配置是站点的名称和描述：

```js
// .vitepress/config.js
export default {
  // site-level options
  title: 'VitePress',
  description: 'Just playing around.',

  themeConfig: {
    // theme-level options
  }
}
```
你可以通过`themeConfig`选项配置主题的行为。查询[配置参考](../reference/site-config)了解所有配置选项的完整细节。

### 源文件

`.vitepress`目录外的Markdown文件被看作源文件。VitePress使用基于文件的路由模式：每个`.md`文件被编译成对应的相同路径的`.html` 文件。例如， `index.md`会被编译为`index.html`，并且在生成的站点中可以用跟路径 `/`进行访问。

VitePress同样提供了生成简洁链接、重写路径和动态生成页面的能力，这些涵盖在[路由指南](./routing)中。

## 启动并运行

如果在安装过程中允许的话，该工具还会向`package.json`注入以下npm脚本：

```json
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  ...
}
```

`docs:dev`脚本会在本地启动一个即时热更新的开发服务，执行下列命令来启动它：

::: code-group

```sh [npm]
$ npm run docs:dev
```

```sh [pnpm]
$ pnpm run docs:dev
```

```sh [yarn]
$ yarn docs:dev
```

```sh [bun]
$ bun run docs:dev
```

:::

你也可以直接调用VitePress来代替npm脚本：

::: code-group

```sh [npm]
$ npx vitepress dev docs
```

```sh [pnpm]
$ pnpm exec vitepress dev docs
```

```sh [bun]
$ bunx vitepress dev docs
```

:::

在[CLI 参考](../reference/cli)查看更多命令行用法。

开发服务将运行在 `http://localhost:5173`，在浏览器中访问URL查看正在运行的新站点！

## 下一步

- 想要更好地了解 Markdown 文件如何映射到生成的 HTML，请继续阅读[路由指南](./routing)。

- 想要了解有关在页面上可执行操作的更多信息，例如编写 Markdown 内容或使用 Vue 组件，请参阅指南的“编写”部分，可以先学习[Markdown 扩展](./markdown)。

- 想要探索默认文档主题提供的功能，请查看[默认主题配置参考](../reference/default-theme-config)。

- 如果想要更深度的自定义站点外观，可以探索[扩展默认主题](./extending-default-theme)或者[构建自定义主题](./custom-theme)。

- 一旦你的文档站点成型，请务必阅读[部署指南](./deploy)。
