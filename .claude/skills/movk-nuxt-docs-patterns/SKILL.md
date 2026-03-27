---
name: movk-nuxt-docs-patterns
description: Coding patterns extracted from movk-nuxt-docs repository — Nuxt Layer monorepo conventions, config-doc sync workflow, and deployment patterns
version: 1.0.0
source: local-git-analysis
analyzed_commits: 200
---

# Movk Nuxt Docs - 项目编码模式

从 200 个提交中提取的本项目特有编码规范与工作流模式。

## 提交规范

本项目使用**约定式提交**，类型前缀用英文，描述内容用中文：

```text
feat: 添加新功能描述
fix: 修复问题描述
refactor: 重构内容描述
chore: 维护任务描述
docs: 文档更新描述
perf: 性能优化描述
ci: CI/CD 更新描述
chore(release): v1.x.x
chore(deps): update xxx dependency
```

提交频率分布（200 个提交）：
- `fix` — 39 次（最高）
- `chore(deps)` — 30 次（依赖更新由 Renovate 自动管理）
- `refactor` — 19 次
- `feat` — 17 次
- `chore` — 16 次
- `docs` — 7 次

## 分支命名

```text
feat/<kebab-case-description>
fix/<kebab-case-description>
refactor/<kebab-case-description>
renovate/<package-name>    # 由 Renovate bot 自动创建
```

## 项目架构

pnpm monorepo，三层结构：

```
movk-nuxt-docs/
├── layer/          # @movk/nuxt-docs npm 包（核心 Nuxt Layer）
│   ├── nuxt.config.ts      # Layer 核心配置（模块注册）
│   ├── nuxt.schema.ts      # appConfig 字段类型和默认值
│   ├── app/
│   │   ├── app.config.ts   # appConfig 默认值
│   │   ├── components/     # 共享 UI 组件
│   │   └── composables/    # 共享 Composable
│   ├── modules/            # 自定义 Nuxt 模块
│   └── server/api/         # GitHub API、releases 等
├── docs/           # 文档站（引用 layer）
│   ├── nuxt.config.ts      # 文档站专属配置
│   └── content/docs/       # MDC 格式文档内容
├── templates/      # 用户项目模板
│   ├── default/    # 完整文档模板
│   └── module/     # 模块文档模板（精简）
└── skills/         # AI 技能定义
    ├── create-docs/
    └── review-docs/
```

## 关键协同变更规则

### 规则 1：Layer 配置变更必须同步文档

每次修改 `layer/nuxt.config.ts`，**必须同步更新**：
- `skills/create-docs/references/configuration.md`（共变更 8 次）
- `docs/nuxt.config.ts`（若涉及文档站配置）

### 规则 2：依赖版本级联更新

任何依赖升级必须在所有层级同步（共变更 22 次）：
```
layer/package.json → package.json → templates/default/package.json → templates/module/package.json
```

### 规则 3：部署配置双文件原则

修改部署相关配置时，`Dockerfile` 和 `.github/workflows/deploy.yml` 必须同时更新（共变更 10 次）。

### 规则 4：新增 Nuxt 模块完整清单

在 `layer/modules/` 添加新模块时，需同时更新：
1. `layer/nuxt.config.ts` — 注册模块
2. `layer/package.json` — 添加依赖
3. `layer/nuxt.schema.ts` — 定义配置字段
4. `skills/create-docs/references/configuration.md` — 更新配置文档

## 工作流示例

### 添加新 Layer 功能

```bash
# 1. 在 layer/modules/ 创建模块
# 2. 注册到 layer/nuxt.config.ts
# 3. 在 layer/nuxt.schema.ts 定义 appConfig 字段
# 4. 在 layer/app/app.config.ts 设置默认值
# 5. 更新 skills/create-docs/references/configuration.md
# 6. 在 docs/content/docs/ 编写对应文档
```

### 发布新版本

```bash
pnpm release:layer  # 运行 lint + typecheck 前置检查，发布 npm
# 自动更新: CHANGELOG.md, layer/package.json, package.json
```

## 代码风格

- **Vue 组件**：PascalCase，`.vue` 后缀
- **Composable**：`use` 前缀，TypeScript
- **API 路由**：Nuxt server routes，位于 `server/api/`
- **样式**：Tailwind CSS v4 + `@nuxt/ui`
- **内容**：MDC 格式（Markdown + 组件语法）

## 环境变量约定

```bash
NUXT_GITHUB_TOKEN      # GitHub API 访问（生产必需）
AI_GATEWAY_API_KEY     # AI Chat 功能（可选，缺失时降级）
```

AI Chat 功能采用**条件编译**：无 `AI_GATEWAY_API_KEY` 时依赖不被打包。
