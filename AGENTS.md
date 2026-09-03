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

# 仅 bump layer 版本号（前置 lint + typecheck，发包由 CI 完成）
pnpm release:layer

# 完整发布：bump 版本 + 生成 changelog + 打 tag 推送（tag 触发 CI 发包）+ 创建 GitHub Release
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

- **`nuxt.config.ts`** — Layer 主配置，注册 `@nuxt/ui`、`@nuxt/content`、`@nuxt/image`、`@nuxtjs/robots`、`@nuxtjs/sitemap`、`@nuxtjs/mcp-toolkit`、`nuxt-agent-discovery`、`nuxt-component-meta`、`nuxt-llms`、`nuxt-og-image`、`nuxt-schema-org`、`motion-v/nuxt`。也通过 `vite:extendConfig` 钩子实现 AI 依赖的条件预打包（见下文）。
- **`nuxt.schema.ts`** — 用 `@nuxt/content/preview` 的 `field`/`group` API 定义所有 `appConfig` 字段（`theme`、`header`、`footer`、`toc`、`github`、`aiChat` 等）的类型与默认值。这是配置的**权威来源**：修改这里会同时影响类型推断、Studio 编辑界面 schema、appConfig 默认值。改 schema 时务必同步 `app/app.config.ts` 的默认值。
- **`content.config.ts`** — 定义 `docs`、`releases`、`landing` 三个 Nuxt Content 集合。会在构建期检测消费方 `content/docs/` 是否存在来动态决定路由前缀（存在 → `/docs`，不存在 → `/`）；`landing` 集合仅当 `content/index.md` 缺失时注册。
- **`app/app.config.ts`** — 所有 appConfig 默认值。
- **`app/components/`、`app/composables/`** — 共享 UI 与 Composable（`useCategory`、`useHeader`、`useNavigation`、`useTheme`、`fetchComponentMeta`、`fetchComponentExample` 等）。
- **`server/`**（顶层，与 modules 内的 `runtime/server/` 互补）— Layer 直接提供的 Nitro `api/`、`mcp/`、`plugins/`、`routes/`、`utils/`。
- **`modules/`** — 自定义 Nuxt 模块：`ai-chat/`、`component-code.ts`、`component-example.ts`、`components/`、`css.ts`、`i18n.ts`、`module.ts`、`routing.ts`。

#### Layer 的 peer dependencies

- 必需：`nuxt 4.x`、`tailwindcss 4.x`、`better-sqlite3 12.x`
- 可选（按需启用 Mermaid）：`mermaid 11.x`、`dompurify 3.x`

### AI Chat 模块（`layer/modules/ai-chat/`）

AI 聊天通过自定义 Nuxt 模块实现：

- **服务端 API** — `runtime/server/api/ai-chat.ts` 使用 Vercel AI SDK 的 `streamText`，通过 MCP 客户端连接文档 MCP Server 获取工具，再路由到 AI Gateway 调用 LLM。
- **组件** — `AiChatPanel.vue` 使用 `@ai-sdk/vue` 的 `Chat` 类管理对话状态，支持流式输出与推理内容展示。
- **模型路由** — `runtime/server/utils/getModel.ts` 按「用户注册的 provider > `AI_BASE_URL` OpenAI 兼容直连 > AI Gateway 兜底」三级优先级解析模型 id。Layer 只内置 `@ai-sdk/openai` 一个提供商包，配了 `AI_BASE_URL` 就用 `createOpenAI().chat()` 直连该端点（第三方兼容端点只支持 chat completions，且 `provider/` 前缀会被剥掉，前缀仅用于前端图标）；未配置时用 `ai` re-export 的 `createGateway` 兜底，modelId 保持 `provider/model` 形式。`modelProviderRegistry`（`modelProviders.ts`）是消费方接入非兼容协议厂商的扩展/覆盖入口，对应 SDK 包由消费方自行安装。
- **条件编译** — `layer/nuxt.config.ts` 的 `vite:extendConfig` 钩子调用 `hasAnyAiKey()`（读取 `AI_API_KEY`）：缺失时 `@ai-sdk/vue`、`ai`、`shiki-stream/vue`、`@shikijs/core` 等不会被预打包，AiChat 组件全部降级为禁用版本。同一判定同时驱动模块启用、handler 注册与前端 `aiChat.enabled`。

### 代理发现层（`nuxt-agent-discovery`）

面向 AI 代理的 Markdown 内容协商与发现文档由 [`nuxt-agent-discovery`](https://github.com/benjamincanac/nuxt-agent-discovery) 提供，Layer 只做配置与站点特有的补全。模块负责：

| 端点 / 能力 | 说明 |
|------|------|
| `GET /raw/**.md` | 页面的 Markdown 表示，带 `Vary` 与 canonical/alternate `Link` 头 |
| `Accept` / User-Agent 协商 | RFC 9110 q-value 解析；Vercel 预设下在边缘重写，其余环境走 Nitro 中间件，dev 同样生效 |
| `GET /sitemap.md` | 全站 Markdown 索引，分节由 `agentDiscovery.sitemap.markdown` 的 `expand` / `labels` 控制 |
| `GET /.well-known/api-catalog` | RFC 9727 linkset |
| `GET /.well-known/mcp/server-card.json` | MCP 服务卡片，工具/资源/提示词清单从 `@nuxtjs/mcp-toolkit` 实时读取 |
| `GET /.well-known/skills/*` | Agent Skills 清单与文件（见下） |
| `robots.txt` 的 agent 分组 | 与协商共用同一份 user-agent 列表，经 `robots:config` 注入 `@nuxtjs/robots` |
| Markdown 错误响应体 | agent 请求 404 时返回带恢复链接的 Markdown |
| `listAgentPages` / `getAgentDocument` / `extractSections` | `#agent-discovery` 导出，MCP 文档工具据此实现 |

Layer 侧只保留模块无从得知的部分：

- **`layer/nuxt.config.ts`** — `agentDiscovery` 配置块。`siteUrl` / `siteName` 留空由消费方 `site.*` 解析；`routes` 保持默认 `['/', '/**']`（docs 前缀是运行期探测的，i18n 前缀一并覆盖）。`modules` 数组里有一个内联模块，在 `nuxt-agent-discovery` **之前**写入依赖 `rootDir` 的两项（`discovery.mcpServerCard`、`discovery.links`）——模块在自己的 `setup` 里就读走了选项，写晚了不生效。
- **`layer/server/plugins/agent-discovery.ts`** — `agent-discovery:document` 钩子调用 `transformMDC` 把 MDC 组件转成纯 Markdown；`agent-discovery:mcp-server-card` 钩子在请求期补全服务卡片的 `serverInfo`（站点名、版本、仓库来自消费方 appConfig / runtimeConfig）。
- **`layer/server/routes/raw/index.md.get.ts`** — 首页的 Markdown 表示。模块默认把 `/` 当普通文档直接输出 landing 页的 MDC 树，价值远低于一份导航性摘要，因此由站点自己接管（模块显式支持这一做法），发现清单仍由 `renderAgentResources()` 从同一份注册表渲染。

`sitemap.xml` 由 `@nuxtjs/sitemap` 生成（i18n 下为 `/sitemap_index.xml` + 每语言一份），模块负责把 `/raw/**` 排除在外。

### Agent Skills

`agentDiscovery.skills.dir` 指向消费项目根目录的 `skills/`，构建时扫描并生成 `/.well-known/skills/index.json`，各文件在 `/.well-known/skills/{skill-name}/{path}` 下提供。

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

命名规则：仅小写字母、数字、连字符；不以连字符开头或结尾；不含连续连字符（`--`）。不符合规范的 Skill 在构建时会被跳过并输出警告。当前内置 `create-docs`、`review-docs` 两个 Skill。

### 内容结构（`docs/content/`）

文档使用 Nuxt Content + MDC 语法。支持：

- Front-Matter 定义 `title`、`description`、`navigation`、`links`、`category` 等元数据
- MDC 块 / 行内组件语法（`::ComponentName` 或 `:component-name{prop="value"}`）
- 文件名数字前缀（如 `1.index.md`）控制排序，不影响最终路由

### 国际化（i18n）

i18n 基于 `@nuxtjs/i18n` v10，采用 **opt-in** 设计：layer 仅将其列为依赖，**消费方**在自己的 `nuxt.config.ts` 的 `modules` 中加入 `@nuxtjs/i18n` 并配置 `i18n.locales` 后才激活；未配置时一切按单语言现状运行，不影响现有模板与消费方。

激活后的关键约定：

- **条件激活模块** `layer/modules/i18n.ts` — 读取 `nuxt.options.i18n`，过滤掉缺少翻译文件或内容目录的 locale，强制 `strategy: 'prefix_except_default'`，通过 `i18n:registerModule` hook 注册内置翻译，并把有效 locale 暴露到 `runtimeConfig.public.movkDocs.filteredLocales`。
- **URL 策略** `prefix_except_default` — 默认语言保持无前缀（`/docs/*`），其余语言加前缀（`/en/docs/*`）。因此默认语言内容**原地不动**位于 `content/docs`，其他语言放在 `content/{locale}/docs`。
- **内容集合** `layer/content.config.ts` 按 locale 生成集合：默认语言为 `docs` / `landing` / `releases` / `templates`，其余为 `docs_{code}` / `landing_{code}` / `releases_{code}` / `templates_{code}`（code 的 `-` 替换为 `_`）。默认语言内容位于 `content/` 根（`content/releases.{md,yml}`、`content/templates.{md,yml}`），其他语言放 `content/{code}/releases.{md,yml}`、`content/{code}/templates.{md,yml}`；缺对应文件时该语言路由自然 404。
- **翻译文件** 内置于 `layer/i18n/locales/{zh-CN,en}.json`。新增语言＝补一个 `{code}.json` + 一个 `content/{code}/` 目录，并在消费方 `i18n.locales` 注册；二者缺一即被构建期过滤并告警。
- **UI 文案解析顺序** `appConfig 覆盖 ?? i18n 翻译`。`app.config.ts` 的文案字段默认留空，由 `useMovkI18n().t()` 提供当前语言文案；消费方仍可用 appConfig 覆盖单个词。未启用 i18n 时 `t()` 回退到 `appConfig.i18n.locale`（默认 `zh-CN`）的内置文案。
- **统一入口** `useMovkI18n()` 暴露 `isEnabled / locale / defaultLocale / locales / t / localePath / switchLocalePath / docsRoot / docsCollection / landingCollection`，在 i18n 开关两态下行为一致；页面/导航/搜索据此选择 locale 对应的集合与路径。
- **SEO** `useLocaleSeo()`（在 `app.vue` 全局调用）注入 hreflang alternates、x-default 与 `og:locale`；`<html lang/dir>` 与 `UApp :locale` 由 `@nuxt/ui/locale` 按当前 locale 驱动。
- **浏览器语言重定向** 由 `@nuxtjs/i18n` 默认的 `detectBrowserLanguage` 控制；如需固定首页语言可在消费方 `i18n` 配置中关闭。

### 配置层级

消费此 Layer 的项目通过两处自定义行为：

1. **`nuxt.config.ts`** — 模块级配置（`aiChat.model`、`movkNuxtDocs.mermaid`、`mcp`、`llms`、`componentMeta.include` 等）。可通过 `extends: ['@movk/nuxt-docs']` 一行继承全部默认。
2. **`app.config.ts`** — 运行时 UI 配置（`header.title`、`footer.credits`、`github.owner` 等），可被终端用户覆盖。

`nuxt.schema.ts` 是两者的权威类型来源。

## 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `NUXT_GITHUB_TOKEN` | 生产环境必需 | 获取 GitHub Releases、提交历史等数据 |
| `AI_API_KEY` | 否 | AI Chat 总开关，AI Gateway 与 OpenAI 兼容端点共用同一个 key |
| `AI_BASE_URL` | 否 | OpenAI 兼容端点，如 `https://api.deepseek.com/v1`；留空则走 AI Gateway |

> `AI_API_KEY` 存在即启用 AI Chat；缺失时 AI 相关依赖不会被打包，所有 AiChat 组件降级为禁用态。一组 `AI_API_KEY` + `AI_BASE_URL` 只对应一个上游，需要同时接入多家厂商时在消费方 `server/plugins/` 中用 `modelProviderRegistry.register()` 注册。

## CI/CD

- **`.github/workflows/ci.yml`** — push main / PR 时运行 `pnpm lint` + `pnpm typecheck`
- **`.github/workflows/release.yml`** — 监听 `v*` tag 推送，通过 npm Trusted Publishing（OIDC）发布 `@movk/nuxt-docs`。无需 `NPM_TOKEN`，自动附带 provenance；发布前校验 tag 与 `layer/package.json` 版本一致。重新发布可用 workflow_dispatch 手动传入 tag。
- **发布** — 本地执行 `pnpm release`：release-it 前置运行 lint + typecheck，bump 版本、生成 changelog、打 tag 并推送，随后由 `release.yml` 完成 npm 发包

## 注意事项

- **内容路径自动检测** — `content.config.ts` 通过 `docsFolderExists()` / `landingPageExists()`（在 `layer/utils/pages.ts`）决定路由前缀，新增模板时不要破坏这套约定。
- **AI Chat 条件编译** — 修改 `vite:extendConfig` 钩子时需注意：所有非 `@movk/nuxt-docs > ` 前缀的依赖会被自动加上前缀（兼容 `@nuxt/a11y > axe-core` 等嵌套依赖解析）。
- **Mermaid 可选依赖** — 启用图表时消费方需手动安装 `mermaid` + `dompurify`，layer 不会自动拉取。
- **代理发现层配置顺序** — `agentDiscovery` 中依赖 `rootDir` 的项必须由 `modules` 数组里位于 `nuxt-agent-discovery` 之前的内联模块写入，否则模块已在 `setup` 阶段读走选项。
- **Component Meta 排除清单** — `layer/nuxt.config.ts` 的 `componentMeta.exclude` 已排除 Nuxt 官方包，避免无关组件污染元数据。新增第三方 UI 库时按需追加。
- **无测试套件** — 项目当前不包含单元、集成或 E2E 测试；改动核心逻辑时优先靠 `pnpm typecheck` + `pnpm dev` 手测。
