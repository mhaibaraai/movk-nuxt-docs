---
title: 故障排除
description: pnpm 配置、依赖安装、样式定制、Vercel 部署等常见问题的解决方案
---

## pnpm 和 .npmrc 配置问题

### shamefully-hoist 已移除

从 v1.10.0 版本开始，项目已移除 `.npmrc` 中的 `shamefully-hoist=true` 配置。

::caution
`shamefully-hoist` 会将所有依赖提升到 `node_modules` 根目录，破坏 pnpm 的严格依赖隔离机制，可能导致意外访问未声明的依赖、版本冲突和构建不稳定。
::

::steps{level="4"}

#### 删除 `.npmrc`

删除项目中的 `.npmrc` 文件（如果存在）。

#### 重新安装依赖

```bash
pnpm install
```

#### 补齐缺失的依赖

如遇到依赖找不到的错误，将缺失的包添加到 `package.json` 的 `dependencies` 中。

::

::warning{to="https://pnpm.io/zh/npmrc#shamefully-hoist"}
参考 pnpm 官方文档了解更多关于 `shamefully-hoist` 的信息
::

### Tailwind CSS 作为 Peer Dependency

Tailwind CSS 已从直接依赖改为 `peerDependencies`，主题使用者需要手动安装：

```bash
pnpm add -D tailwindcss
```

## 样式定制问题

### 自定义 CSS 配置

~~从 v1.10.0 开始，`app/assets/css/main.css` 不再是必需的~~。如果你需要自定义样式：

::tabs
  :::tabs-item{icon="i-lucide-palette" label="Nuxt UI 样式系统"}
  需要先安装 `@nuxt/ui`：

  ```bash
  pnpm add @nuxt/ui
  ```

  然后在 `nuxt.config.ts` 中配置：

  ```typescript [nuxt.config.ts]
  export default defineNuxtConfig({
    modules: ['@nuxt/ui'],
    ui: {
      // 自定义主题配置
    }
  })
  ```
  :::

  :::tabs-item{icon="i-lucide-file-code" label="自定义 CSS 文件"}
  在 `app/assets/css/main.css` 中添加全局样式，并在 `nuxt.config.ts` 中引入：

  ```typescript [nuxt.config.ts]
  export default defineNuxtConfig({
    css: ['~/assets/css/main.css']
  })
  ```
  :::
::

## 依赖安装问题

### Peer Dependencies 警告

::collapsible{name="错误信息"}
```text
WARN  Issues with peer dependencies found
├─┬ @movk/nuxt-docs
│ └── ✕ missing peer tailwindcss@4.x
```
::

::tip
安装缺失的 peer dependency 即可解决：

```bash
pnpm add -D tailwindcss@^4.1.0
```
::

### 构建脚本审批

从 pnpm v10 开始，默认情况下不会运行依赖的 lifecycle scripts（如 `postinstall`）。本项目需要审批以下包含原生模块的依赖：

| 依赖包 | 用途 | 是否必需 |
|--------|------|----------|
| `better-sqlite3` | SQLite 数据库（用于 MCP 服务器） | 是 |
| `sharp` | 图片处理（用于 @nuxt/image） | 是 |

::tabs
  :::tabs-item{icon="i-lucide-terminal" label="交互式审批（推荐）"}
  ```bash
  pnpm approve-builds
  ```

  从列表中选择上述包进行审批。
  :::

  :::tabs-item{icon="i-lucide-file-cog" label="pnpm-workspace.yaml"}
  在项目根目录的 `pnpm-workspace.yaml` 中添加：

  ```yaml [pnpm-workspace.yaml]
  onlyBuiltDependencies:
    - better-sqlite3
    - sharp
  ```
  :::

  :::tabs-item{icon="i-lucide-braces" label="package.json"}
  在 `package.json` 中添加：

  ```json [package.json]
  {
    "pnpm": {
      "onlyBuiltDependencies": [
        "better-sqlite3",
        "sharp"
      ]
    }
  }
  ```
  :::
::

::note
这些配置仅影响开发环境。发布的包不会传递此配置，消费者需要自行配置。
::

::warning{to="https://pnpm.io/zh/settings#onlybuiltdependencies"}
了解更多关于构建脚本审批的信息
::

## Nitro 预渲染问题

### unist-util-visit 包找不到

::collapsible{name="错误信息"}
```text
Cannot find package 'unist-util-visit' imported from .../prerender/chunks/nitro/nitro.mjs
Did you mean to import "unist-util-visit/index.js"?
```
::

::warning
`@nuxt/content` 的 LLMs 集成在 Nitro 预渲染 `/llms-full.txt` 时，通过 `import("unist-util-visit")` 动态导入该包。pnpm 的严格依赖隔离使得 Nitro 输出目录（`docs/node_modules/.cache/`）无法解析到仅存在于 layer 依赖链中的包。
::

::tabs
  :::tabs-item{icon="i-lucide-package" label="显式声明依赖（推荐）"}
  在消费方项目的 `package.json` 中显式声明缺失的运行时依赖：

  ```json [package.json]
  {
    "dependencies": {
      "unist-util-visit": "^5.1.0",
      "@nuxtjs/mdc": "^0.20.1"
    }
  }
  ```
  :::

  :::tabs-item{icon="i-lucide-arrow-up-to-line" label=".npmrc 提升"}
  使用 `.npmrc` 将特定包提升到根目录：

  ```text [.npmrc]
  public-hoist-pattern[]=unist-util-visit
  public-hoist-pattern[]=@nuxtjs/mdc
  ```

  添加后运行 `pnpm install` 使配置生效。
  :::
::

## Vercel 部署问题

### Node 版本支持

本项目同时支持 **Node.js 22 LTS** 和 **Node.js 24**。

| Node 版本 | 状态 | 支持 | 推荐 | 说明 |
|-----------|------|------|------|------|
| Node 22 | LTS | ✅ | ✅ | 长期支持版本，稳定可靠 |
| Node 24 | Current | ✅ | ⚡ | 最新版本，性能更优 |

### Output Directory 找不到

::collapsible{name="错误信息"}
```text
Error: No Output Directory named "dist" found after the Build completed.
```
::

此错误通常**不是**输出目录配置问题。Nuxt 使用 `vercel` preset 构建时，Nitro 会自动生成 `.vercel/output/` 目录（Vercel Build Output API 格式），Vercel 能自动识别该目录，无需手动配置 `outputDirectory`。

::caution
出现此错误的最常见原因是**构建过程中内存不足（OOM）**，导致 `.vercel/output/` 未完整生成，Vercel 回退查找默认的 `dist` 目录。
::

可以在 Vercel 构建日志末尾确认是否为 OOM：

```text
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

或：

```text
At least one "Out of Memory" ("OOM") event was detected during the build.
```

::tip
在 `vercel.json` 中通过 `buildCommand` 增大 Node.js 堆内存限制：

```json [vercel.json]
{
  "buildCommand": "NODE_OPTIONS='--max-old-space-size=7168' pnpm run build",
  "framework": null,
  "installCommand": "pnpm install --frozen-lockfile"
}
```
::

::note
Vercel Hobby 计划的构建容器为 8 GB 内存，Node.js 默认堆限制约 4 GB。设置 `--max-old-space-size=7168`（7 GB）可为 Nitro 构建和预渲染提供充足的内存空间。
::

如果增大内存后仍然 OOM，可以考虑：
- 升级到 Vercel Pro 计划以获得更大的构建容器
- 减少预渲染路由数量
