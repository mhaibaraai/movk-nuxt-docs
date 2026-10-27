# AGENTS.md

This file provides guidance for AI coding agents working on this repository.

## 常用命令

```bash
pnpm install          # postinstall 自动执行 dev:prepare
pnpm dev              # nuxt dev docs --extends ../layer，http://localhost:3000
pnpm build
pnpm lint             # lint:fix 自动修复
pnpm typecheck        # layer + docs 站点
pnpm test             # vitest，test/unit；test:coverage 出覆盖率
pnpm test:e2e         # Playwright，需先 pnpm build；--update-snapshots 更新 raw markdown 快照
pnpm test:template default   # 用本地 layer 打包产物构建模板（default | i18n | module）
pnpm docs:reference   # 由 layer/nuxt.schema.ts 生成 app.config 参考文档
pnpm release          # 需干净工作区：lint + typecheck、bump 根与 layer 版本、changelog、打 tag 推送
```

改动 `layer/` 通常可热更新；新增模块或修改 `nuxt.config.ts` / `nuxt.schema.ts` 后需重新执行 `pnpm dev:prepare`。

## 项目结构

pnpm monorepo，workspace 只包含 `layer` 与 `docs`；`templates/`（`default`、`i18n`、`module`）不在 workspace 内。

- `layer/` — npm 包 `@movk/nuxt-docs`（Nuxt Layer），仓库核心
- `docs/` — 官方文档站点，部署到 docs.mhaibaraai.cn
- `templates/` — 用户项目模板

### Layer 关键入口

- `nuxt.config.ts` — 注册模块，`vite:extendConfig` 钩子按功能开关决定可选依赖是否预打包
- `nuxt.schema.ts` — 所有 `appConfig` 字段的类型与默认值，是配置的唯一来源，同时驱动 Studio 编辑界面
- `content.config.ts` — 按 locale 生成 `docs` / `landing` / `releases` / `templates` 集合
- `modules/` — `ai-chat/`、`component-docs/`、`components/`、`css.ts`、`i18n.ts`、`module.ts`、`routing.ts`
- `server/` — Nitro `api/`、`mcp/`、`mdc/`（`transformMDC`，MDC 转纯 Markdown）、`plugins/`、`routes/`、`utils/`
- `utils/features.ts` — 功能开关统一解析；`utils/feature-dependencies.ts` 校验可选依赖；`utils/feature-types.ts` 把关闭的功能移出 tsconfig

### AI Chat（`layer/modules/ai-chat/`）

服务端 `streamText` 通过 MCP 客户端连接文档 MCP Server 获取工具。模型解析（`runtime/server/utils/getModel.ts`）优先级：`modelProviderRegistry` 注册的 provider > `AI_BASE_URL` OpenAI 兼容直连（`createOpenAI().chat()`，剥掉 `provider/` 前缀）> AI Gateway 兜底。

### 代理发现层

由 [`nuxt-agent-discovery`](https://github.com/benjamincanac/nuxt-agent-discovery) 提供 `/raw/**.md`、Markdown 内容协商、`/sitemap.md`、`/.well-known/*`（api-catalog、MCP 服务卡片、Agent Skills）与 robots agent 分组。Layer 只负责：

- `nuxt.config.ts` 的 `agentDiscovery` 配置
- `server/plugins/agent-discovery.ts` — 用 `transformMDC` 转换文档，请求期补全 MCP 服务卡片 `serverInfo`
- `server/routes/raw/index.md.get.ts` — 接管首页的 Markdown 表示

### Agent Skills

位于 `docs/skills/{name}/SKILL.md`，构建时发布到 `/.well-known/skills/`。目录名须与 frontmatter `name` 一致（kebab-case，≤64 字符，无 `--`），并提供含触发词的 `description`，否则构建时跳过并告警。当前内置 `create-docs`、`review-docs`。

### 国际化

opt-in：消费方在 `modules` 加入 `@nuxtjs/i18n` 并配置 `i18n.locales` 后激活。

- `layer/modules/i18n.ts` 过滤缺翻译或内容目录的 locale，强制 `prefix_except_default`，合并站点与内置翻译后经 `i18n:registerModule` 注册
- 默认语言内容在 `content/docs`，其余在 `content/{code}/docs`；非默认语言集合名为 `docs_{code}` 等（`-` 换成 `_`）
- 内置翻译 `layer/i18n/locales/{zh-CN,en}.json`，站点 `i18n/locales/{code}.json` 优先
- UI 文案按 `appConfig 覆盖 ?? i18n 翻译` 解析；`useMovkI18n()` 是统一入口，开关两态行为一致

## 环境变量

| 变量 | 说明 |
|------|------|
| `NUXT_GITHUB_TOKEN` | 生产环境必需，获取 Releases 与提交历史 |
| `AI_API_KEY` | AI Chat 总开关，Gateway 与兼容端点共用 |
| `AI_BASE_URL` | OpenAI 兼容端点；留空走 AI Gateway |

## CI/CD

- `ci.yml` — `check`（lint、typecheck、单测、pkg-pr-new 预览包）、`docs`（无 `AI_API_KEY` 构建 + E2E）、`templates`（三套模板与 `test/fixtures/features-off`）
- `release.yml` — `v*` tag 触发，npm Trusted Publishing 发布，校验 tag 与 `layer/package.json` 版本一致

## 注意事项

- **内容路径** — 文档固定位于 `content/docs`，路由前缀固定为 `/docs`
- **功能开关** — `movkNuxtDocs.componentDocs / mcp / ogImage / mermaid / a11y` 与 `aiChat.enabled`。默认开启的功能依赖放 `dependencies`，默认关闭的为 optional peer，启用未安装时构建期报错。关闭的功能其虚拟模块、`defineOgImage`、`useAIChat` 指向空实现；新增可选功能沿用此模式，并在 `test/fixtures/features-off` 覆盖
- **optimizeDeps 前缀** — `vite:extendConfig` 中非 `@movk/nuxt-docs > ` 前缀的嵌套依赖会被自动加前缀
- **代理发现配置顺序** — 依赖 `rootDir` 的 `agentDiscovery` 选项必须由位于 `nuxt-agent-discovery` 之前的内联模块写入，否则模块已在 `setup` 中读走
- **Component Meta 排除** — 以包名注册组件的模块需追加到 `layer/modules/component-docs/index.ts` 的 `COMPONENT_META_DEFAULTS.exclude`
- **测试分层** — 纯函数放 `layer/utils`、`layer/shared`、`layer/app/utils` 并由 `test/unit` 覆盖；`transformMDC` 等依赖 Nitro 的逻辑以 `test/e2e/raw-markdown.spec.ts` 快照做特征测试，重构时快照须保持不变
- **预渲染死链** — `failOnError: false` 只输出 `[request error]` 日志，CI 显式拦截
- **i18n locales 不要声明 `file`** — 翻译由 layer 注册，声明 `file` 会另行加载，文件缺失时构建失败
- **上游同步** — Layer 源自 nuxt/ui `docs/`，基准 SHA 与流程见 `UPSTREAM.md`；只移植 layer 有对应实现且不改变消费方行为的改动
