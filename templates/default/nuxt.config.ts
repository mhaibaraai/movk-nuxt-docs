export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: ['@nuxt/eslint'],

  site: {
    name: 'My Docs'
  },

  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },

  compatibilityDate: 'latest',

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
