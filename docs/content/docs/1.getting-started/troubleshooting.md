---
title: 故障排除
description: pnpm 配置、依赖安装、样式定制等常见问题的解决方案
---

## pnpm 和 .npmrc 配置问题

### shamefully-hoist 已移除

从 v1.10.0 版本开始，项目已移除 `.npmrc` 中的 `shamefully-hoist=true` 配置。

**原因**：`shamefully-hoist` 会将所有依赖提升到 `node_modules` 根目录，破坏了 pnpm 的严格依赖隔离机制。这可能导致：
- 意外访问未声明的依赖
- 依赖版本冲突
- 构建不稳定

**迁移指南**：
1. 删除项目中的 `.npmrc` 文件（如果存在）
2. 运行 `pnpm install` 重新安装依赖
3. 如遇到依赖找不到的错误，将缺失的包添加到 `package.json` 的 `dependencies` 中

::warning{to="https://pnpm.io/zh/npmrc#shamefully-hoist"}
参考 pnpm 官方文档了解更多关于 `shamefully-hoist` 的信息
::

### Tailwind CSS 作为 Peer Dependency

Tailwind CSS 已从直接依赖改为 `peerDependencies`。这意味着：

**主题使用者需要手动安装**：
```bash
pnpm add -D tailwindcss
```

## 样式定制问题

### 自定义 CSS 配置

~~从 v1.10.0 开始，`app/assets/css/main.css` 不再是必需的~~。如果你需要自定义样式：

**方法 1：使用 @nuxt/ui 的样式系统**

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

**方法 2：创建自定义 CSS 文件**

在 `app/assets/css/main.css` 中添加全局样式，并在 `nuxt.config.ts` 中引入：
```typescript [nuxt.config.ts]
export default defineNuxtConfig({
  css: ['~/assets/css/main.css']
})
```

## 依赖安装问题

### Peer Dependencies 警告

安装时可能会看到以下警告：

```text
WARN  Issues with peer dependencies found
├─┬ @movk/nuxt-docs
│ └── ✕ missing peer tailwindcss@4.x
```

**解决方法**：
```bash
pnpm add -D tailwindcss@^4.1.0
```

### 构建脚本审批

从 pnpm v10 开始，默认情况下不会运行依赖的 lifecycle scripts（如 `postinstall`）。本项目需要审批以下包含原生模块的依赖：

| 依赖包 | 用途 | 是否必需 |
|--------|------|----------|
| `better-sqlite3` | SQLite 数据库（用于 MCP 服务器） | 是 |
| `sharp` | 图片处理（用于 @nuxt/image） | 是 |

**方法 1：交互式审批（推荐）**

```bash
pnpm approve-builds
```

从列表中选择上述三个包进行审批。

**方法 2：配置文件方式**

在项目根目录的 `pnpm-workspace.yaml` 中添加：

```yaml [pnpm-workspace.yaml]
onlyBuiltDependencies:
  - better-sqlite3
  - sharp
```

或在 `package.json` 中：

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

::warning
**说明**：这些配置仅影响开发环境。发布的包不会传递此配置，消费者需要自行配置。
::

::warning{to="https://pnpm.io/zh/settings#onlybuiltdependencies"}
了解更多关于构建脚本审批的信息
::

## Nitro 预渲染问题

### unist-util-visit 包找不到

**错误信息**：

```text
Cannot find package 'unist-util-visit' imported from .../prerender/chunks/nitro/nitro.mjs
Did you mean to import "unist-util-visit/index.js"?
```

::warning
**原因**：

`@nuxt/content` 的 LLMs 集成在 Nitro 预渲染 `/llms-full.txt` 时，通过 `import("unist-util-visit")` 动态导入该包。pnpm 的严格依赖隔离使得 Nitro 输出目录（`docs/node_modules/.cache/`）无法解析到仅存在于 layer 依赖链中的包。
::

**解决方法**：

在消费方项目的 `package.json` 中显式声明缺失的运行时依赖：

```json [package.json]
{
  "dependencies": {
    "unist-util-visit": "^5.1.0",
    "@nuxtjs/mdc": "^0.20.1"
  }
}
```

或使用 `.npmrc` 将特定包提升到根目录：

```text [.npmrc]
public-hoist-pattern[]=unist-util-visit
public-hoist-pattern[]=@nuxtjs/mdc
```

添加后运行 `pnpm install` 使配置生效。

## Vercel 部署问题

### Node 版本支持

本项目同时支持 **Node.js 22 LTS** 和 **Node.js 24**。

| Node 版本 | 状态 | 支持 | 推荐 | 说明 |
|-----------|------|------|------|------|
| Node 22 | LTS | ✅ | ✅ | 长期支持版本，稳定可靠 |
| Node 24 | Current | ✅ | ⚡ | 最新版本，性能更优 |

### Output Directory 找不到

**错误信息**：

```text
Error: No Output Directory named "dist" found after the Build completed.
Configure the Output Directory in your Project Settings.
```

**解决方法**：

在 Vercel 项目设置中配置：

1. 进入 **Settings** → **General** → **Build & Development Settings**
2. 设置 **Output Directory**：

```text
.output/public
```

或在 `vercel.json` 中配置：

```json [vercel.json]
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".output/public"
}
```
