# 文档模板

生成文档页面的现成模板。

**关键：所有 Nuxt UI 组件在 MDC 语法中必须使用 `u-` 前缀。**
- `::u-page-hero` 不是 `::page-hero`
- `:::u-button` 不是 `:::button`
- `::::u-page-card` 不是 `::::page-card`

## 目录

- [登陆页](#登陆页)
- [介绍页](#介绍页)
- [安装页](#安装页)
- [指南页](#指南页)
- [导航 YAML](#导航-yaml)

---

## 登陆页

### 基础登陆页

```markdown
---
seo:
  title: [项目名称] 文档
  description: [项目描述]
---

::u-page-hero
#title
[项目名称]

#description
[简短描述 - 它解决什么问题？]

#links
  :::u-button
  ---
  color: neutral
  size: xl
  to: /getting-started/introduction
  trailing-icon: i-lucide-arrow-right
  ---
  开始使用
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  to: [GitHub URL]
  target: _blank
  variant: outline
  ---
  在 GitHub 上查看
  :::
::

::u-page-section
#title
你可以做什么

#features
  :::u-page-feature
  ---
  icon: [icon]
  to: /guide/[topic]
  ---
  #title
  [动作动词] [事物]

  #description
  [一句话描述该功能]
  :::
::
```

### 带网格卡片的高级登陆页

使用 `u-page-grid` + `u-page-card` 来进行丰富的功能展示：

```markdown
::u-page-hero
#title
[项目名称]

#description
[描述]

#headline
  :::u-button
  ---
  size: sm
  to: [changelog-url]
  variant: outline
  ---
  v1.0.0 已发布 →
  :::

#links
  :::u-button
  ---
  color: neutral
  size: xl
  to: /getting-started
  trailing-icon: i-lucide-arrow-right
  ---
  开始使用
  :::
::

::u-page-section
  :::u-page-grid
    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2 lg:col-span-1
    to: /guide/feature-1
    ---
    #title
    功能一

    #description
    此功能的描述及其用途。
    ::::

    ::::u-page-card
    ---
    spotlight: true
    class: col-span-2
    ---
      :::::u-color-mode-image
      ---
      alt: 功能截图
      class: w-full rounded-lg
      dark: /images/feature-dark.png
      light: /images/feature-light.png
      ---
      :::::

    #title
    带图像的功能

    #description
    用深色/浅色模式图像展示功能。
    ::::
  :::
::
```

### 带代码预览的卡片

```markdown
::::u-page-card
---
spotlight: true
class: col-span-2 md:col-span-1
---
  :::::div{.bg-elevated.rounded-lg.p-3.overflow-x-auto}
  ```ts [config.ts]
  export default {
    option: 'value'
  }
  ```
  :::::

#title
简单配置

#description
使用简单选项进行配置。
::::
```

### 带自定义组件的卡片

在 `app/components/content/` 中创建自定义组件用于交互演示：

```markdown
::::u-page-card
---
spotlight: true
class: col-span-2
---
:my-custom-demo

#title
交互演示

#description
嵌入卡片中的自定义 Vue 组件。
::::
```

### 网格布局类

| 类 | 用法 |
|-------|-------|
| `col-span-2` | 全宽（2 列） |
| `col-span-2 lg:col-span-1` | 移动设备全宽，桌面设备半宽 |
| `col-span-2 md:col-span-1` | 移动设备全宽，平板电脑及以上设备半宽 |
| `min-h-[450px]` | 高卡片的最小高度 |

### 可选增强模式

根据项目需求选择：

| 模式 | 何时使用 |
|---------|-------------|
| 卡片中的代码预览 | 库、API、CLI |
| 带图标的功能网格 | 具有多个功能的项目 |
| CTA 部分 | 推动用户行动 |
| 代码对比 | 解决痛点的项目 |

见 [mdc-components.md](mdc-components.md) 获取组件语法。
见 https://ui.nuxt.com/llms.txt 获取完整组件参考。

---

## 介绍页

```markdown
---
title: 介绍
description: 了解 [项目名称] 是什么及何时使用
navigation:
  icon: i-lucide-house
---

[项目名称] 帮你 [主要价值主张]。

## [项目名称] 是什么？

[2-3 句话解释该项目]

## 你可以做什么

- **[操作 1]** - [简短描述]
- **[操作 2]** - [简短描述]
- **[操作 3]** - [简短描述]

## 何时使用 [项目名称]

当你需要以下情况时使用 [项目名称]：

- [使用案例 1]
- [使用案例 2]
- [使用案例 3]
```

---

## 安装页

使用检测到的包管理器并显示所有选项：

```markdown
---
title: 安装
description: 如何安装 [项目名称]
navigation:
  icon: i-lucide-download
---

## 前提条件

[列出任何前提条件]

## 如何安装

::code-group
```bash [pnpm]
pnpm add [package-name]
```

```bash [npm]
npm install [package-name]
```

```bash [yarn]
yarn add [package-name]
```

```bash [bun]
bun add [package-name]
```
::

## 如何验证安装

[验证步骤]
```

---

## 指南页

在 H2/H3 标题中使用动作动词：

```markdown
---
title: [主题]
description: 在你的 [项目名称] 应用中 [动作动词] [事物]
navigation:
  icon: [icon]
---

[一句话概览]

## 添加基础 [功能]

[解释]

```[language] [[file-path]]
[code]
```

## 配置 [功能]

[解释]

```[language] [[file-path]]
[code]
```

## 处理 [边界情况]

[解释]

## 后续步骤

- [关联指南的链接]
- [高级主题的链接]
```

**H2 标题的动作动词：** 添加、配置、创建、设置、启用、连接、处理、自定义、部署、使用

---

## 导航 YAML

每个部分文件夹需要一个 `.navigation.yml`：

```yaml
title: [部分标题]
icon: [icon-name]
```

### 按部分推荐的图标

| 部分 | 图标 |
|---------|------|
| 开始使用 | `i-lucide-rocket` |
| 指南 | `i-lucide-book-open` |
| 食谱 | `i-lucide-chef-hat` |
| API | `i-lucide-code` |
| 示例 | `i-lucide-lightbulb` |
| 配置 | `i-lucide-settings` |
| 高级 | `i-lucide-sparkles` |
