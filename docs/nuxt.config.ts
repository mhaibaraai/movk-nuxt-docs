import pkg from '../package.json'

const moved = (slugs: string[], from: string, to: string) =>
  Object.fromEntries(slugs.map(slug => [`${from}/${slug}`, `${to}/${slug}`]))

// 区块首页跳到首篇
const sectionRedirects: Record<string, string> = {
  '/docs': '/docs/getting-started',
  '/docs/guide': '/docs/guide/configuration',
  '/docs/ai': '/docs/ai/ai-chat',
  '/docs/writing': '/docs/writing/markdown-syntax',
  '/docs/components': '/docs/components/component-props',
  '/docs/reference': '/docs/reference/composables/use-header',
  '/docs/reference/composables': '/docs/reference/composables/use-header'
}

// v2 旧路径永久跳到 v3 新位置
const legacyRedirects: Record<string, string> = {
  '/docs/typography': '/docs/writing/markdown-syntax',
  '/docs/composables': '/docs/reference/composables/use-header',
  '/docs/getting-started/nuxt': '/docs/guide/pages',
  ...moved(['configuration', 'customization', 'i18n', 'deployment', 'troubleshooting'], '/docs/getting-started', '/docs/guide'),
  ...moved(['ai-chat', 'mcp', 'skills', 'llms-txt'], '/docs/getting-started', '/docs/ai'),
  ...moved(['markdown-syntax', 'code-blocks', 'mdc-components', 'media', 'mermaid'], '/docs/typography', '/docs/writing'),
  ...moved(['use-header', 'use-navigation', 'use-category', 'use-theme', 'fetch-component-meta', 'fetch-component-example'], '/docs/composables', '/docs/reference/composables')
}

const redirectRules = (redirects: Record<string, string>, statusCode: number) =>
  ['', '/en'].flatMap(prefix => Object.entries(redirects).map(([from, to]) => [
    `${prefix}${from}`,
    { redirect: { to: `${prefix}${to}`, statusCode }, prerender: false }
  ]))

export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: [
    '@nuxtjs/i18n',
    '@vercel/analytics',
    '@vercel/speed-insights'
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

  app: {
    head: {
      // 中文字体经 unicode-range 分包托管在 CDN，按需加载；crossorigin 需与 woff2 的 CORS 请求一致才能复用预热连接
      link: [
        { rel: 'preconnect', href: 'https://cdn.mhaibaraai.cn', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://cdn.mhaibaraai.cn/fonts/alibaba-puhuiti.css' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  routeRules: Object.fromEntries([
    ...redirectRules(sectionRedirects, 302),
    ...redirectRules(legacyRedirects, 301)
  ]),

  compatibilityDate: '2026-06-30',

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
    model: 'alibaba/qwen3.8-27b',
    models: [
      'alibaba/qwen3.8-27b',
      'deepseek/deepseek-v4-pro-0813'
    ]
  },

  componentMeta: {
    include: ['app/components/TestApi.vue']
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '简体中文' },
      { code: 'en', name: 'English' }
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
    browserRedirect: '/docs/ai/mcp'
  },

  movkNuxtDocs: {
    componentDocs: true,
    a11y: true,
    mermaid: true
  }
})
