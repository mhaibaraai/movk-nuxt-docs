# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# 安装依赖
pnpm install

# 启动开发服务器（docs 站点，使用 layer）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 准备 Nuxt（生成类型等）
pnpm dev:prepare

# Lint
pnpm lint
pnpm lint:fix

# TypeScript 类型检查（仅 layer）
pnpm typecheck

# 发布 layer 到 npm
pnpm release:layer
```

## Architecture Overview

### Monorepo 结构

```
movk-nuxt-docs/
├── layer/          # @movk/nuxt-docs 包 —— 核心 Nuxt layer
├── docs/           # 官方文档站点（extends layer）
├── templates/      # 用户脚手架模板
│   ├── default/    # 完整文档站点模板
│   └── module/     # 精简模块文档模板
└── skills/         # AI 助手技能文件
```

开发时 `pnpm dev` 运行的是 `docs/` 站点，通过 `--extends ../layer` 直接引用本地 `layer/` 而非 npm 包。

### Layer 内部结构

```
layer/
├── nuxt.config.ts          # Layer 配置（所有模块在此注册）
├── nuxt.schema.ts          # appConfig 类型定义和 Nuxt Studio 字段配置
├── content.config.ts       # Nuxt Content 集合定义（docs、releases、landing）
├── app/
│   ├── app.config.ts       # 默认 appConfig 值
│   ├── components/
│   │   ├── content/        # MDC 可用的内容组件（ComponentExample、CommitChangelog 等）
│   │   ├── header/         # Header 相关组件
│   │   ├── footer/         # Footer 相关组件
│   │   └── theme-picker/   # 主题选择器组件
│   ├── composables/        # 共享 composables（useNavigation、useTheme 等）
│   ├── layouts/            # default.vue 和 docs.vue 布局
│   └── pages/docs/         # docs 路由（[...slug].vue）
├── modules/                # 内置 Nuxt 模块（直接在 nuxt.config.ts 中加载）
│   ├── ai-chat/            # AI 聊天助手模块（configKey: 'aiChat'）
│   ├── component-example/  # 组件示例模块
│   ├── config/             # 配置相关模块
│   ├── css/                # CSS 处理模块
│   ├── md-rewrite/         # Markdown 重写模块
│   ├── mermaid/            # Mermaid 图表模块（可选，默认关闭）
│   └── routing/            # 路由模块
└── server/
    ├── api/
    │   ├── component-example.get.ts
    │   └── github/         # GitHub API 接口（commits、last-commit、releases）
    └── mcp/
        ├── resources/      # MCP 资源（documentation-pages、examples）
        └── tools/          # MCP 工具（get-page、get-example、list-* 等）
```

### 关键设计

**Layer 作为 npm 包**：`layer/` 被发布为 `@movk/nuxt-docs`，消费者在 `nuxt.config.ts` 中通过 `extends: ['@movk/nuxt-docs']` 引用。`peerDependencies` 中 `mermaid` 和 `dompurify` 为可选依赖。

**appConfig 配置体系**：所有用户可配置项通过 `nuxt.schema.ts` 定义，分为 `theme`、`header`、`footer`、`toc`、`github`、`aiChat`、`seo`、`vercelAnalytics` 等组。

**AI 聊天模块**：`modules/ai-chat/` 注册后暴露 `aiChat` configKey，通过 `@ai-sdk/gateway` 连接 AI Gateway，支持多模型切换。环境变量需要 `AI_GATEWAY_API_KEY` 。

**MCP Server**：通过 `@nuxtjs/mcp-toolkit` 集成，Resources 和 Tools 定义在 `server/mcp/` 下，向 AI 工具提供结构化文档访问。

**组件文档自动化**：`nuxt-component-meta` 自动提取 Vue 组件 Props/Slots/Emits，通过 `ComponentProps`、`ComponentSlots`、`ComponentEmits` 等 MDC 组件在文档中展示。

**内容集合**：`content.config.ts` 动态检测用户项目是否有 `content/docs/` 文件夹和 `content/index.md` 来决定路由前缀，支持带 `docs/` 子目录和不带的两种结构。

### 技术栈

- Nuxt 4 + TypeScript
- Nuxt UI（UI 组件库）+ Tailwind CSS 4
- Nuxt Content（基于文件的 CMS，SQLite 存储）
- Vercel AI SDK（`ai`、`@ai-sdk/gateway`、`@ai-sdk/vue`）
- `@nuxtjs/mcp-toolkit`（MCP Server）
- `nuxt-component-meta`（组件元数据提取）
- `nuxt-llms`（生成 `llms.txt`）
- VueUse、motion-v、shiki-stream
