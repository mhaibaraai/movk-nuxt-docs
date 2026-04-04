---
name: create-docs
description: |
  为任何项目创建完整的文档网站。当被要求时使用此技能：
  "创建文档", "添加文档", "建立文档网站", "生成文档",
  "文档化项目", "编写文档", "初始化文档",
  "添加文档文件夹", "创建文档网站"。生成基于 Movk Nuxt Docs 的网站
  包含搜索、深色模式、MCP 服务器和 llms.txt 集成。
---

# 创建文档

为任何项目生成完整的、生产就绪的文档网站。

## 工作流程

1. **分析** - 检测包管理器、monorepo 结构、读取上下文
2. **初始化** - 使用正确的设置创建文档目录
3. **生成** - 使用模板编写文档页面
4. **配置** - 设置 AI 集成（MCP、llms.txt）
5. **最终化** - 提供后续步骤和正确的命令

---

## 包管理器参考

从 lock 文件检测，如果未找到则默认使用 npm：

| Lock 文件 | PM | 安装 | 运行 | 添加 |
|-----------|------|---------|-----|-----|
| `pnpm-lock.yaml` | pnpm | `pnpm install` | `pnpm run` | `pnpm add` |
| `package-lock.json` | npm | `npm install` | `npm run` | `npm install` |
| `yarn.lock` | yarn | `yarn install` | `yarn` | `yarn add` |
| `bun.lockb` | bun | `bun install` | `bun run` | `bun add` |

在下面的命令中使用 `[pm]` 作为占位符。

---

## 步骤 1：分析项目

### 检测项目结构

```
检查：
├── pnpm-workspace.yaml   → pnpm monorepo
├── turbo.json            → Turborepo monorepo
├── lerna.json            → Lerna monorepo
├── nx.json               → Nx monorepo
├── apps/                 → Apps 目录（monorepo）
├── packages/             → Packages 目录（monorepo）
├── docs/                 → 现有文档（避免覆盖）
├── README.md             → 主文档源
└── src/ 或 lib/          → 源代码位置
```

### 确定文档位置

| 项目类型 | 目标目录 | Workspace 项目 |
|--------------|------------------|-----------------|
| 标准项目 | `./docs` | N/A |
| Monorepo with `apps/` | `./apps/docs` | `apps/docs` |
| Monorepo with `packages/` | `./docs` | `docs` |
| 现有 `docs/` 文件夹 | 询问用户或 `./documentation` | — |

### 读取上下文文件

| 文件 | 提取 |
|------|---------|
| `README.md` | 项目名称、描述、功能、使用示例 |
| `package.json` | 名称、描述、依赖、仓库 URL |
| `src/` 或 `lib/` | 导出的函数、可组合项用于 API 文档 |

---

## 步骤 2：初始化文档

### 创建目录结构

```bash
# 完整模板
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/default my-docs

# 模块文档模板
npx nuxi init -t gh:mhaibaraai/movk-nuxt-docs/templates/module my-module-docs
```

**完整模板**

```
[docs-location]/
├── app/
│   └── composables/
│       ├── useCategory.ts       # 导航分类定义
│       └── useHeader.ts         # 页头导航链接
├── content/
│   ├── index.md                 # 首页（登陆页）
│   └── docs/
│       └── 1.getting-started/
│           ├── .navigation.yml
│           ├── 1.index.md
│           └── 2.installation.md
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── .editorconfig
├── .env.example
├── .gitignore
├── .vscode/
│   └── settings.json
├── eslint.config.mjs
├── nuxt.config.ts
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

**模板目录结构**

```
[docs-location]/
├── app/
│   └── composables/
│       ├── useCategory.ts
│       └── useHeader.ts
├── content/
│   ├── index.md
│   ├── releases.yml
│   └── docs/
│       └── 1.getting-started/
│           ├── .navigation.yml
│           ├── 1.index.md
│           └── 2.installation.md
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── .env.example
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

### 更新 Monorepo 配置（如适用）

#### pnpm Monorepo

1. 将文档添加到工作区并配置 `onlyBuiltDependencies`（better-sqlite3 必需）：

```yaml [pnpm-workspace.yaml]
packages:
  - 'apps/*'
  - 'docs'

onlyBuiltDependencies:
  - better-sqlite3
```

2. 添加开发脚本到根 package.json：

```json [package.json]
{
  "scripts": {
    "docs:dev": "pnpm run --filter [docs-package-name] dev"
  }
}
```

或用目录路径：

```json [package.json]
{
  "scripts": {
    "docs:dev": "cd docs && pnpm dev"
  }
}
```

#### npm/yarn Monorepo

```json [package.json]
{
  "workspaces": ["apps/*", "docs"],
  "scripts": {
    "docs:dev": "npm run dev --workspace=docs"
  }
}
```

---

## 步骤 3：生成文档

使用 [references/templates.md](./references/templates.md) 中的模板。

**关键：MDC 组件命名**

所有 MDC 中的 Nuxt UI 组件必须使用 `u-` 前缀：

| 正确 | 错误 |
|---------|-------|
| `::u-page-hero` | `::page-hero` |
| `::u-page-section` | `::page-section` |
| `:::u-page-feature` | `:::page-feature` |
| `:::u-button` | `:::button` |
| `::::u-page-card` | `::::page-card` |

没有 `u-` 前缀，Vue 将无法解析这些组件。

### 文档结构

```
content/
├── index.md                        # 登陆页
├── 1.getting-started/
│   ├── .navigation.yml
│   ├── 1.introduction.md
│   └── 2.installation.md
├── 2.guide/
│   ├── .navigation.yml
│   ├── 1.configuration.md
│   ├── 2.authentication.md
│   └── 3.deployment.md
└── 3.api/                          # 如适用
    ├── .navigation.yml
    └── 1.reference.md
```

### 生成页面

1. **登陆页**（`index.md`）- Hero + 功能网格
2. **介绍** - 什么和为什么，使用案例
3. **安装** - 前提条件、安装命令
4. **指南页面** - 功能文档，使用基于动作的 H2 标题

有关写作风格，见 [references/writing-guide.md](./references/writing-guide.md)。
有关 MDC 组件，见 [references/mdc-components.md](./references/mdc-components.md)。

---

## 步骤 4：配置 AI 集成

Movk Nuxt Docs 自动包含 MCP 服务器（`/mcp`）和 llms.txt 生成。无需配置。

**不要在登陆页面添加 AI 集成部分。** 这些功能自动工作。

可选地在介绍页面中提及：

```markdown
::note
本文档包括与 MCP 服务器的 AI 集成和自动 `llms.txt` 生成。
::
```

加载 [references/configuration.md](./references/configuration.md) 了解详细配置选项。

---

## 步骤 5：编写 Agent Skills（高级）

当项目有特定工作流（代码审查、发布流程、内容规范检查等）时，可以为文档站编写 Agent Skills，让 AI 代理直接理解和执行这些工作流。Skills 会自动发布到 `/.well-known/skills/` 端点，Claude Code、Cursor 等工具可以自动发现并加载。

### 目录结构

在文档目录下创建 `skills/` 文件夹：

```
[docs-location]/
└── skills/
    └── my-skill/
        ├── SKILL.md          # 必需：frontmatter + 工作流说明
        ├── references/       # 可选：详细参考文档
        │   └── checklist.md
        └── assets/           # 可选：模板、示例资产
            └── template.md
```

### SKILL.md 模板

```markdown
---
name: my-skill
description: |
  一句话描述此技能的用途。
  当被要求时使用：
  "触发词1", "触发词2", "触发词3"。
---

# My Skill

简短说明此技能的目标和适用场景。

## 工作流程

1. **步骤一** - 做什么
2. **步骤二** - 做什么
3. **步骤三** - 做什么

---

## 步骤一

详细说明...
```

### Frontmatter 字段

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | 是 | kebab-case，须与目录名完全一致，≤64 字符 |
| `description` | 是 | 功能描述 + 触发词列表，AI 根据触发词决定何时调用此技能 |

**触发词写法：**

```yaml
description: |
  审查 Vue 组件代码，检查性能、可访问性和最佳实践。
  当被要求时使用：
  "审查组件", "检查代码", "code review",
  "审计 Vue", "分析组件质量"。
```

### 参考文件组织

主 `SKILL.md` 保持简洁（≤500 行）。详细的规则、清单、模板放在 `references/` 中，在主文件中通过链接引用：

```markdown
详见 [references/checklist.md](./references/checklist.md)。
```

### 命名验证

- [x] 目录名与 `name` 字段完全一致
- [x] 仅包含小写字母、数字、连字符
- [x] 不以连字符开头或结尾
- [x] 无连续连字符（`--`）
- [x] 长度 ≤64 字符

### 完整示例：`release-check`

```markdown
---
name: release-check
description: |
  发布前检查项目是否满足发布条件。
  当被要求时使用：
  "检查发布条件", "准备发布", "release check",
  "验证发布", "发布前检查"。
---

# 发布检查

确保项目在发布前满足所有质量要求。

## 工作流程

1. **代码质量** - 运行 lint 和类型检查
2. **版本号** - 验证版本号已更新
3. **变更日志** - 确认 CHANGELOG 已记录
4. **构建验证** - 执行生产构建并验证产物

---

## 步骤 1：代码质量

运行以下命令，确保全部通过：

\`\`\`bash
pnpm lint
pnpm typecheck
\`\`\`

## 步骤 2：版本号

检查 `package.json` 中的 `version` 字段是否与本次发布版本一致。

## 步骤 3：变更日志

确认 `CHANGELOG.md` 顶部有当前版本的条目，包含所有主要变更。

## 步骤 4：构建验证

\`\`\`bash
pnpm build
\`\`\`

构建成功后确认 `.output/` 目录非空。
```

---

## 步骤 6：最终化

使用检测到的包管理器提供说明。

### 标准项目

```
文档已创建在 [docs-location]

启动：

  cd [docs-location]
  [pm] install
  [pm] run dev

在 http://localhost:3000 可用
```

### Monorepo

```
文档已创建在 [docs-location]

从根目录启动：

  [pm] install
  [pm] run docs:dev

或从文档目录：

  cd [docs-location]
  [pm] run dev

在 http://localhost:3000 可用
```

### 包含的功能

- 全文检索
- 深色模式
- MCP 服务器用于 AI 工具（/mcp）
- LLM 集成（/llms.txt）
- SEO 优化
- GitHub 集成
- 组件文档自动生成

### 后续步骤

1. 审查生成的内容
2. 验证 Front-Matter 完整性
3. 检查 MDC 语法正确性
4. 评估内容清晰度和 SEO
5. 检查结构和导航合理性
6. 部署到 Vercel/Netlify/Cloudflare

### 建议后续操作

文档创建后，建议增强：

```
你的文档已准备好！

你想要我：
- **自定义 UI** - 匹配你的品牌色和风格
- **增强登陆页** - 添加功能卡片、代码预览、视觉效果
- **设置部署** - 部署到 Vercel、Netlify 或 Cloudflare

让我知道你想改进什么！
```

---

## 部署

| 平台 | 命令 | 输出 |
|----------|---------|--------|
| Vercel | `npx vercel --prod` | 自动检测 |
| Netlify | `[pm] run generate` | `.output/public` |
| Cloudflare Pages | `[pm] run generate` | `.output/public` |
| GitHub Pages | `[pm] run generate` | `.output/public` |

---

## 示例：auth-utils

**检测到：** pnpm monorepo，包在 packages/ 中

**生成的结构：**
```
docs/
├── content/
│   ├── index.md
│   ├── 1.getting-started/
│   │   ├── .navigation.yml
│   │   ├── 1.introduction.md
│   │   └── 2.installation.md
│   ├── 2.guide/
│   │   ├── .navigation.yml
│   │   ├── 1.authentication.md
│   │   ├── 2.oauth-providers.md
│   │   └── 3.sessions.md
│   └── 3.api/
│       ├── .navigation.yml
│       └── 1.composables.md
├── public/
│   └── favicon.ico
├── package.json
└── .gitignore
```

**在 `authentication.md` 中**（基于动作的 H2 标题）：
```markdown
## 添加基本身份验证
## 保护你的路由
## 处理登录重定向
## 自定义会话
```
