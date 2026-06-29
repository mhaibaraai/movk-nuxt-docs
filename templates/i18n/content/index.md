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
          model: 'zai/glm-4.7',
          models: ['zai/glm-4.7', 'anthropic/claude-sonnet-4.6']
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

