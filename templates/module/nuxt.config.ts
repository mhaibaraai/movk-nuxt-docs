export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },

  compatibilityDate: 'latest',

  aiChat: {
    model: 'openai/gpt-5-nano',
    models: [
      'openai/gpt-5-nano',
      'openrouter/anthropic/claude-haiku-4.5'
    ]
  },

  mcp: {
    name: 'Movk Nuxt Docs'
  }
})
