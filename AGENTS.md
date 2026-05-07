# AGENTS.md

This file provides guidance for AI coding agents working on this repository.

## 常用命令

```bash
# 安装依赖（postinstall 自动运行 nuxt prepare）
pnpm install

# 启动文档站开发服务器（http://localhost:3000）
pnpm dev

# 构建文档站
pnpm build

# Lint 检查
pnpm lint
pnpm lint:fix

# TypeScript 类型检查（仅针对 layer，避免重复检查消费方）
pnpm typecheck

# 重新生成 Nuxt 类型（pnpm install 后自动执行）
pnpm dev:prepare

# 仅发布 layer 到 npm（前置 lint + typecheck）
pnpm release:layer

# 同时发布 layer 到 npm 并创建 GitHub Release
pnpm release

# 清理构建产物
pnpm clean
```

`pnpm dev` 实际运行的是 `nuxt dev docs --extends ../layer`，即以 `layer/` 为基础层扩展运行 `docs/` 站点。这意味着改动 `layer/` 后通常无需重启即可热更新；但新增模块或修改 `nuxt.config.ts` / `nuxt.schema.ts` 时需重新执行 `pnpm dev:prepare`。

## 项目架构

这是一个 **pnpm monorepo**（`pnpm-workspace.yaml` 中只声明 `layer` 和 `docs`，`templates/*` 不在 workspace 内，避免被一起 install）。

```
movk-nuxt-docs/
├── layer/          # @movk/nuxt-docs npm 包（Nuxt Layer，发布到 npm）
├── docs/           # 官方文档站点（消费 layer，部署到 docs.mhaibaraai.cn）
└── templates/      # 用户项目模板（不在 workspace）
    ├── default/    # 完整文档站点模板
    └── module/     # 模块文档站点模板（精简版）
```

### Layer 架构（`layer/`）

Layer 即 npm 包 `@movk/nuxt-docs`，是仓库的核心。关键入口：

- **`nuxt.config.ts`** — Layer 主配置，注册 `@nuxt/ui`、`@nuxt/content`、`@nuxt/image`、`@nuxtjs/robots`、`@nuxtjs/mcp-toolkit`、`nuxt-component-meta`、`nuxt-llms`、`nuxt-og-image`、`nuxt-schema-org`、`motion-v/nuxt`。也通过 `vite:extendConfig` 钩子实现 AI 依赖的条件预打包（见下文）。
- **`nuxt.schema.ts`** — 用 `@nuxt/content/preview` 的 `field`/`group` API 定义所有 `appConfig` 字段（`theme`、`header`、`footer`、`toc`、`github`、`aiChat` 等）的类型与默认值。这是配置的**权威来源**：修改这里会同时影响类型推断、Studio 编辑界面 schema、appConfig 默认值。改 schema 时务必同步 `app/app.config.ts` 的默认值。
- **`content.config.ts`** — 定义 `docs`、`releases`、`landing` 三个 Nuxt Content 集合。会在构建期检测消费方 `content/docs/` 是否存在来动态决定路由前缀（存在 → `/docs`，不存在 → `/`）；`landing` 集合仅当 `content/index.md` 缺失时注册。
- **`app/app.config.ts`** — 所有 appConfig 默认值。
- **`app/components/`、`app/composables/`** — 共享 UI 与 Composable（`useCategory`、`useHeader`、`useNavigation`、`useTheme`、`fetchComponentMeta`、`fetchComponentExample` 等）。
- **`server/`**（顶层，与 modules 内的 `runtime/server/` 互补）— Layer 直接提供的 Nitro `api/`、`mcp/`、`plugins/`、`routes/`、`utils/`。
- **`modules/`** — 自定义 Nuxt 模块：`ai-chat/`、`component-example.ts`、`components/`、`css.ts`、`md-rewrite.ts`、`module.ts`、`routing.ts`、`skills/`。

#### Layer 的 peer dependencies

- 必需：`nuxt 4.x`、`tailwindcss 4.x`、`better-sqlite3 12.x`
- 可选（按需启用 Mermaid）：`mermaid 11.x`、`dompurify 3.x`

### AI Chat 模块（`layer/modules/ai-chat/`）

AI 聊天通过自定义 Nuxt 模块实现：

- **服务端 API** — `runtime/server/api/ai-chat.ts` 使用 Vercel AI SDK 的 `streamText`，通过 MCP 客户端连接文档 MCP Server 获取工具，再路由到 AI Gateway 调用 LLM。
- **组件** — `AiChatPanel.vue` 使用 `@ai-sdk/vue` 的 `Chat` 类管理对话状态，支持流式输出与推理内容展示。
- **模型路由** — `@ai-sdk/gateway` 统一调用，可切换 Anthropic / OpenAI / Google / DeepSeek / GLM 等。
- **条件编译** — `layer/nuxt.config.ts` 的 `vite:extendConfig` 钩子读取 `process.env.AI_GATEWAY_API_KEY`：缺失时 `@ai-sdk/vue`、`ai`、`shiki-stream/vue`、`@shikijs/core` 等不会被预打包，AiChat 组件全部降级为禁用版本。

### Skills 模块（`layer/modules/skills/`）

构建时扫描消费项目根目录的 `skills/` 文件夹，将每个合规 Skill 自动暴露为两个端点（同时预渲染为静态文件）：

| 端点 | 说明 |
|------|------|
| `GET /.well-known/skills/index.json` | 所有 Skills 清单（`name`、`description`、`files`） |
| `GET /.well-known/skills/:name/:path` | 指定 Skill 的文件内容（SKILL.md、references/* 等） |

**新增 Skill 的目录结构（在 `docs/skills/` 下）：**

```
skills/
└── my-skill/             # 目录名须与 frontmatter.name 完全一致
    ├── SKILL.md          # 必需：frontmatter + 工作流说明
    └── references/       # 可选：详细参考文档
```

**`SKILL.md` 必需 frontmatter：**

```yaml
---
name: my-skill            # kebab-case，须与目录名一致，≤64 字符
description: |            # 功能描述 + 触发词列表
  描述此技能的用途。
  当被要求时使用：
  "触发词 1", "触发词 2"。
---
```

命名规则：仅小写字母、数字、连字符；不以连字符开头或结尾；不含连续连字符（`--`）。不符合规范的 Skill 在构建时会被跳过并输出警告（见 `layer/modules/skills/index.ts` 中的 `SKILL_NAME_REGEX`）。当前内置 `create-docs`、`review-docs` 两个 Skill。

### 内容结构（`docs/content/`）

文档使用 Nuxt Content + MDC 语法。支持：

- Front-Matter 定义 `title`、`description`、`navigation`、`links`、`category` 等元数据
- MDC 块 / 行内组件语法（`::ComponentName` 或 `:component-name{prop="value"}`）
- 文件名数字前缀（如 `1.index.md`）控制排序，不影响最终路由

### 配置层级

消费此 Layer 的项目通过两处自定义行为：

1. **`nuxt.config.ts`** — 模块级配置（`aiChat.model`、`movkNuxtDocs.mermaid`、`mcp`、`llms`、`componentMeta.include` 等）。可通过 `extends: ['@movk/nuxt-docs']` 一行继承全部默认。
2. **`app.config.ts`** — 运行时 UI 配置（`header.title`、`footer.credits`、`github.owner` 等），可被终端用户覆盖。

`nuxt.schema.ts` 是两者的权威类型来源。

## 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `NUXT_GITHUB_TOKEN` | 生产环境必需 | 获取 GitHub Releases、提交历史等数据 |
| `AI_GATEWAY_API_KEY` | 否 | 启用 AI Chat 功能。缺失时 AI 相关依赖不会被打包，所有 AiChat 组件降级为禁用态 |

## CI/CD

- **`.github/workflows/ci.yml`** — push main / PR 时运行 `pnpm lint` + `pnpm typecheck`
- **`.github/workflows/deploy.yml`** — push main 时 Docker 多阶段构建 → GHCR 镜像（`node:24-alpine`，`PORT=3000`）
- **发布** — `pnpm release` 通过 release-it 前置运行 lint + typecheck，发布 npm 包 + GitHub Release

## 注意事项

- **内容路径自动检测** — `content.config.ts` 通过 `docsFolderExists()` / `landingPageExists()`（在 `layer/utils/pages.ts`）决定路由前缀，新增模板时不要破坏这套约定。
- **AI Chat 条件编译** — 修改 `vite:extendConfig` 钩子时需注意：所有非 `@movk/nuxt-docs > ` 前缀的依赖会被自动加上前缀（兼容 `@nuxt/a11y > axe-core` 等嵌套依赖解析）。
- **Mermaid 可选依赖** — 启用图表时消费方需手动安装 `mermaid` + `dompurify`，layer 不会自动拉取。
- **md-rewrite 模块** — 仅在 Vercel 部署预设下激活，添加 Markdown 原文路由（`/raw/*.md`）。
- **Component Meta 排除清单** — `layer/nuxt.config.ts` 的 `componentMeta.exclude` 已排除 Nuxt 官方包，避免无关组件污染元数据。新增第三方 UI 库时按需追加。
- **无测试套件** — 项目当前不包含单元、集成或 E2E 测试；改动核心逻辑时优先靠 `pnpm typecheck` + `pnpm dev` 手测。
