import pkg from '../package.json'

export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: ['@nuxtjs/i18n'],

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

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/docs/typography': { redirect: '/docs/typography/markdown-syntax', prerender: false },
    '/docs/components': { redirect: '/docs/components/component-props', prerender: false },
    '/docs/composables': { redirect: '/docs/composables/use-header', prerender: false },
    '/en/docs': { redirect: '/en/docs/getting-started', prerender: false },
    '/en/docs/typography': { redirect: '/en/docs/typography/markdown-syntax', prerender: false },
    '/en/docs/components': { redirect: '/en/docs/components/component-props', prerender: false },
    '/en/docs/composables': { redirect: '/en/docs/composables/use-header', prerender: false }
  },

  compatibilityDate: 'latest',

  vite: {
    optimizeDeps: {
      include: [
        '@comark/vue',
        '@comark/vue/plugins/highlight',
        '@movk/core',
        '@unhead/schema-org/vue',
        'shiki-transformer-color-highlight'
      ]
    }
  },

  aiChat: {
    model: 'alibaba/qwen3.7-plus',
    models: [
      'alibaba/qwen3.7-plus',
      'alibaba/glm-5.1',
      'alibaba/deepseek-v3.2'
    ]
  },

  componentMeta: {
    include: ['app/components/TestApi.vue']
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ]
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
  },

  movkNuxtDocs: {
    a11y: true,
    mermaid: true
  }
})
