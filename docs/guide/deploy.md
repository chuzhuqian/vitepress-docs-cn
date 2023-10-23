---
outline: deep
---

# VitePress站点部署

以下指南基于这些共同的假设：

- VitePress站点位于项目的`docs`目录内。
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

默认情况下，我们假设站点将部署在域的根路径(`/`)下。如果你的站点将部署在一个子路径下，`https://mywebsite.com/blog/`，你需要在VitePress配置中将[`base`](../reference/site-config#base)选项设为`'/blog/'`。

**Example:** 如果你想使用Github (or GitLab)页面，并且部署在`user.github.io/repo/`，将`base`设置为`/repo/`.

## HTTP Cache Headers111

If you have control over the HTTP headers on your production server, you can configure `cache-control` headers to achieve better performance on repeated visits.

The production build uses hashed file names for static assets (JavaScript, CSS and other imported assets not in `public`). If you inspect the production preview using your browser devtools' network tab, you will see files like `app.4f283b18.js`.

This `4f283b18` hash is generated from the content of this file. The same hashed URL is guaranteed to serve the same file content - if the contents change, the URLs change too. This means you can safely use the strongest cache headers for these files. All such files will be placed under `assets/` in the output directory, so you can configure the following header for them:

```
Cache-Control: max-age=31536000,immutable
```

::: details Example Netlify `_headers` file

```
/assets/*
  cache-control: max-age=31536000
  cache-control: immutable
```

Note: the `_headers` file should be placed in the [public directory](./asset-handling#the-public-directory) - in our case, `docs/public/_headers` - so that it is copied verbatim to the output directory.

[Netlify custom headers documentation](https://docs.netlify.com/routing/headers/)

:::

::: details Example Vercel config in `vercel.json`

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

Note: the `vercel.json` file should be placed at the root of your **repository**.

[Vercel documentation on headers config](https://vercel.com/docs/concepts/projects/project-configuration#headers)

:::

## Platform Guides

### Netlify / Vercel / Cloudflare Pages / AWS Amplify / Render

Set up a new project and change these settings using your dashboard:

- **Build Command:** `npm run docs:build`
- **Output Directory:** `docs/.vitepress/dist`
- **Node Version:** `18` (or above)

::: warning
Don't enable options like _Auto Minify_ for HTML code. It will remove comments from output which have meaning to Vue. You may see hydration mismatch errors if they get removed.
:::

### GitHub Pages

1. Create a file named `deploy.yml` inside `.github/workflows` directory of your project with some content like this:

   ```yaml
   # Sample workflow for building and deploying a VitePress site to GitHub Pages
   #
   name: Deploy VitePress site to Pages

   on:
     # Runs on pushes targeting the `main` branch. Change this to `master` if you're
     # using the `master` branch as the default branch.
     push:
       branches: [main]

     # Allows you to run this workflow manually from the Actions tab
     workflow_dispatch:

   # Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   # Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
   # However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
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
   Make sure the `base` option in your VitePress is properly configured. See [Setting a Public Base Path](#setting-a-public-base-path) for more details.
   :::

2. In your repository's settings under "Pages" menu item, select "GitHub Actions" in "Build and deployment > Source".

3. Push your changes to the `main` branch and wait for the GitHub Actions workflow to complete. You should see your site deployed to `https://<username>.github.io/[repository]/` or `https://<custom-domain>/` depending on your settings. Your site will automatically be deployed on every push to the `main` branch.

### GitLab Pages

1. Set `outDir` in VitePress config to `../public`. Configure `base` option to `'/<repository>/'` if you want to deploy to `https://<username>.gitlab.io/<repository>/`.

2. Create a file named `.gitlab-ci.yml` in the root of your project with the content below. This will build and deploy your site whenever you make changes to your content:

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

### Azure Static Web Apps

1. Follow the [official documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/build-configuration).

2. Set these values in your configuration file (and remove the ones you don't require, like `api_location`):

   - **`app_location`**: `/`
   - **`output_location`**: `docs/.vitepress/dist`
   - **`app_build_command`**: `npm run docs:build`

### Firebase

1. Create `firebase.json` and `.firebaserc` at the root of your project:

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

2. After running `npm run docs:build`, run this command to deploy:

   ```sh
   firebase deploy
   ```

### Surge

1. After running `npm run docs:build`, run this command to deploy:

   ```sh
   npx surge docs/.vitepress/dist
   ```

### Heroku

1. Follow documentation and guide given in [`heroku-buildpack-static`](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-static).

2. Create a file called `static.json` in the root of your project with the below content:

   ```json
   {
     "root": "docs/.vitepress/dist"
   }
   ```

### Edgio

Refer [Creating and Deploying a VitePress App To Edgio](https://docs.edg.io/guides/vitepress).