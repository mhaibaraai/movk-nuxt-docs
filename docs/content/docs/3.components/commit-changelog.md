---
title: CommitChangelog
description: 自动生成组件或文件的 Git 提交历史。
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/CommitChangelog.vue
---

## 概述

根据指定文件路径，从 GitHub 仓库获取提交历史，以时间线形式展示。

## 前置要求

- **GitHub 配置**：在 `app.config.ts` 中配置 GitHub 相关信息。详见 [GitHub 集成配置](/docs/getting-started/configuration#github-集成)。
- **环境变量**：在 `.env` 文件中配置 GitHub Token：
  ```bash
  NUXT_GITHUB_TOKEN=ghp_your_personal_access_token_here
  ```

::warning{to='https://github.com/settings/tokens'}
GitHub Token 需要具有读取仓库提交历史的权限（`repo` 或 `public_repo` scope）。您可以在 GitHub Settings > Developer settings > Personal access tokens 创建新的 token。
::

::tip
如果未配置 `NUXT_GITHUB_TOKEN`，组件将不会报错，而是显示 "No recent changes"。
::

## 用法

### 基本用法

在您的 Markdown 文档中使用以下语法：

```md [md]
:commit-changelog
```

组件会自动根据当前页面路由推断组件名称，并获取对应文件的提交历史。

### 显示 Vue 组件的提交历史

```md [md]
:commit-changelog{name="Accordion"}
```

输出示例：
- [`a1b2c`](https://github.com/.../commit/a1b2c3) — fix: 修复折叠动画延迟问题 [#45](https://github.com/.../issues/45)
- [`d4e5f`](https://github.com/.../commit/d4e5f6) — feat: 添加 `disabled` 属性支持

### 显示 TypeScript 文件的提交历史

```md [md]
:commit-changelog{suffix="ts" name="useColorMode"}
```

### 按作者过滤提交

通过在 URL 查询参数中添加 `author` 可以只显示特定作者的提交：

```md [md]
:commit-changelog{author="user@example.com"}
```

::tip
`author` 参数可以是 GitHub 用户名或邮箱地址。例如：`?author=octocat` 或 `?author=user@example.com`
::

### 使用 kebab-case 命名的文件

对于使用 `kebab-case` 命名的 `composables` 或 `utils` 文件：

```md [md]
:commit-changelog{suffix="ts" name="use-user" casing="kebab" commitPath="composables"}
```

这将查找 `composables/use-user.ts` 的提交历史。

::tip
如果项目中的文件统一使用 `kebab-case` 命名，建议在 `app.config.ts` 中全局配置 `github.casing: 'kebab'`，这样就不需要在每个组件中重复指定。

```ts [app.config.ts]
export default defineAppConfig({
  github: {
    casing: 'kebab', // 全局默认使用 kebab-case
    // 其他配置...
  }
})
```
::

### 完整配置示例

```md [md]
::commit-changelog
---
commitPath: 'packages/core/src'
prefix: 'components'
suffix: 'ts'
name: 'useUser'
author: 'user@example.com'
---
```

## API

### Props

:component-props

## Changelog

:commit-changelog
