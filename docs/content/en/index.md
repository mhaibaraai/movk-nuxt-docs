---
title: Modern Nuxt Documentation Theme
description: A modern Nuxt 4 documentation theme with automated component docs, an AI chat assistant, MCP Server, and a complete developer experience optimization.
seo:
  title: Modern Nuxt Documentation Theme
  description: Build modern Nuxt 4 documentation sites with automated component docs, AI Chat, MCP Server support, SEO, and a polished developer experience.
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
  Build modern, intelligent [documentation]{.text-primary}
  :::

#description
  :::motion
  ---
  transition: { duration: 0.6, delay: 0.3 }
  ---
  A modern Nuxt 4 documentation theme with automated component docs, an AI chat assistant, MCP Server, and a complete developer experience optimization, helping you build beautiful, professional, and intelligent documentation sites.
  :::

#links
  :::motion{class="flex flex-wrap gap-x-6 gap-y-3"}
  ---
  transition: { duration: 0.6, delay: 0.5 }
  ---
    ::::u-button
    ---
    to: /en/docs/getting-started
    size: xl
    trailing-icon: i-lucide-arrow-right
    ---
    Get started
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
    Use this template
    ::::
  :::

#default
  :::motion{class="mx-auto"}
  ---
  transition: { duration: 0.6, delay: 0.1 }
  ---
    ::::code-group
    ```ts [nuxt.config.ts]
    export default defineNuxtConfig({
      extends: ['@movk/nuxt-docs'],
      aiChat: {
          model: 'zai/glm-4.7',
          models: ['zai/glm-4.7', 'anthropic/claude-sonnet-4.6']
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
Automated documentation generation

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /en/docs/components
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore component docs
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-file-code
  ---
  #title
  Automatic component metadata extraction

  #description
  Powered by `nuxt-component-meta`, automatically extracts the Props, Slots, and Emits definitions of Vue components, with no manual docs to maintain.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code
  ---
  #title
  Interactive example showcase

  #description
  The `ComponentExample` component automatically loads and renders component examples, with code highlighting and live preview.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-commit
  ---
  #title
  Git commit history integration

  #description
  Use the `CommitChangelog` and `PageLastCommit` components to automatically display a file's commit history and last update time.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  Type definition highlighting

  #description
  Intelligently parses TypeScript type definitions, with inline type highlighting and type navigation to improve the readability of API docs.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  Rich documentation components

  #description
  Built-in documentation components such as Accordion, Callout, Card, Steps, and Tabs, powered by Nuxt UI.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  Full-text search

  #description
  Based on the `ContentSearch` component from Nuxt Content, with keyboard shortcut (⌘K) support for quickly searching documentation content.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-languages
  ---
  #title
  Internationalization

  #description
  Opt-in multilingual support powered by `@nuxtjs/i18n`, with per-locale content collections, a built-in language switcher, and hreflang SEO.
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
AI-enhanced experience

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /en/docs/getting-started/ai-chat
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Learn about AI features
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-bot
  ---
  #title
  AI chat assistant

  #description
  A built-in intelligent documentation assistant, powered by the Vercel AI SDK with support for multiple LLM models, answering documentation questions in real time.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-plug
  ---
  #title
  MCP Server support

  #description
  Integrates a Model Context Protocol server to give AI assistants structured access to your docs, improving conversation accuracy.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-sparkles
  ---
  #title
  LLM optimization

  #description
  The `nuxt-llms` module automatically generates `llms.txt` and `llms-full.txt`, providing an optimized documentation index for AI tools.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-zap
  ---
  #title
  Streaming responses

  #description
  Supports streaming AI output and code highlighting, working with `shiki-stream` for real-time syntax highlighting.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-wrench
  ---
  #title
  Tool calling support

  #description
  The AI assistant can call built-in tool functions to search docs, query components, and more, delivering more precise answers.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-settings
  ---
  #title
  Flexible model configuration

  #description
  Supports custom AI model lists, API endpoints, and parameters, making it easy to switch between LLM service providers.
  :::
::
