export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: ['@nuxt/eslint'],

  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false }
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

  mcp: {
    name: 'My Docs'
  }
})
