---
title: "PageLastCommit"
description: "文档页导语下方的元信息行会显示当前 Markdown 文件的最后一次提交，包括时间、作者与提交信息；本页说明它的启用条件、日期格式配置与 PR squash merge 的作者识别。"
canonical_url: "https://docs.mhaibaraai.cn/docs/components/page-last-commit"
---
# PageLastCommit

> 文档页导语下方的元信息行会显示当前 Markdown 文件的最后一次提交，包括时间、作者与提交信息；本页说明它的启用条件、日期格式配置与 PR squash merge 的作者识别。

`PageLastCommit` 已挂载在每个文档页导语下方的元信息行，与「查看源码 / 复制页面」并列，无需在 Markdown 中手动添加。它显示：

- **更新时间**：文件最后一次提交的时间，按 `github.dateFormat` 格式化
- **作者**：提交者的 GitHub 用户名与头像，链接到其主页
- **提交信息**：提交标题的第一行，链接到该提交

## 启用条件

与 [CommitChangelog](https://docs.mhaibaraai.cn/docs/components/commit-changelog) 相同，需要 GitHub 集成可用并配置 `NUXT_GITHUB_TOKEN`：

```bash [.env]
NUXT_GITHUB_TOKEN=<your-github-token>
```

文件路径按 `{github.rootDir}/content/{页面路径}` 拼接。文档站不在仓库根目录时设置 `rootDir`：

```ts [app/app.config.ts]
export default defineAppConfig({
  github: {
    rootDir: 'docs'
  }
})
```

> [!WARNING]
> 
> rootDir
> 
>  填写错误时请求不到提交记录，组件不渲染任何内容。设置 
> 
> github: false
> 
>  可整体关闭 GitHub 集成。

## 日期格式

`github.dateFormat.locale` 与 `github.dateFormat.options` 传给 [`Intl.DateTimeFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options)。layer 默认使用 `zh-CN` 与「年 / 月 / 日 时:分」，时区跟随服务端：

```ts [app/app.config.ts]
export default defineAppConfig({
  github: {
    dateFormat: {
      locale: 'en-US',
      options: {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Shanghai'
      }
    }
  }
})
```

> [!TIP]
> 
> 日期在服务端格式化。预渲染部署时显示的是构建机所在时区，需要固定时区请显式设置 
> 
> timeZone
> 
> 。

| `options` | 输出示例（`zh-CN`） |
| --- | --- |
| `{ year: 'numeric', month: 'numeric', day: 'numeric' }` | 2026/10/23 |
| `{ year: 'numeric', month: 'short', day: 'numeric' }` | 2026年10月23日 |
| `{ dateStyle: 'medium', timeStyle: 'short' }` | 2026年10月23日 14:37 |

## PR squash merge

通过 GitHub 网页合并 PR 时，提交者是 `web-flow`。组件检测到这种情况后，从提交信息中解析 PR 编号（如 `#123`），改为显示 PR 作者，并链接到该 PR。

## 自定义

组件的 props 由文档页自动传入，`showAvatar`、`showMessage` 无法在 Markdown 中设置。需要隐藏头像、提交信息或调整样式时，可在项目中创建同名组件覆盖；`PageLastCommit` 不在 [覆盖契约](https://docs.mhaibaraai.cn/docs/guide/customization) 内，升级时需对照新实现检查。

## API

### Props

```ts
/**
 * Props for the PageLastCommit component
 */
interface PageLastCommitProps {
  /**
   * 文件路径（不含扩展名），通常由页面自动传入
   * @default ''
   */
  stem: string;
  /**
   * 文件扩展名，通常由页面自动传入
   * @default 'md'
   */
  extension: string;
  /**
   * 是否显示提交信息。
   * @default true
   */
  showMessage?: boolean | undefined;
  /**
   * 是否显示作者头像。
   * @default true
   */
  showAvatar?: boolean | undefined;
}
```

## 相关

- [CommitChangelog](https://docs.mhaibaraai.cn/docs/components/commit-changelog)：展示组件或源文件的完整提交时间线

## Changelog

See commit history for [layer/app/components/content/PageLastCommit.vue](https://github.com/mhaibaraai/movk-nuxt-docs/commits/v3/layer/app/components/content/PageLastCommit.vue).

---

- [GitHub](https://github.com/mhaibaraai/movk-nuxt-docs/blob/main/layer/app/components/content/PageLastCommit.vue)


## Sitemap

See the full [sitemap](https://docs.mhaibaraai.cn/sitemap.md) for all pages.
