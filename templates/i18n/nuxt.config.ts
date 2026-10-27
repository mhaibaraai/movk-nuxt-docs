export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: ['@nuxt/eslint', '@nuxtjs/i18n'],

  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/en/docs': { redirect: '/en/docs/getting-started', prerender: false }
  },

  compatibilityDate: 'latest',

  site: {
    name: 'My Docs'
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
      { code: 'zh-CN', name: '简体中文' },
      { code: 'en', name: 'English' }
    ]
  },

  mcp: {
    name: 'My Docs'
  }
})
