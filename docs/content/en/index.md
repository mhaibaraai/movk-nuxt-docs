---
title: Modern Nuxt Documentation Theme
description: A modern Nuxt 4 documentation theme with automated component docs, an AI chat assistant, MCP Server, and a complete developer experience optimization.
seo:
  title: Modern Nuxt Documentation Theme
  description: Build modern Nuxt 4 documentation sites with automated component docs, AI Chat, MCP Server support, SEO, and a polished developer experience.
---

::landing-cover{kicker="Documentation theme for Nuxt" aside="Nuxt Layer · MIT"}
#title
Write docs for Nuxt[.]{.text-primary}

#description
A Nuxt Layer you can simply `extends`: Markdown authoring, generated component docs, an AI assistant and an MCP Server out of the box, so your docs read like a carefully typeset book.

#links
  :::u-button
  ---
  to: /en/docs/getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
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

  :landing-index{label="Contents"}
::

::landing-section{index="01" kicker="Docs"}
#title
Docs that write themselves

#description
Props, Slots and Emits are extracted from source; examples, commit history and type highlighting come from built-in components. Your content stays plain Markdown.

#links
  :::u-button
  ---
  color: neutral
  variant: outline
  to: /en/docs/components
  trailing-icon: i-lucide-arrow-right
  ---
  Explore component docs
  :::

#default
  :::landing-feature
  #title
  Component metadata extraction

  #description
  Reads Vue component definitions with `nuxt-component-meta`, so API tables never drift.
  :::

  :::landing-feature
  #title
  Interactive examples

  #description
  `ComponentExample` loads examples and renders the preview alongside the source.
  :::

  :::landing-feature
  #title
  Git commit history

  #description
  `CommitChangelog` and `PageLastCommit` show a file's changes and last update time.
  :::

  :::landing-feature
  #title
  Type highlighting

  #description
  Parses TypeScript types and highlights them inline for readable API docs.
  :::

  :::landing-feature
  #title
  Documentation components

  #description
  Callout, Steps, Tabs, Card and more from Nuxt UI, restyled with editorial typography.
  :::

  :::landing-feature
  #title
  Search and i18n

  #description
  ⌘K search across every page; opt-in locales with per-language collections and hreflang.
  :::
::

::landing-section{index="02" kicker="AI"}
#title
Typeset for people and AI

#description
Readers can ask the docs directly, while AI editors read the same content through the MCP Server, `llms.txt` and Agent Skills.

#links
  :::u-button
  ---
  color: neutral
  variant: outline
  to: /en/docs/ai/ai-chat
  trailing-icon: i-lucide-arrow-right
  ---
  Learn about AI features
  :::

#aside
  :landing-figure{src="/ai/AiChat.png" alt="The built-in Movk Nuxt Docs AI chat assistant" label="Fig. 1" caption="The built-in assistant answers right beside the docs."}

#default
  :::landing-feature
  #title
  AI chat assistant

  #description
  Built on the Vercel AI SDK, with streaming output and live code highlighting.
  :::

  :::landing-feature
  #title
  MCP Server

  #description
  Structured docs access for Cursor, VS Code and other editors, added in one click.
  :::

  :::landing-feature
  #title
  llms.txt

  #description
  Generates `llms.txt` and `llms-full.txt` as an index for AI tools.
  :::

  :::landing-feature
  #title
  Agent Skills

  #description
  Publishes your `skills/` directory at `/.well-known/skills` so assistants learn your project.
  :::

  :::landing-feature
  #title
  Tool calling

  #description
  The assistant searches and reads pages through tools, so answers cite the docs.
  :::

  :::landing-feature
  #title
  Flexible model routing

  #description
  AI Gateway, any OpenAI-compatible endpoint, or your own registered provider.
  :::
::

::landing-closing
#title
Start with a single Markdown file[.]{.text-primary}

#links
  :::u-button
  ---
  to: /en/docs/getting-started/installation
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Install
  :::

  :::u-button
  ---
  color: neutral
  variant: ghost
  size: xl
  to: /en/templates
  ---
  See examples
  :::
::
