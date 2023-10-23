---
outline: deep
---

# 路由

## 基于文件的路由

VitePress 使用基于文件的路由，这意味着生成的 HTML 页面是从 Markdown 源文件的目录结构映射而来的。例如，给定下列目录结构：

```
.
├─ guide
│  ├─ getting-started.md
│  └─ index.md
├─ index.md
└─ prologue.md
```
将会生成下列 HTML 页面：

```
index.md                  -->  /index.html (accessible as /)
prologue.md               -->  /prologue.html
guide/index.md            -->  /guide/index.html (accessible as /guide/)
guide/getting-started.md  -->  /guide/getting-started.html
```
生成的HTML文件可以托管在任何可以提供静态文件服务的web服务器上。

## 根目录和源目录

在VitePress项目的文件结构里有两个重要的概念：**根目录**和**源目录**。

### 项目根目录

VitePress 会在项目根尝试查找特殊目录 `.vitepress`，`.vitepress` 是配置文件、开发服务缓存、构建物及可选主题自定义代码的预定位置。

当使用命令行运行 `vitepress dev` 或者 `vitepress build` 时，VitePress 将使用当前工作目录作为项目根目录。要将子目录指定为根目录，您需要将相对路径传递给命令。例如，如果你的项目在`./docs`中，你应该运行`vitepress dev docs`：

```
.
├─ docs                    # project root
│  ├─ .vitepress           # config dir
│  ├─ getting-started.md
│  └─ index.md
└─ ...
```

```sh
vitepress dev docs
```

将生成以下Markdown到HTML文件的映射：

```
docs/index.md            -->  /index.html (accessible as /)
docs/getting-started.md  -->  /getting-started.html
```

### 源目录

源目录是 Markdown 源文件所在的位置，默认情况下它与项目根目录相同。但是，你可以通过 [`srcDir`](../reference/site-config#srcdir) 选项进行配置。

`srcDir` 相对于跟目录被解析。例如，使用`srcDir: 'src'`，你的文件结构将如下所示：

```
.                          # project root
├─ .vitepress              # config dir
└─ src                     # source dir
   ├─ getting-started.md
   └─ index.md
```

将生成以下Markdown到HTML文件的映射：

```
src/index.md            -->  /index.html (accessible as /)
src/getting-started.md  -->  /getting-started.html
```

## 页面间链接

在页面之间链接时可以使用相对和绝对路径。请注意，虽然`.md` 和 `.html`都可以生效，但最佳实践是省略文件扩展名，以便VitePress可以基于你的配置生成最终的URL。

```md
<!-- 推荐 -->
[Getting Started](./getting-started)
[Getting Started](../guide/getting-started)

<!-- 不推荐 -->
[Getting Started](./getting-started.md)
[Getting Started](./getting-started.html)
```
关于静态资源链接（例如图片）在[静态资源处理](./asset-handling)了解更多。

### 链接到非VitePress页面

如果想要在网站中链接到非VitePress生成的页面，你需要使用完整的URL（在新选项卡中打开）或者明确指定target：

**输入**

```md
[Link to pure.html](/pure.html){target="_self"}
```

**输出**

[Link to pure.html](/pure.html){target="_self"}

::: tip 注意

在Markdown链接中，基础路径`base`会被自动添加到URL前面。这意味着如果你想链接到基础路径之外的页面，链接中可能需要 `../../pure.html` 之类的内容（浏览器相对当前页面解析）。

或者，您可以直接使用锚标记语法：

```md
<a href="/pure.html" target="_self">Link to pure.html</a>
```

:::

## 生成简洁URL

::: warning 需要服务器支持
使用VitePress提供的简洁URL需要服务端支持。
:::

默认情况下，VitePress会将内部链接解析成以`.html`结尾的URL。但是，部分用户可能更喜欢没有`.html`扩展名的简洁链接。例如，用`example.com/path` 代替 `example.com/path.html`。

某些服务器或托管平台（如 Netlify 或 Vercel）提供将 /foo 映射到 /foo.html（如果存在）的功能，且无需重定向：

- Netlify 默认支持此功能。
- Vercel 需要[在 `vercel.json`中开启`cleanUrls`选项](https://vercel.com/docs/concepts/projects/project-configuration#cleanurls).

如果您可以使用此功能，那么您还可以启用 VitePress 自己的 `cleanUrls` 配置选项，以便：

- 生成的页面之间的内部链接不带 `.html` 扩展名。
- 如果当前路径包含 `.html`，路由将会执行客户端的重定向到无扩展路径。

但是，如果您无法配置具有此类支持的服务器（例如 GitHub 页面），则必须手动采用以下目录结构：

```
.
├─ getting-started
│  └─ index.md
├─ installation
│  └─ index.md
└─ index.md
```

## 路由重写

你可以自定义源目录结构和生成页面之间的映射关系。当你有复杂的项目结构，这很有用。例如，假设您有一个包含多个包的单体仓库，并且希望将文档与源文件一起放置，如下所示：

```
.
├─ packages
│  ├─ pkg-a
│  │  └─ src
│  │      ├─ pkg-a-code.ts
│  │      └─ pkg-a-docs.md
│  └─ pkg-b
│     └─ src
│         ├─ pkg-b-code.ts
│         └─ pkg-b-docs.md
```

并且想要VitePress生成的页面如下所示：

```
packages/pkg-a/src/pkg-a-docs.md  -->  /pkg-a/index.html
packages/pkg-b/src/pkg-b-docs.md  -->  /pkg-b/index.html
```

可以通过配置[`rewrites`](../reference/site-config#rewrites)选项来实现此目的，如下所示：

```ts
// .vitepress/config.js
export default {
  rewrites: {
    'packages/pkg-a/src/pkg-a-docs.md': 'pkg-a/index.md',
    'packages/pkg-b/src/pkg-b-docs.md': 'pkg-b/index.md'
  }
}
```

`rewrites`选项同样支持动态路由参数。在上面的示例中，如果有很多包，则列出所有路径会很冗长。鉴于它们都具有相同的文件结构，您可以像这样简化配置：

```ts
export default {
  rewrites: {
    'packages/:pkg/src/(.*)': ':pkg/index.md'
  }
}
```

重写的路径基于 `path-to-regexp` 这个包进行编译，参考[它的文档](https://github.com/pillarjs/path-to-regexp#parameters)查考更多高级语法。

::: warning 重写时的相对链接

当启用重写时，**相对链接应基于重写的路径**。例如，为了创建从`packages/pkg-a/src/pkg-a-code.md`到`packages/pkg-b/src/pkg-b-code.md`的相对链接，您应该使用：

```md
[Link to PKG B](../pkg-b/pkg-b-code)
```
:::

## 动态路由

你可以通过一个Markdown文件和动态数据生成很多页面。例如，您可以创建一个`packages/[pkg].md`文件，为项目中的每个包生成相应的页面。 在这里`[pkg]`部分是由于区分每个页面和其他页面的路由**参数**。

### 路径加载文件

由于 VitePress 是静态网站生成器，因此必须在构建时确定可能的页面路径。因此，动态路由页面必须附带**路径加载文件**。对于`packages/[pkg].md`, 我们需要 `packages/[pkg].paths.js` (同样支持`.ts`):

```
.
└─ packages
   ├─ [pkg].md         # route template
   └─ [pkg].paths.js   # route paths loader
```

路径加载器应该提供一个包含`paths`方法的对象并作为默认导出。`paths`方法应该返回一个包含`params`属性的对象数组，每个对象将生成一个对应的页面。

给定以下`paths`数组：

```js
// packages/[pkg].paths.js
export default {
  paths() {
    return [
      { params: { pkg: 'foo' }},
      { params: { pkg: 'bar' }}
    ]
  }
}
```

生成的HTML页面如下：

```
.
└─ packages
   ├─ foo.html
   └─ bar.html
```

### 多个参数

动态路由可以包含多个参数：

**文件结构**

```
.
└─ packages
   ├─ [pkg]-[version].md
   └─ [pkg]-[version].paths.js
```

**路径加载器**

```js
export default {
  paths: () => [
    { params: { pkg: 'foo', version: '1.0.0' }},
    { params: { pkg: 'foo', version: '2.0.0' }},
    { params: { pkg: 'bar', version: '1.0.0' }},
    { params: { pkg: 'bar', version: '2.0.0' }}
  ]
}
```

**输出**

```
.
└─ packages
   ├─ foo-1.0.0.html
   ├─ foo-2.0.0.html
   ├─ bar-1.0.0.html
   └─ bar-2.0.0.html
```

### 动态生成路径

路径加载器模块在 Node.js 中运行，并且仅在构建时执行，你可以使用本地或远程数据动态生成`path`数组。

利用本地文件生成路径：

```js
import fs from 'fs'

export default {
  paths() {
    return fs
      .readdirSync('packages')
      .map((pkg) => {
        return { params: { pkg }}
      })
  }
}
```

利用远程数据生成路径：

```js
export default {
  async paths() {
    const pkgs = await (await fetch('https://my-api.com/packages')).json()

    return pkgs.map((pkg) => {
      return {
        params: {
          pkg: pkg.name,
          version: pkg.version
        }
      }
    })
  }
}
```

### 在页面中访问参数

可以使用参数将附加数据传递到每个页面。Markdown路由文件可以在Vue表达式中通过全局属性`$params`访问当前页面参数：

```md
- package name: {{ $params.pkg }}
- version: {{ $params.version }}
```

你也可以通过运行时API[`useData`](../reference/runtime-api#usedata)访问当前页面参数，这在Markdown文件和Vue组中件都可用：

```vue
<script setup>
import { useData } from 'vitepress'

// params is a Vue ref
const { params } = useData()

console.log(params.value)
</script>
```

### 渲染原始内容

传递到页面的参数将在客户端 JavaScript 负载中序列化，所以你应该避免在参数中传递大量数据，例如从远程 CMS 获取的原始 Markdown 或 HTML 内容。

相反，您可以使用每个`path`对象上的`content`属性将此类内容传递到每个页面：

```js
export default {
  async paths() {
    const posts = await (await fetch('https://my-cms.com/blog-posts')).json()

    return posts.map((post) => {
      return {
        params: { id: post.id },
        content: post.content // raw Markdown or HTML
      }
    })
  }
}
```

然后，使用下列特殊语法将内容呈现为 Markdown 文件本身的一部分：

```md
<!-- @content -->
```