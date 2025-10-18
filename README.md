[![Movk Nuxt Docs](https://docs.mhaibaraai.cn/__og-image__/static/og.png)](https://docs.mhaibaraai.cn/)

> 一款由 Nuxt UI 和 Nuxt Content 强力驱动的优雅文档主题

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

使用此主题可以快速构建美观、专业的文档网站，内置内容管理、SEO、暗黑模式、全文搜索等功能。

- 📖 [在线文档](https://docs.mhaibaraai.cn/)

## ✨ 特性

此主题集成了一系列旨在优化文档管理体验的强大功能：

- ⚡ **基于 Nuxt 4** - 充分利用最新的 Nuxt 框架，实现卓越性能
- 🎨 **采用 Nuxt UI** - 集成全面的 UI 组件库，开箱即用
- 📝 **MDC 语法增强** - 支持 Markdown 与 Vue 组件的无缝集成，实现动态内容
- 🧩 **组件文档自动生成** - 自动生成 Props、Slots、Emits 文档及交互式示例
- 📚 **智能侧边栏导航** - 根据内容结构自动生成导航
- 🔍 **全文搜索** - 内置强大的全文搜索功能
- 🌙 **暗黑模式** - 支持亮色/暗色主题切换
- 📱 **响应式设计** - 移动优先的响应式布局
- 🚀 **SEO 优化** - 内置 SEO 优化功能
- 🎯 **TypeScript 支持** - 完整的 TypeScript 类型支持
- 🤖 **AI 助手优化** - 为 LLM 优化，提供更好的 AI 辅助文档体验

## 🚀 快速开始

### 使用模板创建项目

```bash
# 使用此模板创建新项目
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/template my-docs

# 进入项目目录
cd my-docs

# 启动开发服务器
pnpm dev
```

### 作为 Layer 使用

在现有 Nuxt 项目中使用 Movk Nuxt Docs 作为 layer：

```bash
# 安装依赖
pnpm add @movk/nuxt-docs better-sqlite3
```

在 `nuxt.config.ts` 中配置：

```ts
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  
  llms: {
    domain: 'https://docs.mhaibaraai.cn',
    title: 'Movk Nuxt Docs',
    description: '一款优雅的 Nuxt 文档主题'
  }
})
```

## 📁 项目结构

### 完整项目结构

使用模板创建的项目结构：

```bash
my-docs/
├── content/             # Markdown 内容
│   ├── index.md         # 首页
│   └── docs/            # 文档页面
├── public/              # 静态资源
├── nuxt.config.ts       # Nuxt 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 依赖与脚本
```

### Monorepo 结构

本项目采用 monorepo 结构：

- `/docs` - 官方文档站点
- `/layer` - Movk Nuxt Docs 主题 layer（`@movk/nuxt-docs`）
- `/template` - 项目模板
- `/scripts` - 构建脚本

## 📝 内容编写

### 基础 Markdown

```md
---
title: 页面标题
description: 页面描述
---

# 标题

这是一段普通的文本内容。

## 二级标题

- 列表项 1
- 列表项 2
```

### MDC 语法

```md
::card
---
title: 卡片标题
icon: i-lucide-rocket
---
卡片内容
::
```

了解更多关于 MDC 语法，请查看 [Nuxt Content 文档](https://content.nuxt.com/docs/files/markdown#mdc-syntax)。

## 🛠️ 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/mhaibaraai/movk-nuxt-docs.git

# 进入项目目录
cd movk-nuxt-docs

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
# 构建应用
pnpm build

# 本地预览生产构建
pnpm preview
```

### 发布

```bash
# 发布 layer 到 npm
pnpm release:layer

# 发布完整项目
pnpm release
```

## ⚡ 技术栈

本项目基于以下优秀的开源项目构建：

- [Nuxt 4](https://nuxt.com/) - Web 框架
- [Nuxt Content](https://content.nuxt.com/) - 基于文件的 CMS
- [Nuxt UI](https://ui.nuxt.com/) - UI 组件库
- [Nuxt Image](https://image.nuxt.com/) - 图片优化
- [Tailwind CSS 4](https://tailwindcss.com/) - CSS 框架
- [Nuxt SEO](https://nuxtseo.com/) - SEO 优化
- [Nuxt LLMs](https://github.com/nuxt/llms) - AI 助手优化

## 📖 文档

访问 [Movk Nuxt Docs 文档](https://docs.mhaibaraai.cn/) 了解详细的使用指南和 API 文档。

## 🙏 致谢

本项目基于以下优秀项目构建或受其启发：

- [Docus](https://docus.dev/) - 由 Nuxt Content 团队开发的文档主题
- [Nuxt UI Docs Template](https://docs-template.nuxt.dev/) - Nuxt UI 官方文档模板

## 📄 许可证

[MIT](./LICENSE) License © 2024-PRESENT [YiXuan](https://github.com/mhaibaraai)


<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@movk/nuxt-docs/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@movk/nuxt-docs
[npm-downloads-src]: https://img.shields.io/npm/dm/@movk/nuxt-docs.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@movk/nuxt-docs
[license-src]: https://img.shields.io/badge/License-MIT-blue.svg
[license-href]: https://npmjs.com/package/@movk/nuxt-docs
[nuxt-src]: https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=fff
[nuxt-href]: https://nuxt.com
