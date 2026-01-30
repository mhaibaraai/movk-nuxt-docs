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

如果在使用 `pnpm` 时遇到构建或开发错误，特别是与 `better-sqlite3` 依赖相关的问题，可能需要审批某些包的构建脚本。

运行以下命令审批构建脚本：

```bash
pnpm approve-builds
```

出现提示时，从列表中选择 `better-sqlite3` 和 `sharp` 进行审批。

::warning{to="https://pnpm.io/zh/settings#onlybuiltdependencies"}
了解更多关于构建脚本审批的信息
::
