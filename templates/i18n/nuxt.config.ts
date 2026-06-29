export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: ['@nuxt/eslint', '@nuxtjs/i18n'],

  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/en/docs': { redirect: '/en/docs/getting-started', prerender: false }
  },

  compatibilityDate: 'latest',

  aiChat: {
    model: 'zai/glm-4.7',
    models: [
      'zai/glm-4.7',
      'anthropic/claude-sonnet-4.6',
      'google/gemini-3-flash'
    ]
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ]
  },

  mcp: {
    name: 'Movk Nuxt Docs'
  }
})
