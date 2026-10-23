---
title: 现代化 Nuxt 文档主题
description: 基于 Nuxt 4 的现代文档主题，集成组件自动化文档、AI 聊天助手、MCP Server 和完整的开发者体验优化。
seo:
  title: Modern Nuxt Documentation Theme
  description: Build modern Nuxt 4 documentation sites with automated component docs, AI Chat, MCP Server support, SEO, and a polished developer experience.
---

::landing-cover{kicker="Nuxt 文档主题" aside="Nuxt Layer · MIT"}
#title
为 Nuxt 写文档[.]{.text-primary}

#description
一个可以直接 `extends` 的 Nuxt Layer：Markdown 写作、组件文档自动生成、AI 助手与 MCP Server 开箱即用，让文档站像一本认真排版的书。

#links
  :::u-button
  ---
  to: /docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  快速开始
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/mhaibaraai/movk-nuxt-docs
  target: _blank
  ---
  GitHub
  :::

#default
  :::code-group
  ```bash [pnpm]
  pnpm add @movk/nuxt-docs @nuxt/content tailwindcss
  ```

  ```bash [npm]
  npm install @movk/nuxt-docs @nuxt/content tailwindcss
  ```

  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    extends: ['@movk/nuxt-docs'],
    aiChat: {
      model: 'alibaba/qwen3.8-27b',
      models: ['alibaba/qwen3.8-27b', 'deepseek/deepseek-v4-pro-0813']
    }
  })
  ```
  :::

  :landing-index{label="目录 / Contents"}
::

::landing-section{index="01" kicker="Docs"}
#title
文档，自己写自己

#description
组件的 Props、Slots、Emits 从源码提取，示例、提交历史与类型高亮都由内置组件完成，内容只需要 Markdown。

#links
  :::u-button
  ---
  color: neutral
  variant: outline
  to: /docs/components
  trailing-icon: i-lucide-arrow-right
  ---
  查看组件文档
  :::

#default
  :::landing-feature
  #title
  组件元数据自动提取

  #description
  基于 `nuxt-component-meta` 读取 Vue 组件定义，无需手动维护 API 表格。
  :::

  :::landing-feature
  #title
  交互式示例

  #description
  `ComponentExample` 自动加载示例并渲染预览与源码。
  :::

  :::landing-feature
  #title
  Git 提交历史

  #description
  `CommitChangelog` 与 `PageLastCommit` 展示文件的变更记录与最后更新时间。
  :::

  :::landing-feature
  #title
  类型定义高亮

  #description
  解析 TypeScript 类型并内联高亮，API 文档更易读。
  :::

  :::landing-feature
  #title
  文档专用组件

  #description
  Callout、Steps、Tabs、Card 等由 Nuxt UI 提供，并统一为编辑式排版。
  :::

  :::landing-feature
  #title
  全文搜索与国际化

  #description
  ⌘K 搜索全部文档；opt-in 多语言按语言划分内容集合并输出 hreflang。
  :::
::

::landing-section{index="02" kicker="AI"}
#title
为人和 AI 同时排版

#description
读者可以直接向文档提问；AI 编辑器通过 MCP Server、`llms.txt` 与 Agent Skills 读取同一份内容。

#links
  :::u-button
  ---
  color: neutral
  variant: outline
  to: /docs/getting-started/ai-chat
  trailing-icon: i-lucide-arrow-right
  ---
  了解 AI 功能
  :::

#aside
  :landing-figure{src="/ai/AiChat.png" alt="Movk Nuxt Docs 内置 AI 聊天助手" label="图 1" caption="内置 AI 助手在文档旁实时作答。"}

#default
  :::landing-feature
  #title
  AI 聊天助手

  #description
  基于 Vercel AI SDK，流式输出并实时高亮代码。
  :::

  :::landing-feature
  #title
  MCP Server

  #description
  为 Cursor、VS Code 等编辑器提供结构化的文档访问，一键添加。
  :::

  :::landing-feature
  #title
  llms.txt

  #description
  自动生成 `llms.txt` 与 `llms-full.txt`，为 AI 工具提供文档索引。
  :::

  :::landing-feature
  #title
  Agent Skills

  #description
  将 `skills/` 目录发布为 `/.well-known/skills`，让 AI 助手学会使用你的项目。
  :::

  :::landing-feature
  #title
  工具调用

  #description
  助手可调用文档搜索、页面读取等工具，回答有据可查。
  :::

  :::landing-feature
  #title
  灵活的模型路由

  #description
  AI Gateway、OpenAI 兼容端点或自注册厂商，一个配置切换。
  :::
::

::landing-closing
#title
从一个 Markdown 文件开始[.]{.text-primary}

#links
  :::u-button
  ---
  to: /docs/getting-started/installation
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  安装
  :::

  :::u-button
  ---
  color: neutral
  variant: ghost
  size: xl
  to: /templates
  ---
  查看案例
  :::
::
