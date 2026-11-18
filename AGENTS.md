# AGENTS.md

## 项目入口

- `layer/` 是发布为 `@movk/nuxt-docs` 的 Nuxt Layer，`docs/` 是官方文档站，二者组成 pnpm workspace。`templates/` 下的 `default`、`i18n`、`module` 独立构建。
- Layer 的模块入口是 `layer/nuxt.config.ts`，`layer/nuxt.schema.ts` 定义 `appConfig` 类型和默认值并驱动 Studio。内容集合见 `layer/content.config.ts`。

## 开发与验证

```bash
pnpm dev                       # 启动官方文档站
pnpm dev:prepare               # 安装后自动执行；改动模块或 Nuxt 配置后重跑
pnpm lint                      # pnpm lint:fix 可自动修复
pnpm typecheck                 # 检查 layer 与 docs
pnpm test                      # 运行 test/unit
pnpm build && pnpm test:e2e    # 构建 Worker，再用本地 Wrangler 和模拟 D1 验证
pnpm test:template default     # 也可传入 i18n、module 或 test/fixtures/features-off
pnpm docs:reference            # 从 nuxt.schema.ts 生成 app.config 参考
```

纯函数由 `test/unit` 覆盖。修改 Nitro 的 Markdown 输出时，核对 `test/e2e/raw-markdown.spec.ts` 快照。预渲染设置了 `failOnError: false`，构建后要检查 `[request error]`，CI 会拦截。

## Layer 约定

- **内容与翻译** — 默认文档放在 `content/docs`，路由固定为 `/docs`。通过 `@nuxtjs/i18n` 和 `i18n.locales` 启用多语言，非默认语言使用 `content/{code}/docs` 和 `docs_{code}` 集合（连字符转下划线）。Layer 注册翻译，locale 省略 `file`。UI 文案经 `useMovkI18n()` 读取，`appConfig` 优先。
- **可选功能** — 开关由 `layer/utils/features.ts` 统一解析。默认开启的功能放 `dependencies`，默认关闭的功能用 optional peer，启用但缺失依赖时在构建期报错。关闭后提供空实现并从 tsconfig 排除，在 `test/fixtures/features-off` 验证。
- **组件** — 仅在 Markdown 使用的 Nuxt UI 组件由 `layer/modules/content-components.ts` 补扫。按包名注册组件的模块加入 `layer/modules/component-docs/index.ts` 中的 `COMPONENT_META_DEFAULTS.exclude`。`vite:extendConfig` 会为嵌套依赖补上 `@movk/nuxt-docs > ` 前缀。
- **代理发现** — `nuxt-agent-discovery` 负责 Markdown 协商、`/raw/**.md`、`/sitemap.md` 和 `/.well-known/*`。依赖 `rootDir` 的配置须在该模块前写入。Markdown 转换和 MCP 服务卡片补全见 `layer/server/plugins/agent-discovery.ts`，首页 Markdown 由 `layer/server/routes/raw/index.md.get.ts` 提供。
- **Agent Skills** — `docs/skills/{name}/SKILL.md` 发布到 `/.well-known/skills/`。目录名与 frontmatter 的 `name` 一致，使用不超过 64 字符且无连续连字符的 kebab-case，`description` 写明触发词。
- **AI Chat** — `layer/modules/ai-chat/` 通过 MCP 调用文档工具。模型优先使用已注册的 provider，其次是 `AI_BASE_URL` 对应的 OpenAI 兼容端点，最后走 AI Gateway。
- **上游同步** — 基准 SHA、流程和组件差异见 [UPSTREAM.md](UPSTREAM.md)。

## 官方站部署与发布

- 官方站 `docs.mhaibaraai.cn` 部署到 `movk-nuxt-docs` Worker。Workers Builds 监听 `main`，根目录为 `docs`，依次运行 `pnpm build` 和 `pnpm exec wrangler deploy`。使用 Node.js 24.15+ 和根 `packageManager` 指定的 pnpm，开启 Build cache。
- 构建时设置 `CLOUDFLARE_D1_DATABASE_ID`，由 Nitro 生成 `DB` 绑定。`NUXT_GITHUB_TOKEN` 配在构建和运行时，分别供预渲染和在线请求使用。官方站生产构建显式启用 AI Chat，`AI_API_KEY` 和直连模型所需的 `AI_BASE_URL` 配在运行时即可。可在构建区用 `NUXT_PUBLIC_AI_CHAT_MODEL` 覆盖默认模型和模型列表。
- 本地用 `pnpm --dir docs exec wrangler deploy --dry-run` 校验产物。部署后在 Worker 临时域名核对搜索、双语页面、OG 图片、Markdown 协商、MCP 和已启用的 AI Chat，再切换自定义域名。
- `pnpm release` 要求工作区干净，并运行检查、更新版本和 changelog、推送 tag。`v*` tag 触发 npm Trusted Publishing 并校验 Layer 版本。
