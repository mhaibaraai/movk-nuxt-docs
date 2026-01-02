---
title: 自定义
description: 了解如何通过覆盖内置组件来自定义您的 Movk Nuxt Docs 文档，包括头部、页脚和页面特定元素，以打造独特的文档外观。
---

要覆盖一个组件，只需在您的 `components/` 目录下创建一个同名的 Vue 文件即可。

## 头部 (Header)

您可以通过覆盖 `components/header` 目录下的以下组件，来自定义头部的不同部分：

- `Header`
- `HeaderLogo`
- `HeaderBody`
- `HeaderBottom`

## 页脚 (Footer)

您可以通过覆盖 `components/footer` 目录下的 `Footer` 组件来自定义页脚。

## 页面 (Page)

您还可以自定义文档页面的头部和侧边栏。

### `PageHeaderLinks`

在文档页面头部的右侧，Movk Nuxt Docs 默认会显示一个下拉菜单，其中包含与当前页面 Markdown 源文件相关的快捷操作。这些操作允许读者：

- **复制**原始 `.md` 文件的直接链接到剪贴板。
- 在新的浏览器标签页中**查看** Markdown 源文件。
- 在 ChatGPT 或 Claude 中**打开**页面内容，并预设一个提示来分析该 Markdown 文件。

这些功能对于贡献者、读者或 AI 辅助工作流非常有用。不过，您也可以通过创建自己的 `components/PageHeaderLinks.vue` 组件来覆盖此行为。

### `AdsCarbon`

要自定义文档页面右侧边栏的底部区域，您可以创建 `components/AdsCarbon.vue` 组件。
