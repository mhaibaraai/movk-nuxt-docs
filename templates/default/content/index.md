---
seo:
  title: Movk Nuxt Docs
  description: 一款由 Nuxt UI 和 Nuxt Content 强力驱动的 Nuxt 优雅文档主题。
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
ui:
  container: lg:py-20
---
#top
:hero-background

#title
:::motion
打造精美[文档]{.text-primary}.
:::

#description
:::motion
---
transition: { duration: 0.6, delay: 0.3 }
---
一款由 Nuxt UI 和 Nuxt Content 强力驱动的 Nuxt 优雅文档主题，内置内容管理、SEO、暗黑模式、全文搜索等功能，助您轻松构建美观、专业的文档网站。
:::

#links
:::motion{class="flex flex-wrap gap-x-6 gap-y-3"}
---
transition: { duration: 0.6, delay: 0.5 }
---
  ::::u-button
  ---
  to: /docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  快速入门
  ::::

  ::::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/mhaibaraai/movk-nuxt-docs
  target: _blank
  ---
  使用模板
  ::::
:::

#default
:::motion{class="mx-auto"}
---
transition: { duration: 0.6, delay: 0.1 }
---
  ::::prose-pre
  ---
  code: |
    export default defineNuxtConfig({
      extends: ['@movk/nuxt-docs'],
      css: ['~/assets/css/main.css'],
      llms: {
        domain: 'https://docs.mhaibaraai.cn',
        title: 'Movk Nuxt Docs',
        description: '一款由 Nuxt UI 和 Nuxt Content 强力驱动的 Nuxt 优雅文档主题。',
      }
    })
  filename: nuxt.config.ts
  ---

  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    extends: ['@movk/nuxt-docs'],
    css: ['~/assets/css/main.css'],
    llms: {
      domain: 'https://docs.mhaibaraai.cn',
      title: 'Movk Nuxt Docs',
      description: '一款由 Nuxt UI 和 Nuxt Content 强力驱动的 Nuxt 优雅文档主题。',
    }
  })
  ```
  ::::
:::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
由 Nuxt UI 强力驱动

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: https://ui.nuxt.com/docs/getting-started/installation/nuxt
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  探索 Nuxt UI
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  100+ UI 组件

  #description
  内置 Nuxt UI 完整的组件库。从徽章到模态框，一切开箱即用，风格统一，简单易用。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-type
  ---
  #title
  精美排版

  #description
  预置的文本组件拥有完美的视觉和谐感。无需 `@tailwindcss/typography`，即可精确控制每个元素。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  丰富的文本组件

  #description
  折叠菜单、卡片、标注、选项卡、步骤、代码块等丰富的文本组件，均由 Nuxt UI 提供，专为交互式文档设计。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  内置搜索

  #description
  基于 `ContentSearch` 组件实现全文搜索。无需 Algolia，即可获得快速、相关的结果，并支持键盘快捷键（⌘K）。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-navigation
  ---
  #title
  智能导航

  #description
  使用 `ContentNavigation` 和 `ContentToc` 组件自动生成导航。支持固定目录和上下文翻页链接。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-moon
  ---
  #title
  暗黑模式

  #description
  自动主题切换，过渡平滑。尊重系统偏好设置，并能记住用户选择。
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
由 Nuxt Content 赋能

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: https://content.nuxt.com/docs/getting-started/installation
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  探索 Nuxt Content
  :::

#features
  :::u-page-feature
  ---
  icon: i-simple-icons-markdown
  ---
  #title
  MDC 语法

  #description
  在 Markdown 中无缝嵌入 Vue 组件，轻松集成交互式元素。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-text
  ---
  #title
  基于文件的路由

  #description
  通过文件和目录组织内容，您的文档结构将自动映射为导航。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code
  ---
  #title
  语法高亮

  #description
  美观的代码块，支持语言检测、行号和一键复制功能，覆盖 100 多种语言。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-database
  ---
  #title
  内容数据库

  #description
  使用类似 MongoDB 的 API 查询您的内容，以编程方式进行筛选、排序和搜索。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-code
  ---
  #title
  Front-Matter 支持

  #description
  为内容文件添加元数据，灵活定义 SEO 标签、导航属性和自定义字段。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-branch
  ---
  #title
  版本控制

  #description
  内容与代码一同存储在您的 Git 仓库中，方便进行分支、审查和部署。
  :::
::
