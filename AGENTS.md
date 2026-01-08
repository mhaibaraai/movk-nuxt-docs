# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## 项目概述

**Movk Nuxt Docs** 是一款优雅的 Nuxt 4 文档主题,由 Nuxt UI 和 Nuxt Content 强力驱动。

**项目结构:**
- `layer/` - @movk/nuxt-docs NPM 包核心(发布到 npm)
- `docs/` - 官方文档站点(演示 + 开发环境)
- `templates/` - 用户项目模板(default/module)

**技术栈:** Nuxt 4 + Vue 3 + Nuxt Content + Nuxt UI + Tailwind CSS 4 + TypeScript

## 常用命令

### 开发

```bash
pnpm dev              # 启动 docs 开发服务器(http://localhost:3000)
pnpm build            # 构建 docs 应用
pnpm preview          # 预览生产构建
```

### 代码质量

```bash
pnpm lint             # ESLint 检查
pnpm lint:fix         # 自动修复 lint 问题
pnpm typecheck        # TypeScript 类型检查(仅检查 layer/)
```

### 发布

```bash
pnpm release:layer    # 发布 layer 到 npm(会自动运行 lint + typecheck)
pnpm release          # 完整发布(layer + GitHub Release + CHANGELOG)
```

### 清理

```bash
pnpm clean            # 清理构建缓存和 node_modules
```

## 架构要点

### Monorepo 结构

- 使用 pnpm workspace 管理 layer 和 docs 两个包
- layer 作为 Nuxt layer 可被其他项目 extends
- docs 通过 `extends: ../layer` 继承 layer 配置

### 核心模块系统

**layer/modules/** 包含 4 个关键模块:

1. **config.ts** - 配置注入模块
   - 自动检测 git 信息(owner/repo/url/branch)
   - 提取 package.json 元数据(title/description/version)
   - 配置 SEO、路由规则、GitHub 集成
   - 配置 nuxt-component-meta 反射系统

2. **component-example.ts** - 组件示例导出
   - 自动生成组件 Props/Slots/Emits 文档
   - 配合 `ComponentProps.vue`/`ComponentSlots.vue`/`ComponentEmits.vue` 使用

3. **ai-chat/** - AI 聊天模块
   - 条件启用(需要 AI_GATEWAY_API_KEY 或 OPENROUTER_API_KEY)
   - 支持多模型选择(OpenRouter + AI Gateway)
   - MCP 工具集成(list-pages/get-page)

4. **css.ts** - CSS 处理模块
   - 注入全局样式

### Git 历史集成

- **layer/utils/git.ts** 提供 git 信息提取工具
  - `getGitBranch()` - 支持 CI 环境(GitHub Actions/Vercel/Cloudflare Pages)
  - `getLocalGitInfo()` - 解析本地 .git 目录
  - `getGitEnv()` - 读取 CI 环境变量

- **CommitChangelog.vue** - 显示文件提交历史
- **PageLastCommit.vue** - 显示页面最后修改信息
- 使用 @octokit/rest 调用 GitHub API

### 导航系统

**useNavigation.ts** 的关键功能:
- `groupChildrenByCategory()` - 按 category 元数据聚合页面
- `findBreadcrumb(path)` - 生成面包屑导航
- `rootNavigation` - 所有文档的树形结构

**useCategory.ts** - 定义文档分类(components/composables 等)

### 内容 Schema

**content.config.ts** 定义两个集合:
- `landing` - 首页内容(index.md)
- `docs` - 文档内容(docs/**/*)

**前置数据字段:**
```typescript
{
  title: string              // 页面标题(必填)
  description?: string       // 页面描述
  links?: Button[]           // 相关链接按钮
  category?: string          // 分类 ID(用于 groupChildrenByCategory)
  navigation?: {
    title?: string           // 导航标题覆盖(默认使用 title)
  }
}
```

### 组件文档自动生成

**工作流程:**
1. nuxt-component-meta 反射组件的 Props/Slots/Emits
2. ComponentProps.vue 等组件渲染文档表格
3. 在 Markdown 中通过 MDC 语法调用:
   ```md
   ::ComponentProps{component="Button"}
   ::
   ```

**API 端点:**
- `/api/component-example?component=Button` - 获取组件示例代码
- `/api/github/commits?path=...` - 获取文件提交历史
- `/api/github/last-commit?path=...` - 获取最后一次提交

### AI 聊天配置

**环境变量:**
```bash
AI_GATEWAY_API_KEY      # AI SDK Gateway 密钥
OPENROUTER_API_KEY      # OpenRouter 密钥
```

**nuxt.config.ts 配置示例:**
```typescript
aiChat: {
  model: 'mistral/devstral-2',           // 默认模型
  models: [                               // 可用模型列表
    'mistral/devstral-2',
    'openrouter/mistralai/devstral-2512:free'
  ]
}
```

### MCP 工具集成

**layer/server/mcp/tools/** 提供:
- `list-pages` - 列出所有文档页面(供 LLM 查询)
- `get-page` - 获取特定页面内容

配合 `@nuxtjs/mcp-toolkit` 模块使用。

## 开发约定

### 目录约定

- `/app/components` - 自动注册的全局组件(PascalCase)
- `/app/composables` - 自动导入的组合函数(camelCase,use* 前缀)
- `/app/layouts` - 布局文件
- `/server/api` - API 路由(自动生成)
- `/content/docs` - 文档内容(支持 MDC 语法)
- `/public` - 静态资源

### 命名规范

- **组件:** PascalCase (`ComponentName.vue`)
- **Composables:** camelCase + use 前缀(`useNavigation.ts`)
- **模块:** kebab-case (`ai-chat`)
- **类型:** PascalCase (`Button`, `AiChatModuleOptions`)

### ESLint 规则

- 允许单词组件名(`vue/multi-word-component-names: off`)
- 单行最多 3 个属性,多行每行 1 个
- 不强制 explicit any 类型
- 使用 1tbs 括号风格,不使用末尾逗号

### Commit 规范

使用 Conventional Commits:
- `feat:` - ✨ Features
- `fix:` - 🐛 Bug Fixes
- `refactor:` - ♻️ Code Refactoring
- `docs:` - 📝 Documentation
- `perf:` - ⚡ Performance Improvements

发布时自动生成 CHANGELOG.md。

## 发布流程

### Layer 发布(npm)

```bash
pnpm release:layer
```
执行步骤:
1. 运行 `pnpm lint` + `pnpm typecheck`(失败则中断)
2. 执行 release-it 更新版本号
3. 创建 git tag
4. `cd layer && npm publish` 发布到 npm

### 完整发布

```bash
pnpm release
```
执行步骤:
1. 先执行 `pnpm release:layer`
2. 更新根 package.json 版本
3. 创建 GitHub Release
4. 自动更新 CHANGELOG.md

**注意:** 发布前必须通过 lint 和 typecheck 检查。

## 性能优化

- **Vite 依赖优化** - 预优化 Tailwind Colors、Slugify 等
- **ISR 路由** - llms.txt 使用增量静态再生
- **图片优化** - @nuxt/image 自动转换 WebP
- **代码高亮** - Shiki 支持 20+ 语言(bash/ts/vue/diff 等)

## LLM 优化

- **nuxt-llms 模块** - 自动生成 `llms.txt` 和 `llms-full.txt`
- **MCP 工具** - 让 AI 助手能查询文档内容
- **结构化文档** - 使用 Nuxt Content 的树形结构
- **路由配置:**
  ```typescript
  routeRules: {
    '/llms.txt': { isr: true },
    '/llms-full.txt': { isr: true }
  }
  ```

## 依赖说明

### 必须编译的依赖

```yaml
onlyBuiltDependencies:
  - better-sqlite3   # Nuxt Content 数据库
  - sharp            # 图片处理
```
安装时会自动编译这些 native 模块。

### Peer Dependencies

- `nuxt: 4.x`
- `better-sqlite3: 12.x`

使用 layer 时必须手动安装这些依赖。

## 特殊功能

### 主题系统

- **useTheme.ts** - 主题管理(dark/light)
- **ThemePicker.vue** - 主题选择器
- **plugins/theme.ts** - 主题初始化

### 代码高亮

- **useHighlighter.ts** - Shiki 高亮器封装
- **shiki-transformer-icon-highlight.ts** - 自定义转换器(图标高亮)
- **HighlightInlineType.vue** - 内联类型高亮

### FAQ 系统

- **useFaq.ts** - FAQ 数据管理
- 配合 AI 聊天模块使用

### 分析集成

- **useAnalytics.ts** - 分析集成封装
- 支持 @vercel/analytics 和 @vercel/speed-insights

## 调试技巧

### 检查 git 信息

```typescript
// 在组件中
const config = useRuntimeConfig()
console.log(config.public.github) // GitHub 配置
```

### 检查路由元数据

```typescript
// 在页面中
const { page } = useContent()
console.log(page.value) // 当前页面元数据
```

### 查看导航树

```typescript
const { navigation, rootNavigation } = useNavigation()
console.log(rootNavigation.value) // 完整导航树
```

### MCP 工具测试

访问 `http://localhost:3000/mcp` 查看 MCP 服务器状态。

## 常见问题

### Layer 开发与调试

- 修改 layer 代码后,docs 会自动热更新
- TypeScript 类型检查仅针对 layer 目录
- 构建时 docs 会自动继承 layer 配置

### Git 历史显示异常

- 确保项目是 git 仓库(`git init`)
- 设置环境变量:`NUXT_PUBLIC_GITHUB_OWNER` 和 `NUXT_PUBLIC_GITHUB_REPO`
- CI 环境会自动检测(GitHub Actions/Vercel/Cloudflare Pages)

### AI 聊天未启用

- 检查环境变量:`AI_GATEWAY_API_KEY` 或 `OPENROUTER_API_KEY`
- 确认 `nuxt.config.ts` 中 `aiChat.enable !== false`

### 组件文档未生成

- 确保组件在 `app/components` 目录
- 确保组件有 TypeScript Props 定义
- 检查 `nuxt-component-meta` 模块是否正确配置

## 相关文档

- [Nuxt 文档](https://nuxt.com)
- [Nuxt Content 文档](https://content.nuxt.com)
- [Nuxt UI 文档](https://ui.nuxt.com)
- [项目文档](https://docs.mhaibaraai.cn)
