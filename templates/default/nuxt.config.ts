export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  modules: ['@nuxt/eslint'],

  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false }
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

  mcp: {
    name: 'Movk Nuxt Docs'
  }
})
