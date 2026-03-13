# 写作指南

Movk Nuxt Docs 的内容写作规范和最佳实践。

## 内容结构

### 目录组织

需要控制排序时使用数字前缀，无需排序的文件直接命名。前缀不会出现在 URL 中：

```
content/docs/
├── 1.getting-started/         # /docs/getting-started（需要排序）
│   ├── 1.index.md             # /docs/getting-started
│   ├── 2.installation.md      # /docs/getting-started/installation
│   ├── 3.configuration.md     # /docs/getting-started/configuration
│   └── troubleshooting.md     # /docs/getting-started/troubleshooting（无需排序）
├── 2.guide/                   # /docs/guide
│   ├── 1.basics.md            # /docs/guide/basics
│   └── 2.advanced.md          # /docs/guide/advanced
└── 3.api/                     # /docs/api
    └── 1.reference.md         # /docs/api/reference
```

### Front-Matter

每个 Markdown 文件必须以 Front-Matter 开始：

```yaml
---
title: 页面标题
description: 页面描述，用于 SEO 和搜索结果。
---
```

**可选字段：**

```yaml
---
title: 页面标题
description: 页面描述
navigation:
  title: 导航中显示的短标题
  icon: i-lucide-book
category: core-concepts
seo:
  title: 自定义 SEO 标题
  description: 自定义 SEO 描述
links:
  - label: 相关页面
    icon: i-lucide-arrow-right
    to: /docs/guide
---
```

### 标题层级

- 不使用 `#`（H1）- 系统自动从 `title` 渲染
- 从 `##`（H2）开始
- 不跳级：`##` -> `###` -> `####`
- 标题后空一行

```md
## 安装

### 使用 pnpm

内容...

### 使用 npm

内容...
```

## 页面结构

每个文档页面建议遵循以下结构：

````md
---
title: 功能名称
description: 一句话描述（用于 SEO 和搜索）。
---

简短介绍（1-2 句话，说明本页内容）。

## 第一个主题

内容...

## 第二个主题

内容...

## 下一步

::card-group
  :::card{icon="i-lucide-arrow-right" title="相关页面" to="/docs/..."}
  简短描述。
  :::

  :::card{icon="i-lucide-settings" title="配置" to="/docs/configuration"}
  自定义站点设置。
  :::
::
````

**内容流顺序（快速开始 → 指南 → API）：**

1. **快速开始**：「简介」→「安装」→「快速开始」
2. **指南**：功能说明 → 配置 → 高级用法
3. **API 参考**：Props → Slots → Emits → 配置选项

## 动作导向标题

### 何时使用动词

**指南/教程页面的 H2/H3 标题**使用动词开头，让页面更易扫描和任务导向：

| 静态标题（避免）| 动作标题（推荐）|
|----------------|----------------|
| 依赖安装 | 安装依赖 |
| 项目配置 | 配置项目 |
| 主题自定义 | 自定义主题 |
| 错误处理 | 处理错误 |
| AI 聊天集成 | 集成 AI 聊天 |
| 组件覆盖 | 覆盖默认组件 |

**常用动词：**
- **主要**：安装、配置、创建、启用、连接、自定义、部署、使用
- **次要**：构建、集成、定义、添加、更新、调试、覆盖

### 例外情况（使用名词）

- 文件名：始终使用 kebab-case（`1.getting-started.md`）
- 快速开始章节：「简介」、「安装」、「快速开始」
- API 参考页：使用函数/组件名称（`useTheme`、`AiChatPanel`）
- 概念页：可使用名词（「架构」、「核心概念」）

## 下一步链接

每个**指南页面**应包含"下一步"区域，让用户有清晰的阅读路径：

```mdc
## 下一步

::card-group
  :::card{icon="i-lucide-palette" title="自定义主题" to="/docs/customization"}
  调整颜色、字体和布局。
  :::

  :::card{icon="i-lucide-bot" title="AI 聊天" to="/docs/ai-chat"}
  为文档站点添加 AI 助手。
  :::
::
```

或使用 Front-Matter 的 `links` 字段（显示在右侧边栏底部）：

```yaml
---
links:
  - label: 配置参考
    icon: i-lucide-settings
    to: /docs/configuration
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs
    target: _blank
---
```

## 中文写作规范

### 标点符号

使用全角中文标点：

| 场景 | 正确 | 错误 |
|------|------|------|
| 逗号 | 内容，说明 | 内容,说明 |
| 句号 | 完成。 | 完成. |
| 冒号 | 配置：| 配置: |
| 分号 | 第一；第二 | 第一;第二 |
| 问号 | 如何使用？ | 如何使用? |
| 感叹号 | 注意！ | 注意! |
| 顿号 | 主题、布局、组件 | 主题,布局,组件 |
| 引号 | 「配置」或 "配置" | '配置' |

### 中英文混排

中文与英文、数字之间加空格：

```
✅ 使用 Nuxt 4 构建文档站点
❌ 使用Nuxt 4构建文档站点

✅ 安装 @movk/nuxt-docs 包
❌ 安装@movk/nuxt-docs包

✅ 端口默认为 3000
❌ 端口默认为3000
```

数字和单位之间不加空格：

```
✅ 宽度为 16px
❌ 宽度为 16 px
```

### 专有名词

保持正确大小写：

| 正确 | 错误 |
|------|------|
| Nuxt | nuxt / NUXT |
| TypeScript | typescript / Typescript |
| Vue.js | vue.js / VueJS |
| GitHub | github / Github |
| Tailwind CSS | tailwindcss / TailwindCSS |
| Markdown | markdown |
| MDC | mdc |

## 代码块规范

### 语言标识符

所有代码块必须标注语言：

| 内容类型 | 标识符 | 备注 |
|----------|--------|------|
| Shell 命令 | `bash` | |
| TypeScript | `ts` | |
| JavaScript | `js` | |
| Vue 组件 | `vue` | |
| JSON 配置 | `json` | |
| YAML 配置 | `yaml` | |
| Markdown | `md` | |
| MDC 语法 | `mdc` | |
| Diff 对比 | `diff` | |
| CSS 样式 | `css` | |
| HTML | `html` | |
| 纯文本 | `text` | |
| Mermaid 图表 | `mermaid` | 需启用 `mermaid: { enabled: true }` |

### 文件名标注

在语言标识符后用方括号标注文件名：

````md
```ts [nuxt.config.ts]
export default defineNuxtConfig({})
```

```bash [Terminal]
pnpm dev
```
````

### 多包管理器示例

使用 `::tabs` 展示多种安装方式（**不使用** `::code-group`）：

````mdc
::tabs
  :::tabs-item{label="pnpm" icon="i-simple-icons-pnpm"}
  ```bash [Terminal]
  pnpm add @movk/nuxt-docs
  ```
  :::

  :::tabs-item{label="npm" icon="i-simple-icons-npm"}
  ```bash [Terminal]
  npm install @movk/nuxt-docs
  ```
  :::

  :::tabs-item{label="yarn" icon="i-simple-icons-yarn"}
  ```bash [Terminal]
  yarn add @movk/nuxt-docs
  ```
  :::
::
````

### 代码预览

对于可视化内容（Markdown 语法、表格、列表等），使用 `::code-preview` 同时展示渲染结果和源码：

````mdc
::code-preview
| 标题 1 | 标题 2 |
| ------ | ------ |
| 单元格 | 单元格 |

#code
```mdc
| 标题 1 | 标题 2 |
| ------ | ------ |
| 单元格 | 单元格 |
```
::
````

## 写作风格

### 语气

- 使用直接、清晰的表述
- 避免过于口语化或学术化
- 使用「您」作为称呼

### 简洁原则

- 一个段落一个主题
- 代码示例优于长篇文字
- 使用列表和表格提升可读性
- 避免冗余说明

```md
✅ 在 `nuxt.config.ts` 中添加：
❌ 接下来，我们需要打开 `nuxt.config.ts` 文件，然后在其中添加以下配置代码：
```

## 首页内容

首页使用 `content/index.md`，通常包含：

```yaml
---
title: 项目名称
description: 项目简短描述。
navigation: false
---
```

首页内容在 `app/pages/index.vue` 中渲染，使用 `::u-page-hero`、`::u-page-section` 等落地页组件（需要 `u-` 前缀）。详见 `references/mdc-components.md` 的「落地页模板」章节。
