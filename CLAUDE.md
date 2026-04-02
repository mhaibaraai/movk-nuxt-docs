# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
# 安装依赖（安装后自动执行 nuxt prepare）
pnpm install

# 启动文档站开发服务器（http://localhost:3000）
pnpm dev

# 构建文档站
pnpm build

# Lint 检查
pnpm lint
pnpm lint:fix

# TypeScript 类型检查（仅针对 layer）
pnpm typecheck

# 预生成 Nuxt 类型（pnpm install 后自动执行，一般无需手动）
pnpm dev:prepare

# 发布 layer 到 npm（通过 release-it，前置运行 lint + typecheck）
pnpm release:layer

# 同时发布 layer 到 npm 并创建 GitHub Release
pnpm release

# 清理构建产物
pnpm clean
```

`pnpm dev` 实际运行的是 `nuxt dev docs --extends ../layer`，即以 `layer/` 为基础扩展运行 `docs/` 站点。

## 项目架构

这是一个 **pnpm monorepo**，包含三个核心部分：

```
movk-nuxt-docs/
├── layer/          # @movk/nuxt-docs npm 包（Nuxt Layer）
├── docs/           # 官方文档站点（使用 layer）
├── templates/      # 用户项目模板
│   ├── default/    # 完整文档站点模板
│   └── module/     # 模块文档站点模板（精简）
└── skills/         # AI Skill 定义（create-docs、review-docs）
```

### Layer 架构（`layer/`）

`layer/` 是核心 npm 包 `@movk/nuxt-docs`，主要目录：

- **`nuxt.config.ts`** - Layer 核心配置，注册所有 Nuxt 模块（@nuxt/ui、@nuxt/content、nuxt-component-meta、nuxt-llms 等）
- **`nuxt.schema.ts`** - 用 `@nuxt/content/preview` 的 `field`/`group` API 定义所有 `appConfig` 字段的类型和默认值，包括 `theme`、`header`、`footer`、`toc`、`github`、`aiChat` 等配置组
- **`content.config.ts`** - 定义 Nuxt Content 集合（`docs`、`releases`、`landing`），会检测 `content/docs/` 目录是否存在来动态决定内容路径前缀
- **`app/app.config.ts`** - 所有 appConfig 字段的默认值
- **`app/components/`** - 共享 UI 组件（DocsAsideLeftBody、DocsAsideLeftTop、PageHeaderLinks 等）
- **`app/composables/`** - 共享 Composable（useCategory、useHeader、useNavigation、useTheme、fetchComponentMeta、fetchComponentExample）
- **`modules/`** - 自定义 Nuxt 模块（ai-chat、component-example、css、md-rewrite、module、routing、skills）

Layer 的 peer dependencies：`nuxt 4.x`、`tailwindcss 4.x`、`better-sqlite3 12.x`（必需）；`mermaid 11.x`、`dompurify 3.x`（可选，启用 Mermaid 图表时需要）。

### AI Chat 模块（`layer/modules/ai-chat/`）

AI 聊天功能通过自定义 Nuxt 模块实现：

- **服务端 API**：`runtime/server/api/ai-chat.ts` - 使用 Vercel AI SDK 的 `streamText`，通过 MCP 客户端连接文档 MCP Server 获取工具，再路由到 AI Gateway 调用 LLM
- **组件**：`AiChatPanel.vue` 使用 `@ai-sdk/vue` 的 `Chat` 类管理对话状态，支持流式输出和推理内容展示
- **模型路由**：通过 `@ai-sdk/gateway` 统一调用，支持 Anthropic、OpenAI、Google、DeepSeek 等多家模型
- **环境变量**：需要 `AI_GATEWAY_API_KEY` 才能启用 AI Chat 功能；`layer/nuxt.config.ts` 中通过该变量判断是否预打包 AI 依赖

### 内容结构（`docs/content/`）

文档站使用 Nuxt Content + MDC 语法。内容文件存放在 `content/docs/`，支持：

- Front-Matter 定义 `title`、`description`、`navigation`、`links`、`category` 等元数据
- MDC 组件语法（`::ComponentName` 块语法或行内 `:component-name{prop="value"}`）
- 文件名数字前缀（如 `1.index.md`）控制排序，不影响路由

### 配置方式

使用此 Layer 的项目通过两处配置自定义行为：

1. **`nuxt.config.ts`** - Nuxt 模块级配置（如 `aiChat.model`、`movkNuxtDocs.mermaid`、`mcp` 等字段）
2. **`app.config.ts`** - 运行时 UI 配置（如 `header.title`、`footer.credits`、`github.owner` 等），可被终端用户覆盖

`nuxt.schema.ts` 是两者的权威来源，定义了所有可配置字段的类型和默认值。

## 技能文件（`skills/`）

`skills/create-docs/` 和 `skills/review-docs/` 包含 AI 编写和审查文档的规范，分别包含 `references/` 子目录存放 MDC 组件模板、配置参考和写作规范。编写或审查文档时应先加载对应技能。

## 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `NUXT_GITHUB_TOKEN` | 是（生产） | 获取 GitHub Releases、提交历史等数据 |
| `AI_GATEWAY_API_KEY` | 否 | 启用 AI Chat 功能；缺失时所有 AiChat 组件降级为禁用态，AI 相关依赖不会被打包 |

## CI/CD

- **ci.yml**：push main / PR 时运行 `pnpm lint` + `pnpm typecheck`
- **deploy.yml**：push main 时 Docker 多阶段构建 → GHCR 镜像（node:24-alpine，PORT=3000）
- **发布**：`pnpm release` 通过 release-it 运行 lint + typecheck 前置检查，发布 npm 包 + GitHub Release

## 注意事项

- **内容路径自动检测**：`content.config.ts` 检测 `content/docs/` 是否存在来决定路由前缀（存在 → `/docs`，不存在 → `/`）
- **AI Chat 条件编译**：无 `AI_GATEWAY_API_KEY` 时，AI 相关依赖不会被打包，AiChat 组件全部指向禁用版本
- **Mermaid 可选依赖**：需要 Mermaid 图表时须手动安装 `mermaid` + `dompurify`
- **md-rewrite 模块**：仅在 Vercel 部署预设下激活，添加 Markdown 原文路由
- **无测试套件**：项目当前不包含单元、集成或 E2E 测试
