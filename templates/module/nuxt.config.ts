export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },
  compatibilityDate: 'latest',
  aiChat: {
    model: 'mistral/devstral-2',
    models: [
      'mistral/devstral-2',
      'openrouter/mistralai/devstral-2512:free'
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
  mcp: {
    name: 'Movk Nuxt Docs'
  }
})
