---
seo:
  title: Movk Nuxt Docs
  description: 基于 Nuxt 4 的现代文档主题，集成组件自动化文档、AI 聊天助手、MCP Server 和完整的开发者体验优化。
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
构建现代智能的[文档]{.text-primary}
:::

#description
:::motion
---
transition: { duration: 0.6, delay: 0.3 }
---
基于 Nuxt 4 的现代文档主题，集成组件自动化文档、AI 聊天助手、MCP Server 和完整的开发者体验优化，助您轻松构建美观、专业、智能的文档网站。
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
      aiChat: {
        model: 'mistral/devstral-2',
        models: ['mistral/devstral-2', 'openrouter/qwen/qwen3-4b:free']
      },
      mcp: {
        name: 'My Docs'
      }
    })
  filename: nuxt.config.ts
  ---

  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    extends: ['@movk/nuxt-docs'],
    aiChat: {
      model: 'mistral/devstral-2',
      models: ['mistral/devstral-2', 'openrouter/qwen/qwen3-4b:free']
    },
    mcp: {
      name: 'My Docs'
    }
  })
  ```
  ::::
:::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
自动化文档生成

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /docs/components
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  查看组件文档
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-file-code
  ---
  #title
  组件元数据自动提取

  #description
  基于 `nuxt-component-meta` 自动提取 Vue 组件的 Props、Slots、Emits 定义，无需手动维护文档。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code
  ---
  #title
  交互式示例展示

  #description
  通过 `ComponentExample` 组件自动加载和渲染组件示例，支持代码高亮和实时预览。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-commit
  ---
  #title
  Git 提交历史集成

  #description
  使用 `CommitChangelog` 和 `PageLastCommit` 组件自动展示文件的提交历史记录和最后更新时间。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  类型定义高亮

  #description
  智能解析 TypeScript 类型定义，支持内联类型高亮和类型导航，提升 API 文档可读性。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  丰富的文档组件

  #description
  内置 Accordion、Callout、Card、Steps、Tabs 等多种文档专用组件，由 Nuxt UI 提供支持。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  全文搜索

  #description
  基于 Nuxt Content 的 `ContentSearch` 组件，支持键盘快捷键（⌘K）快速搜索文档内容。
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
AI 增强体验

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /docs/getting-started/ai-chat
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  了解 AI 功能
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-bot
  ---
  #title
  AI 聊天助手

  #description
  内置智能文档助手，基于 Vercel AI SDK 支持多种 LLM 模型（Mistral、Qwen、OpenRouter），实时解答文档相关问题。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-plug
  ---
  #title
  MCP Server 支持

  #description
  集成 Model Context Protocol 服务器，为 AI 助手提供结构化的文档访问能力，提升对话准确性。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-sparkles
  ---
  #title
  LLM 优化

  #description
  通过 `nuxt-llms` 模块自动生成 `llms.txt` 和 `llms-full.txt`，为 AI 工具提供优化的文档索引。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-zap
  ---
  #title
  流式响应

  #description
  支持 AI 响应流式输出和代码高亮，配合 `shiki-stream` 实现实时语法高亮渲染。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-wrench
  ---
  #title
  工具调用支持

  #description
  AI 助手可调用内置工具函数进行文档搜索、组件查询等操作，提供更精准的答案。
  :::

  :::u-page-feature
  ---
  icon: i-lucide-settings
  ---
  #title
  灵活的模型配置

  #description
  支持自定义 AI 模型列表、API 端点和参数，轻松切换不同的 LLM 服务提供商。
  :::
::
