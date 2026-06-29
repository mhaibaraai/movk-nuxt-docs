---
seo:
  title: Movk Nuxt Docs
  description: A modern Nuxt 4 documentation theme with automated component docs, an AI chat assistant, MCP server, and a polished developer experience.
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
  Build modern, intelligent [docs]{.text-primary}
  :::

#description
  :::motion
  ---
  transition: { duration: 0.6, delay: 0.3 }
  ---
  A modern Nuxt 4 documentation theme with automated component docs, an AI chat assistant, MCP server, and a polished developer experience.
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
    Get Started
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
    Use Template
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

