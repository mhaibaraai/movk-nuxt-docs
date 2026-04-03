---
name: create-docs
description: |
  为任何项目创建完整的文档网站。当被要求时使用此技能：
  "创建文档", "添加文档", "建立文档网站", "生成文档",
  "文档化项目", "编写文档", "初始化文档",
  "添加文档文件夹", "创建文档网站"。生成基于 Docus 的网站
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

### 检测国际化需求

检查项目是否需要多语言文档：

| 指示器 | 操作 |
|-----------|--------|
| 依赖项中有 `@nuxtjs/i18n` | 使用 i18n 模板 |
| 存在 `locales/` 或 `i18n/` 文件夹 | 使用 i18n 模板 |
| 多个语言 README 文件 | 使用 i18n 模板 |
| 用户明确提到多种语言 | 使用 i18n 模板 |
| 以上都没有 | 使用默认模板 |

---

## 步骤 2：初始化文档

### 创建目录结构

**默认模板：**

```
[docs-location]/
├── app/                            # 可选：用于自定义
│   ├── app.config.ts
│   ├── components/
│   ├── layouts/
│   └── pages/
├── content/
│   ├── index.md
│   └── 1.getting-started/
│       ├── .navigation.yml
│       └── 1.introduction.md
├── public/
│   └── favicon.ico
├── package.json
└── .gitignore
```

**i18n 模板**（如果检测到多语言）：

```
[docs-location]/
├── app/
│   └── app.config.ts
├── content/
│   ├── en/
│   │   ├── index.md
│   │   └── 1.getting-started/
│   │       ├── .navigation.yml
│   │       └── 1.introduction.md
│   └── fr/                         # 或其他检测到的语言
│       ├── index.md
│       └── 1.getting-started/
│           ├── .navigation.yml
│           └── 1.introduction.md
├── nuxt.config.ts                  # i18n 配置必需
├── public/
│   └── favicon.ico
├── package.json
└── .gitignore
```

### 创建 package.json

**默认：**

```json
{
  "name": "[project-name]-docs",
  "private": true,
  "scripts": {
    "dev": "nuxt dev --extends docus",
    "build": "nuxt build --extends docus",
    "generate": "nuxt generate --extends docus",
    "preview": "nuxt preview --extends docus"
  },
  "dependencies": {
    "docus": "latest",
    "better-sqlite3": "^12.5.0",
    "nuxt": "^4.2.2"
  }
}
```

**i18n（添加 `@nuxtjs/i18n`）：**

```json
{
  "name": "[project-name]-docs",
  "private": true,
  "scripts": {
    "dev": "nuxt dev --extends docus",
    "build": "nuxt build --extends docus",
    "generate": "nuxt generate --extends docus",
    "preview": "nuxt preview --extends docus"
  },
  "dependencies": {
    "@nuxtjs/i18n": "^10.2.1",
    "docus": "latest",
    "better-sqlite3": "^12.5.0",
    "nuxt": "^4.2.2"
  }
}
```

### 创建 nuxt.config.ts（仅 i18n）

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'fr', language: 'fr-FR', name: 'Français' }
    ],
    defaultLocale: 'en'
  }
})
```

### 创建 .gitignore

```
node_modules
.nuxt
.output
.data
dist
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

使用 [references/templates.md](../references/templates.md) 中的模板。

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

有关写作风格，见 [references/writing-guide.md](../references/writing-guide.md)。
有关 MDC 组件，见 [references/mdc-components.md](../references/mdc-components.md)。

---

## 步骤 4：配置 AI 集成

Docus 自动包含 MCP 服务器（`/mcp`）和 llms.txt 生成。无需配置。

**不要在登陆页面添加 AI 集成部分。** 这些功能自动工作。

可选地在介绍页面中提及：

```markdown
::note
本文档包括与 MCP 服务器的 AI 集成和自动 `llms.txt` 生成。
::
```

### 可选：app.config.ts

```ts [app/app.config.ts]
export default defineAppConfig({
  docus: {
    name: '[项目名称]',
    description: '[项目描述]',
    url: 'https://[docs-url]',
    socials: {
      github: '[org]/[repo]'
    }
  }
})
```

### 可选：主题自定义

如果项目具有设计系统或品牌颜色，请自定义文档主题。

#### 自定义 CSS

创建 `app/assets/css/main.css`：

```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  /* 自定义字体 */
  --font-sans: 'Inter', sans-serif;

  /* 自定义容器宽度 */
  --ui-container: 90rem;

  /* 自定义主色（使用项目品牌色） */
  --color-primary-50: oklch(0.97 0.02 250);
  --color-primary-500: oklch(0.55 0.2 250);
  --color-primary-900: oklch(0.25 0.1 250);
}
```

#### 扩展的 app.config.ts

```ts [app/app.config.ts]
export default defineAppConfig({
  docus: {
    name: '[项目名称]',
    description: '[项目描述]',
    url: 'https://[docs-url]',
    socials: {
      github: '[org]/[repo]',
      x: '@[handle]'
    }
  },
  // 自定义 UI 组件
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'zinc',
    },
    pageHero: {
      slots: {
        title: 'font-semibold sm:text-6xl'
      }
    }
  }
})
```

---

## 步骤 5：最终化

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

### 后续步骤

1. 审查生成的内容
2. 在 `content/2.guide/` 中添加更多指南
3. 在 `app.config.ts` 中自定义主题
4. 部署到 Vercel/Netlify/Cloudflare

### 建议后续操作

文档创建后，建议增强：

```
你的文档已准备好！

你想要我：
- **自定义 UI** - 匹配你的品牌色和风格
- **增强登陆页** - 添加功能卡片、代码预览、视觉效果
- **添加 i18n 支持** - 多语言文档
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
