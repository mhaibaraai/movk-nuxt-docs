---
title: "CommitChangelog"
description: "CommitChangelog 自动从 GitHub 仓库获取指定组件或文件的 Git 提交历史，以时间线卡片形式展示。支持通过文件名、路径、作者过滤，以及 commitPath、suffix、casing 路径推断配置。需配置 NUXT_GITHUB_TOKEN 环境变量。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/commit-changelog"
---
# CommitChangelog

> CommitChangelog 自动从 GitHub 仓库获取指定组件或文件的 Git 提交历史，以时间线卡片形式展示。支持通过文件名、路径、作者过滤，以及 commitPath、suffix、casing 路径推断配置。需配置 NUXT_GITHUB_TOKEN 环境变量。

## 概述

根据指定文件路径，从 GitHub 仓库获取提交历史，以时间线形式展示。

## 前置要求

- **GitHub 配置**：在 `app/app.config.ts` 中配置 GitHub 相关信息。详见 [GitHub 集成配置](https://docs.mhaibaraai.cn/docs/guide/configuration#github-%E9%9B%86%E6%88%90)。
- **环境变量**：在 `.env` 文件中配置 GitHub Token：
```bash
NUXT_GITHUB_TOKEN=ghp_your_personal_access_token_here
```

> [!WARNING]
> See: https://github.com/settings/tokens
> 
> GitHub Token 需要具有读取仓库提交历史的权限（
> 
> repo
> 
>  或 
> 
> public_repo
> 
>  scope）。您可以在 GitHub Settings > Developer settings > Personal access tokens 创建新的 token。

> [!TIP]
> 
> 如果未配置 
> 
> NUXT_GITHUB_TOKEN
> 
> ，组件将不会报错，而是显示 "No recent changes"。

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

> [!TIP]
> 
> author
> 
>  参数可以是 GitHub 用户名或邮箱地址。例如：
> 
> ?author=octocat
> 
>  或 
> 
> ?author=user@example.com

### 使用 kebab-case 命名的文件

对于使用 `kebab-case` 命名的 `composables` 或 `utils` 文件：

```md [md]
:commit-changelog{suffix="ts" name="use-user" casing="kebab" commitPath="composables"}
```

这将查找 `composables/use-user.ts` 的提交历史。

> [!TIP]
> 
> 如果项目中的文件统一使用 `kebab-case` 命名，建议在 `app/app.config.ts` 中全局配置 `github.casing: 'kebab'`，这样就不需要在每个组件中重复指定。
> 
> ```ts [app/app.config.ts]
> export default defineAppConfig({
>   github: {
>     casing: 'kebab', // 全局默认使用 kebab-case
>     // 其他配置...
>   }
> })
> ```

### 关联多个文件

一篇文档常常对应多个源码文件（例如一组相关的 composable）。通过 `files` 数组可以一次关联多个文件，组件会合并这些文件的提交记录，去重后按时间倒序统一展示。

`files` 的每一项都是对顶层配置（`commitPath`、`prefix`、`suffix`、`name`、`casing`）的**局部覆盖**，未指定的字段沿用顶层值。因此公共部分（如同目录、同扩展名）写在顶层，`files` 里只写各自不同的字段：

```md [md]
::commit-changelog
---
commitPath: 'layer/app/composables'
suffix: 'ts'
files:
  - name: 'useHeader'
  - name: 'useNavigation'
---
```

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

```ts
/**
 * Props for the CommitChangelog component
 */
interface CommitChangelogProps {
  /**
   * 仓库中的文件路径
   * @default 'src'
   */
  commitPath?: string | undefined;
  /**
   * 文件路径的前缀
   */
  prefix?: string | undefined;
  /**
   * 文件扩展名
   * @default 'vue'
   */
  suffix?: string | undefined;
  /**
   * 要获取更新日志的组件或文件名
   */
  name?: string | undefined;
  /**
   * 按作者筛选提交
   */
  author?: string | undefined;
  /**
   * 文件名的命名格式
   * - 'auto': Vue 文件使用 PascalCase，其他使用 camelCase（默认）
   * - 'kebab': 保持 kebab-case（如 use-user.ts）
   * - 'camel': 转换为 camelCase（如 useUser.ts）
   * - 'pascal': 转换为 PascalCase（如 UseUser.ts）
   * @default 'auto'
   */
  casing?: "auto" | "kebab" | "camel" | "pascal" | undefined;
  /**
   * 关联多个文件：每一项与顶层 props 合并后各自解析出一个文件路径，
   * 对应的提交记录会合并去重并按时间倒序展示
   */
  files?: CommitChangelogFile[] | undefined;
}
```

## 相关

- [PageLastCommit](https://docs.mhaibaraai.cn/docs/components/page-last-commit) — 显示当前页面的最后更新信息
- [useFetchComponentMeta](https://docs.mhaibaraai.cn/docs/reference/composables/fetch-component-meta) — 获取组件元数据的 Composable

## Changelog

See commit history for [layer/app/components/content/CommitChangelog.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/app/components/content/CommitChangelog.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/CommitChangelog.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
