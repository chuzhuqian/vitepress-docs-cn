---
outline: deep
---

# VitePress网站部署

以下指南基于这些共同的假设：

- VitePress网站位于项目的`docs`目录内。
- 你正在使用默认的构建物产出目录(`.vitepress/dist`)。
- VitePress作为一个本地依赖被安装，并且在`package.json`中已经设置了以下脚本：

  ```json
  {
    "scripts": {
      "docs:build": "vitepress build docs",
      "docs:preview": "vitepress preview docs"
    }
  }
  ```

## 本地构建和测试

1. 运行这个命令来打包`docs`：

   ```sh
   $ npm run docs:build
   ```

2. 一旦打包完成，通过以下命令在本地预览：

   ```sh
   $ npm run docs:preview
   ```

   `preview`命令会在`http://localhost:4173`域名下启动一个本地的静态web服务器来托管构建物输出目录`.vitepress/dist`。在生产环境发布前，你可以使用它来确保一切正常。

3. 你可以通过传递`--port`作为参数来配置服务端口。

   ```json
   {
     "scripts": {
       "docs:preview": "vitepress preview docs --port 8080"
     }
   }
   ```
   现在`docs:preview`方法会在`http://localhost:8080`启动服务。

## 设置公共基础路径

默认情况下，我们假设网站将部署在域的根路径(`/`)下。如果你的网站将部署在一个子路径下，`https://mywebsite.com/blog/`，你需要在VitePress配置中将[`base`](../reference/site-config#base)选项设为`'/blog/'`。

**Example:** 如果你想使用Github (or GitLab)页面，并且部署在`user.github.io/repo/`，将`base`设置为`/repo/`.

## HTTP缓存标头

如果您可以控制生产服务器上的 HTTP 标头，则可以配置`cache-control` 以在重复访问时获得更好的性能。

生产环境使用哈希文件名为静态资源命名（JavaScript、CSS以及其他不在`public`文件夹内导入的资源）。如果您使用浏览器开发工具的网络选项卡检查生产预览，您将看到类似`app.4f283b18.js`的文件。

哈希哲`4f283b18`是根据文件的内容生成的。保证相同的哈希URL提供相同的内容————如果文件内容发生变化，URL也会变化。这意味着您可以安全地对这些文件使用最强的缓存标头。所有此类文件都将放置在输出目录中的`asset/`下，因此可以为它们配置以下标头：

```
Cache-Control: max-age=31536000,immutable
```

::: details 例如 Netlify `_headers` 文件

```
/assets/*
  cache-control: max-age=31536000
  cache-control: immutable
```

注意：`_headers`文件应该被放置在[public](./asset-handling#the-public-directory)目录下（在我们的例子中为 `docs/public/_headers`），以便将其逐字复制到输出目录。

[Netlify自定义标头文档](https://docs.netlify.com/routing/headers/)

:::

::: details 例如 Vercel配置 `vercel.json`

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

注意：`vercel.json`文件应该被放置在储存库的跟目录下.

[Vercel标头配置文档](https://vercel.com/docs/concepts/projects/project-configuration#headers)

:::

## 平台指南

### Netlify / Vercel / Cloudflare Pages / AWS Amplify / Render

开始一个新项目并更改这些设置：

- **构建命令：** `npm run docs:build`
- **输出目录：** `docs/.vitepress/dist`
- **Node版本：** `18` (或者以上)

::: warning
不要为HTML代码启用自动压缩等选项，这将送输出中删除对Vue有意义的注释。如果移除这些注释的话会导致页面内容和实际不一致的错误。
:::

### GitHub Pages

1. 在项目`.github/workflows` 目录下创建一个名为`deploy.yml`的文件，其中的内容如下：

   ```yaml
   # 用于构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
   #
   name: Deploy VitePress site to Pages

   on:
     # 在针对“main”分支的推送上运行，如果你将“master”分支作为默认分支将它改为“masteer”。
     push:
       branches: [main]

     # 允许你从Actions面板手动运行工作流。
     workflow_dispatch:

   # 设置 GITHUB_TOKEN 的权限以允许部署到 GitHub Pages。
   permissions:
     contents: read
     pages: write
     id-token: write

   # 仅允许一项并发部署，跳过正在进行的运行和最新排队的运行之间排队的运行。
   # 但是，请勿取消正在进行的运行，因为我们希望完成这些生产部署。
   concurrency:
     group: pages
     cancel-in-progress: false

   jobs:
     # Build job
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
           with:
             fetch-depth: 0 # Not needed if lastUpdated is not enabled
         # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
         # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: 18
             cache: npm # or pnpm / yarn
         - name: Setup Pages
           uses: actions/configure-pages@v3
         - name: Install dependencies
           run: npm ci # or pnpm install / yarn install / bun install
         - name: Build with VitePress
           run: |
             npm run docs:build # or pnpm docs:build / yarn docs:build / bun run docs:build
             touch docs/.vitepress/dist/.nojekyll
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v2
           with:
             path: docs/.vitepress/dist

     # Deployment job
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       needs: build
       runs-on: ubuntu-latest
       name: Deploy
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v2
   ```

   ::: warning
   确保在你的VitePress配置中`base`选项被正确配置。前往[设置公共基础路径](#setting-a-public-base-path) 查看更多细节。
   :::

2. 在仓库的设置中的“Pages”菜单项下，选择“Build and deployment > Source”中的“GitHub Actions”。

3. 向`main`推送你的代码，等待GitHub Actions工作流完成部署，你应该会在`https://<username>.github.io/[repository]/`或者`https://<custom-domain>/`访问到你的网站，这取决于你的设置。网站将在每一次推送到`main`分支时自动部署。

### GitLab Pages

1. 在VitePress配置中将`outDir`设为`../public`。如果想要部署到`https://<username>.gitlab.io/<repository>/`，将`base`选项设为`'/<repository>/'`。

2. 在跟目录创建包含以下内容的文件`.gitlab-ci.yml`，每当更改内容时，这将会打包和部署你的网站：

   ```yaml
   image: node:18
   pages:
     cache:
       paths:
         - node_modules/
     script:
       # - apk add git # Uncomment this if you're using small docker images like alpine and have lastUpdated enabled
       - npm install
       - npm run docs:build
     artifacts:
       paths:
         - public
     only:
       - main
   ```

### Azure静态web应用

1. 参考[官方文档](https://docs.microsoft.com/en-us/azure/static-web-apps/build-configuration).

2. 在你的配置文件中设置这些值（并删除不需要的值，例如`api_location`）：

   - **`app_location`**: `/`
   - **`output_location`**: `docs/.vitepress/dist`
   - **`app_build_command`**: `npm run docs:build`

### Firebase

1. 在项目根目录创建文件`firebase.json`和`.firebaserc`：

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "docs/.vitepress/dist",
       "ignore": []
     }
   }
   ```

   `.firebaserc`:

   ```json
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

2. 在运行`npm run docs:build`之后，运行下列命令进行部署：

   ```sh
   firebase deploy
   ```

### Surge

1. 在运行`npm run docs:build`之后，运行下列命令进行部署：

   ```sh
   npx surge docs/.vitepress/dist
   ```

### Heroku

1. 在[`heroku-buildpack-static`](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-static)参考文档指南。

2. 在项目根目录创建文件`static.json`，并包含以下内容：

   ```json
   {
     "root": "docs/.vitepress/dist"
   }
   ```

### Edgio

参考 [Creating and Deploying a VitePress App To Edgio](https://docs.edg.io/guides/vitepress)。