import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  modules: [
    (_, nuxt) => {
      nuxt.hook('components:dirs', (dirs) => {
        dirs.unshift({ path: resolve('./app/components/content/examples'), pathPrefix: false, prefix: '', global: true })
      })
    }
  ],

  $development: {
    site: {
      url: 'http://localhost:3000'
    }
  },

  $production: {
    site: {
      url: 'https://docs.mhaibaraai.cn'
    }
  },

  css: ['~/assets/css/main.css'],
  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/docs/typography': { redirect: '/docs/typography/markdown-syntax', prerender: false },
    '/docs/components': { redirect: '/docs/components/commit-changelog', prerender: false },
    '/docs/composables': { redirect: '/docs/composables/fetch-component-example', prerender: false }
  },
  compatibilityDate: 'latest',
  aiChat: {
    model: 'mistral/devstral-3b',
    models: [
      'mistral/devstral-2',
      'openrouter/xiaomi/mimo-v2-flash:free',
      'openrouter/z-ai/glm-4.5-air:free',
      'mistral/ministral-3b'
    ]
  },
  componentMeta: {
    include: ['app/components/TestApi.vue']
  },
  llms: {
    domain: 'https://docs.mhaibaraai.cn',
    title: 'Movk Nuxt Docs',
    description: '基于 Nuxt 4 的现代文档主题，集成组件自动化文档、AI 聊天助手、MCP Server 和完整的开发者体验优化。',
    notes: [
      'Nuxt 4',
      'Nuxt UI',
      'Nuxt Content',
      'LLM 集成',
      '文档主题',
      '组件自动化文档',
      'AI 聊天助手',
      'MCP Server',
      'MDC 语法',
      'SEO 优化',
      '暗黑模式',
      '全文搜索'
    ],
    full: {
      title: 'Movk Nuxt Docs - 现代化 Nuxt 文档主题',
      description: '一款由 Nuxt UI 和 Nuxt Content 强力驱动的 Nuxt 优雅文档主题，内置组件文档自动生成、AI 聊天助手、MCP Server 支持、SEO 优化、暗黑模式、全文搜索等功能，助您轻松构建美观、专业、智能的文档网站。'
    }
  },
  mcp: {
    name: 'Movk Nuxt Docs',
    browserRedirect: '/docs/getting-started/mcp'
  }
})
