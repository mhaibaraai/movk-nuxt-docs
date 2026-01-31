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
| `@swc/core` | TypeScript/JavaScript 编译器 | 是 |
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
  - "@swc/core"
  - better-sqlite3
  - sharp
```

或在 `package.json` 中：

```json [package.json]
{
  "pnpm": {
    "onlyBuiltDependencies": [
      "@swc/core",
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

## Vercel 部署问题

### Node 版本推荐

在 Vercel 部署时，推荐使用 **Node.js 22 LTS**。

| Node 版本 | 状态 | 推荐使用 | 说明 |
|-----------|------|---------|------|
| Node 22 | LTS | ✅ 是 | 稳定，WASM 支持成熟 |
| Node 24 | Current | ❌ 否 | ESM WASM 提案未完全实现 |

**Node 24 可能出现的错误**：

```text
[vite:wasm-fallback] Could not load onig.wasm (imported by shiki):
"ESM integration proposal for Wasm" is not supported currently
```

**解决方法**：在 Vercel 项目设置中配置：

1. 进入 **Settings** → **General** → **Node.js Version**
2. 选择 **22.x**（而非 24.x）

### WASM 和 Shiki 配置

本项目使用 Shiki 进行语法高亮，需要 WASM 支持。相关配置已内置在 `layer/nuxt.config.ts` 中：

```typescript
// 已内置配置，无需手动添加
hooks: {
  'vite:extendConfig': async (config) => {
    // WASM 插件支持
    const [wasm, topLevelAwait] = await Promise.all([
      import('vite-plugin-wasm'),
      import('vite-plugin-top-level-await')
    ])
    config.plugins.push(wasm.default(), topLevelAwait.default())

    // 配置 WASM 运行时导入为外部依赖
    config.build.rollupOptions.external = [
      ...existing,
      'env',
      'wasi_snapshot_preview1'
    ]
  }
}
```

::warning
**注意**：`env` 和 `wasi_snapshot_preview1` 不是 npm 包，而是 WASM 运行时的导入声明。标记为 `external` 告诉 Rollup 不要尝试解析这些模块。
::

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
docs/.output/public
```

或在 `vercel.json` 中配置：

```json [vercel.json]
{
  "buildCommand": "pnpm build",
  "outputDirectory": "docs/.output/public"
}
```
